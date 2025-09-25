import { useState, useRef } from 'react'
import { Flex, Text } from '@radix-ui/themes'
import { Button } from '../ui'

const MessageInput = ({ onSend, disabled }) => {
    const [message, setMessage] = useState('')
    const textareaRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (message.trim() && !disabled) {
            onSend(message.trim())
            setMessage('')
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
            }
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    const handleChange = (e) => {
        setMessage(e.target.value)

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }

    return (
        <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit}>
                <Flex gap="2" align="end">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요... (Enter로 전송, Shift+Enter로 줄바꿈)"
                        disabled={disabled}
                        rows={1}
                        className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed max-h-32"
                        style={{ minHeight: '40px' }}
                    />
                    <Button
                        type="submit"
                        disabled={disabled || !message.trim()}
                        variant="solid"
                    >
                        전송
                    </Button>
                </Flex>
            </form>
            <Text size="1" color="gray" mt="2">
                Enter로 전송, Shift+Enter로 줄바꿈
            </Text>
        </div>
    )
}

export default MessageInput