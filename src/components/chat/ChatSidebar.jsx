import { useState } from 'react'
import { Flex, Text } from '@radix-ui/themes'
import { Spinner, Callout } from '../ui'
import { useAuth } from '../../contexts/AuthContext'
import useRealtimeChat from '../../hooks/useRealtimeChat'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import MemberList from './MemberList'

const ChatSidebar = ({ workspaceId, workspaceName }) => {
    const { user, isAuthenticated } = useAuth()
    const { messages, onlineMembers, loading, error, sendMessage, realtimeStatus } = useRealtimeChat(workspaceId, user)
    const [showMembers, setShowMembers] = useState(false)

    if (!isAuthenticated() || !user) {
        return (
            <Flex align="center" justify="center" className="h-full p-4">
                <Text color="gray">로그인이 필요합니다.</Text>
            </Flex>
        )
    }

    if (loading) {
        return (
            <Flex align="center" justify="center" className="h-full p-4">
                <Spinner size="2" text="채팅을 로딩중입니다..." />
            </Flex>
        )
    }

    if (error) {
        return (
            <Flex align="center" justify="center" className="h-full p-4">
                <Callout variant="soft" color="red">
                    <Callout.Icon>⚠️</Callout.Icon>
                    <Callout.Text>
                        채팅 로드 중 오류가 발생했습니다: {error}
                    </Callout.Text>
                </Callout>
            </Flex>
        )
    }

    return (
        <div className="h-full flex flex-col bg-white">
            <ChatHeader
                workspaceName={workspaceName}
                onlineCount={onlineMembers.length}
                showMembers={showMembers}
                onToggleMembers={() => setShowMembers(!showMembers)}
                realtimeStatus={realtimeStatus}
            />

            {showMembers && (
                <MemberList
                    members={onlineMembers}
                    currentUserId={user.id}
                />
            )}

            <MessageList
                messages={messages}
                currentUserId={user.id}
            />

            <MessageInput
                onSend={sendMessage}
                disabled={false}
            />
        </div>
    )
}

export default ChatSidebar