import { useState, useEffect } from "react"
import { useParams, Link } from "react-router"
import { Flex, Heading, Text, Grid } from '@radix-ui/themes'
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/AuthContext"
import { Button, Card, Badge, Spinner, IconButton, Tooltip } from '../ui'
import { Container, Header, Breadcrumb } from '../layout'
import ChatSidebar from "../chat/ChatSidebar"

const WorkspaceDetail = () => {
    const { companyId, workspaceId } = useParams()
    const { user, isAuthenticated, loading: authLoading } = useAuth()
    const [workspace, setWorkspace] = useState(null)
    const [company, setCompany] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showChat, setShowChat] = useState(true)

    useEffect(() => {
        if (companyId && workspaceId && user && !authLoading) {
            fetchWorkspaceAndCompany()
        }
    }, [companyId, workspaceId, user, authLoading])

    const fetchWorkspaceAndCompany = async () => {
        try {
            const { data: workspaceData, error: workspaceError } = await supabase
                .from("workspace")
                .select("*")
                .eq("id", workspaceId)
                .single()

            if (workspaceError) {
                console.error("Error fetching workspace:", workspaceError.message)
                return
            }

            setWorkspace(workspaceData)

            const { data: companyData, error: companyError } = await supabase
                .from("company")
                .select("*")
                .eq("id", companyId)
                .single()

            if (companyError) {
                console.error("Error fetching company:", companyError.message)
                return
            }

            setCompany(companyData)

        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    const breadcrumbItems = [
        { label: '홈', href: '/' },
        { label: '내 회사', href: '/companies' },
        { label: company?.name + ' 워크스페이스', href: `/company/${companyId}/workspaces` },
        { label: workspace?.name }
    ]

    if (authLoading) {
        return (
            <Container>
                <div className="p-6">
                    <Flex justify="center" py="9">
                        <Spinner size="3" text="인증 확인 중..." />
                    </Flex>
                </div>
            </Container>
        )
    }

    if (!isAuthenticated() || !user) {
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

    if (loading) {
        return (
            <Container>
                <div className="p-6">
                    <Flex justify="center" py="9">
                        <Spinner size="3" text="워크스페이스를 불러오는 중..." />
                    </Flex>
                </div>
            </Container>
        )
    }

    if (!workspace || !company) {
        return (
            <Container>
                <div className="p-6">
                    <Flex justify="center" align="center" style={{ minHeight: '40vh' }}>
                        <Card style={{ maxWidth: '400px' }}>
                            <Flex direction="column" align="center" gap="4" p="6">
                                <Text>워크스페이스를 찾을 수 없습니다.</Text>
                                <Link to="/companies">
                                    <Button>회사 목록으로 돌아가기</Button>
                                </Link>
                            </Flex>
                        </Card>
                    </Flex>
                </div>
            </Container>
        )
    }

    return (
        <div className="h-screen flex bg-gray-50">
            <div className={`flex-1 overflow-y-auto transition-all duration-300`}>
                <Container>
                    <div className="p-6">
                        <Breadcrumb items={breadcrumbItems} />

                        <Header
                            title={workspace.name}
                            subtitle={`${company.name}의 워크스페이스${workspace.description ? ` · ${workspace.description}` : ''}`}
                            actions={
                                <Flex gap="2" align="center">
                                    <Tooltip content={showChat ? '채팅 숨기기' : '채팅 보기'}>
                                        <IconButton
                                            variant={showChat ? "solid" : "soft"}
                                            color={showChat ? "blue" : "gray"}
                                            onClick={() => setShowChat(!showChat)}
                                        >
                                            💬
                                        </IconButton>
                                    </Tooltip>
                                    <Link to={`/company/${companyId}/workspaces`}>
                                        <Button variant="soft" color="gray">
                                            워크스페이스 목록
                                        </Button>
                                    </Link>
                                    <Link to="/">
                                        <Button variant="solid">
                                            홈으로
                                        </Button>
                                    </Link>
                                </Flex>
                            }
                        />

                        <Grid columns={{ initial: '1', lg: '2' }} gap="4" mt="6">
                            <Card>
                                <Flex direction="column" gap="4" p="5">
                                    <Flex align="center" gap="2">
                                        <Heading size="4" weight="bold">워크스페이스 정보</Heading>
                                        <Badge variant="soft" color="green">활성</Badge>
                                    </Flex>
                                    <Flex direction="column" gap="3">
                                        <div>
                                            <Text size="2" weight="medium" color="gray">워크스페이스명</Text>
                                            <Text size="3">{workspace.name}</Text>
                                        </div>
                                        {workspace.description && (
                                            <div>
                                                <Text size="2" weight="medium" color="gray">설명</Text>
                                                <Text size="3">{workspace.description}</Text>
                                            </div>
                                        )}
                                        <div>
                                            <Text size="2" weight="medium" color="gray">생성일</Text>
                                            <Text size="3">{new Date(workspace.created_at).toLocaleString()}</Text>
                                        </div>
                                    </Flex>
                                </Flex>
                            </Card>

                            <Card>
                                <Flex direction="column" gap="4" p="5">
                                    <Heading size="4" weight="bold">소속 회사</Heading>
                                    <Flex direction="column" gap="3">
                                        <div>
                                            <Text size="2" weight="medium" color="gray">회사명</Text>
                                            <Text size="3">{company.name}</Text>
                                        </div>
                                        {company.description && (
                                            <div>
                                                <Text size="2" weight="medium" color="gray">회사 설명</Text>
                                                <Text size="3">{company.description}</Text>
                                            </div>
                                        )}
                                        <div>
                                            <Link to={`/company/${companyId}/workspaces`}>
                                                <Button variant="soft" size="2">
                                                    다른 워크스페이스 보기 →
                                                </Button>
                                            </Link>
                                        </div>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Grid>

                        <Card mt="6">
                            <Flex direction="column" gap="4" p="5">
                                <Heading size="4" weight="bold">워크스페이스 관리</Heading>
                                <Text size="2" color="gray">
                                    이 워크스페이스에서 프로젝트와 작업을 관리할 수 있습니다.
                                </Text>
                                <Flex gap="2" wrap="wrap" mt="2">
                                    <Button
                                        variant="solid"
                                        color="green"
                                        onClick={() => alert("프로젝트 관리 기능은 준비 중입니다.")}
                                    >
                                        프로젝트 관리
                                    </Button>
                                    <Button
                                        variant="solid"
                                        color="purple"
                                        onClick={() => alert("팀 관리 기능은 준비 중입니다.")}
                                    >
                                        팀 관리
                                    </Button>
                                    <Button
                                        variant="solid"
                                        color="orange"
                                        onClick={() => alert("설정 기능은 준비 중입니다.")}
                                    >
                                        워크스페이스 설정
                                    </Button>
                                </Flex>
                            </Flex>
                        </Card>
                    </div>
                </Container>
            </div>

            {showChat && (
                <div className="w-96 border-l border-gray-200 bg-white shadow-lg">
                    <ChatSidebar
                        workspaceId={workspaceId}
                        workspaceName={workspace.name}
                    />
                </div>
            )}
        </div>
    )
}

export default WorkspaceDetail