import { Flex, Text, Badge } from '@radix-ui/themes'
import { Avatar } from '../ui'

const MessageItem = ({ message, isOwnMessage, showSender, showTime }) => {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()

        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        }

        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        if (date.toDateString() === yesterday.toDateString()) {
            return `어제 ${date.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
            })}`
        }

        return date.toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (message.message_type === 'system') {
        return (
            <Flex justify="center">
                <Badge variant="soft" color="gray" size="1">
                    {message.content}
                </Badge>
            </Flex>
        )
    }

    return (
        <Flex justify={isOwnMessage ? 'end' : 'start'}>
            <Flex
                direction={isOwnMessage ? 'row-reverse' : 'row'}
                gap="2"
                style={{ maxWidth: '75%' }}
            >
                {!isOwnMessage && showSender && (
                    <Avatar
                        fallback={message.sender_name?.charAt(0) || '?'}
                        size="2"
                        color="gray"
                    />
                )}

                <Flex
                    direction="column"
                    align={isOwnMessage ? 'end' : 'start'}
                    gap="1"
                >
                    {!isOwnMessage && showSender && (
                        <Text size="1" color="gray">
                            {message.sender_name || 'Anonymous'}
                        </Text>
                    )}

                    <div
                        className={`px-3 py-2 rounded-lg break-words ${
                            isOwnMessage
                                ? message._isOptimistic
                                    ? 'bg-blue-400 text-white opacity-75'
                                    : 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                        }`}
                    >
                        <Text size="2">{message.content}</Text>
                        {message._isOptimistic && (
                            <Text size="1" color="gray" className="ml-2">📤</Text>
                        )}
                    </div>

                    {showTime && (
                        <Text size="1" color="gray">
                            {formatTime(message.created_at)}
                        </Text>
                    )}
                </Flex>

                {!isOwnMessage && !showSender && (
                    <div className="w-8"></div>
                )}
            </Flex>
        </Flex>
    )
}

export default MessageItem