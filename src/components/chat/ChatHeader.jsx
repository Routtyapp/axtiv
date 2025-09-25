import { Flex, Heading, Text } from '@radix-ui/themes'
import { Button, Badge, Tooltip } from '../ui'

const ChatHeader = ({ workspaceName, onlineCount, showMembers, onToggleMembers, realtimeStatus }) => {
    const getStatusColor = () => {
        switch (realtimeStatus) {
            case 'SUBSCRIBED': return 'bg-green-500'
            case 'CHANNEL_ERROR': return 'bg-red-500'
            case 'TIMED_OUT': return 'bg-orange-500'
            case 'CLOSED': return 'bg-gray-500'
            default: return 'bg-yellow-500'
        }
    }

    const getStatusText = () => {
        switch (realtimeStatus) {
            case 'SUBSCRIBED': return '실시간 연결됨'
            case 'CHANNEL_ERROR': return '연결 오류'
            case 'TIMED_OUT': return '연결 시간초과'
            case 'CLOSED': return '연결 종료'
            default: return '연결 중...'
        }
    }

    return (
        <div className="border-b border-gray-200 p-4">
            <Flex align="center" justify="between">
                <Flex direction="column" gap="1">
                    <Flex align="center" gap="2">
                        <Heading size="4" weight="medium">팀 채팅</Heading>
                        <Tooltip content={getStatusText()}>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
                        </Tooltip>
                    </Flex>
                    <Text size="2" color="gray">{workspaceName}</Text>
                </Flex>
                <Button
                    variant={showMembers ? "solid" : "soft"}
                    color={showMembers ? "blue" : "gray"}
                    size="2"
                    onClick={onToggleMembers}
                >
                    <Flex align="center" gap="2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <Text size="2">{onlineCount}</Text>
                    </Flex>
                </Button>
            </Flex>
        </div>
    )
}

export default ChatHeader