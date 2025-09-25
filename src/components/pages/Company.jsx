import { useState, useEffect } from "react"
import { Link } from "react-router"
import { Flex, Heading, Text, Grid } from '@radix-ui/themes'
import { supabase } from "../../lib/supabase"
import userStore from "../../store/userStore"
import { Button, Card, Avatar, Badge, Dialog, Input, Spinner } from '../ui'
import { Container, Header, Breadcrumb } from '../layout'

const Company = () => {
    const { user } = userStore()
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [companyName, setCompanyName] = useState("")
    const [companyDescription, setCompanyDescription] = useState("")
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        if (user?.auth_id) {
            fetchUserCompanies()
        }
    }, [user])

    const fetchUserCompanies = async () => {
        try {
            const { data, error } = await supabase
                .from("usercompany")
                .select(`
                    *,
                    company (
                        id,
                        name,
                        description,
                        logo_url,
                        created_at
                    )
                `)
                .eq("user_id", user.auth_id)

            if (error) {
                console.error("Error fetching companies:", error.message)
                return
            }

            setCompanies(data || [])
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    const createCompany = async () => {
        if (!companyName.trim()) {
            alert("회사명을 입력해주세요.")
            return
        }

        setCreating(true)
        try {
            // 1. Company 테이블에 새 회사 생성
            const { data: companyData, error: companyError } = await supabase
                .from("company")
                .insert({
                    name: companyName.trim(),
                    description: companyDescription.trim() || null,
                    owner_id: user.auth_id
                })
                .select()
                .single()

            if (companyError) {
                console.error("Error creating company:", companyError.message)
                alert("회사 생성 중 오류가 발생했습니다.")
                return
            }

            // 2. UserCompany 테이블에 사용자-회사 관계 생성 (owner 권한)
            const { error: userCompanyError } = await supabase
                .from("usercompany")
                .insert({
                    user_id: user.auth_id,
                    company_id: companyData.id,
                    role: "owner"
                })

            if (userCompanyError) {
                console.error("Error creating user-company relationship:", userCompanyError.message)
                alert("사용자 권한 설정 중 오류가 발생했습니다.")
                return
            }

            // 3. 성공 처리
            alert("회사가 성공적으로 생성되었습니다!")
            setCompanyName("")
            setCompanyDescription("")
            setShowCreateModal(false)

            // 4. 회사 목록 새로고침
            await fetchUserCompanies()

        } catch (error) {
            console.error("Error:", error)
            alert("회사 생성 중 오류가 발생했습니다.")
        } finally {
            setCreating(false)
        }
    }

    const handleCloseModal = () => {
        setShowCreateModal(false)
        setCompanyName("")
        setCompanyDescription("")
    }

    const breadcrumbItems = [
        { label: '홈', href: '/' },
        { label: '내 회사' }
    ]

    if (!user) {
        return (
            <Container>
                <div className="p-6">
                    <Flex justify="center" align="center" style={{ minHeight: '40vh' }}>
                        <Card style={{ maxWidth: '400px' }}>
                            <Flex direction="column" align="center" gap="4" p="6">
                                <Text>로그인이 필요합니다.</Text>
                                <Link to="/login">
                                    <Button>로그인하기</Button>
                                </Link>
                            </Flex>
                        </Card>
                    </Flex>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <div className="p-6">
                <Breadcrumb items={breadcrumbItems} />

                <Header
                    title="내 회사"
                    subtitle="소속된 회사들을 관리하고 워크스페이스에 접근하세요"
                    actions={
                        <Flex gap="2">
                            <Button
                                variant="solid"
                                onClick={() => setShowCreateModal(true)}
                            >
                                회사 생성하기
                            </Button>
                            <Link to="/">
                                <Button variant="soft" color="gray">
                                    홈으로
                                </Button>
                            </Link>
                        </Flex>
                    }
                />

                {loading ? (
                    <Flex justify="center" py="9">
                        <Spinner size="3" text="회사 목록을 불러오는 중..." />
                    </Flex>
                ) : companies.length === 0 ? (
                    <Flex justify="center" align="center" style={{ minHeight: '40vh' }}>
                        <Card style={{ maxWidth: '500px', width: '100%' }}>
                            <Flex direction="column" align="center" gap="4" p="6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    🏢
                                </div>
                                <Flex direction="column" align="center" gap="2">
                                    <Heading size="5" weight="bold">소속된 회사가 없습니다</Heading>
                                    <Text size="3" color="gray" align="center">
                                        새 회사를 생성하거나 다른 회사에 초대받아 시작하세요
                                    </Text>
                                </Flex>
                                <Button
                                    size="3"
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    첫 번째 회사 생성하기
                                </Button>
                            </Flex>
                        </Card>
                    </Flex>
                ) : (
                    <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4" mt="6">
                        {companies.map(({ company, role }) => (
                            <Card key={company.id} className="hover:shadow-lg transition-shadow">
                                <Flex direction="column" gap="4" p="5">
                                    <Flex align="center" gap="3">
                                        <Avatar
                                            src={company.logo_url}
                                            alt={company.name}
                                            fallback={company.name.charAt(0)}
                                            size="4"
                                        />
                                        <Flex direction="column" gap="1">
                                            <Heading size="4" weight="bold">
                                                {company.name}
                                            </Heading>
                                            <Badge
                                                variant="soft"
                                                color={role === 'owner' ? 'blue' : 'gray'}
                                                size="1"
                                            >
                                                {role === 'owner' ? '소유자' : '멤버'}
                                            </Badge>
                                        </Flex>
                                    </Flex>

                                    {company.description && (
                                        <Text size="2" color="gray">
                                            {company.description}
                                        </Text>
                                    )}

                                    <Flex justify="between" align="center" mt="2">
                                        <Text size="1" color="gray">
                                            생성일: {new Date(company.created_at).toLocaleDateString()}
                                        </Text>
                                        <Link to={`/company/${company.id}/workspaces`}>
                                            <Button variant="solid" size="2">
                                                워크스페이스 보기
                                            </Button>
                                        </Link>
                                    </Flex>
                                </Flex>
                            </Card>
                        ))}
                    </Grid>
                )}

                {/* 회사 생성 다이얼로그 */}
                <Dialog
                    open={showCreateModal}
                    onOpenChange={setShowCreateModal}
                    title="새 회사 생성"
                    description="새로운 회사를 생성하고 팀원들과 함께 협업을 시작하세요."
                    confirmText={creating ? "생성 중..." : "회사 생성"}
                    cancelText="취소"
                    onConfirm={createCompany}
                    onCancel={handleCloseModal}
                    confirmDisabled={creating || !companyName.trim()}
                >
                    <Flex direction="column" gap="4">
                        <Input
                            label="회사명 *"
                            placeholder="회사명을 입력하세요"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />

                        <Input
                            label="회사 설명 (선택사항)"
                            placeholder="회사에 대한 간단한 설명을 입력하세요"
                            multiline
                            rows={3}
                            value={companyDescription}
                            onChange={(e) => setCompanyDescription(e.target.value)}
                        />
                    </Flex>
                </Dialog>
            </div>
        </Container>
    )
}

export default Company