import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const useRealtimeChat = (workspaceId, user) => {
    const [messages, setMessages] = useState([])
    const [onlineMembers, setOnlineMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [realtimeStatus, setRealtimeStatus] = useState('disconnected')

    // 기존 메시지 로드
    const fetchMessages = async () => {
        if (!workspaceId) return

        try {
            const { data, error } = await supabase
                .from('chatmessage')
                .select('*')
                .eq('workspace_id', workspaceId)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching messages:', error)
                setError(error.message)
                return
            }

            setMessages(data || [])
        } catch (err) {
            console.error('Error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // 워크스페이스 멤버 확인 및 자동 추가
    const ensureWorkspaceMember = async () => {
        if (!workspaceId || !user?.id) return

        try {
            console.log('🔍 사용자 워크스페이스 멤버 확인:', { workspaceId, userId: user.id })

            // 이미 멤버인지 확인
            const { data: existingMember } = await supabase
                .from('workspacemember')
                .select('*')
                .eq('workspace_id', workspaceId)
                .eq('user_id', user.id)
                .single()

            if (!existingMember) {
                console.log('➕ 새 워크스페이스 멤버 추가')
                // 멤버로 추가
                const { error } = await supabase
                    .from('workspacemember')
                    .insert({
                        workspace_id: workspaceId,
                        user_id: user.id,
                        role: 'member',
                        is_online: true
                    })

                if (error) {
                    console.error('❌ 워크스페이스 멤버 추가 오류:', error)
                } else {
                    console.log('✅ 워크스페이스 멤버 추가 성공')
                }
            } else {
                console.log('🔄 기존 멤버 온라인 상태 업데이트')
                // 온라인 상태로 업데이트
                const { error } = await supabase
                    .from('workspacemember')
                    .update({
                        is_online: true,
                        last_seen: new Date().toISOString()
                    })
                    .eq('id', existingMember.id)

                if (error) {
                    console.error('❌ 온라인 상태 업데이트 오류:', error)
                } else {
                    console.log('✅ 온라인 상태 업데이트 성공')
                }
            }
        } catch (err) {
            console.error('❌ 워크스페이스 멤버 처리 오류:', err)
        }
    }

    // 온라인 멤버 로드
    const fetchOnlineMembers = async () => {
        if (!workspaceId) return

        try {
            const { data, error } = await supabase
                .from('workspacemember')
                .select('*')
                .eq('workspace_id', workspaceId)
                .eq('is_online', true)

            if (error) {
                console.error('Error fetching online members:', error)
                return
            }

            setOnlineMembers(data || [])
        } catch (err) {
            console.error('Error:', err)
        }
    }

    // 메시지 전송
    const sendMessage = async (content) => {
        if (!content.trim() || !workspaceId || !user?.id) return

        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const optimisticMessage = {
            id: tempId,
            workspace_id: workspaceId,
            sender_id: user.id,
            sender_name: user.email?.split('@')[0] || user.user_metadata?.full_name || 'Anonymous',
            content: content.trim(),
            message_type: 'text',
            created_at: new Date().toISOString(),
            _isOptimistic: true
        }

        try {
            console.log('📤 메시지 전송 시도:', { content, workspaceId, senderId: user.id })

            // Optimistic Update - 즉시 UI에 메시지 표시
            setMessages(prev => [...prev, optimisticMessage])

            const messageData = {
                workspace_id: workspaceId,
                sender_id: user.id,
                sender_name: optimisticMessage.sender_name,
                content: content.trim(),
                message_type: 'text'
            }

            const { data, error } = await supabase
                .from('chatmessage')
                .insert(messageData)
                .select()

            if (error) {
                console.error('❌ 메시지 전송 오류:', error)
                // 전송 실패 시 optimistic 메시지 제거
                setMessages(prev => prev.filter(msg => msg.id !== tempId))
                setError(error.message)
            } else {
                console.log('✅ 메시지 전송 성공:', data)

                // 성공 시 optimistic 메시지를 실제 메시지로 교체
                setMessages(prev => prev.map(msg =>
                    msg.id === tempId ? { ...data[0], _isOptimistic: false } : msg
                ))
            }
        } catch (err) {
            console.error('❌ 메시지 전송 에러:', err)
            // 전송 실패 시 optimistic 메시지 제거
            setMessages(prev => prev.filter(msg => msg.id !== tempId))
            setError(err.message)
        }
    }

    // 오프라인 상태로 업데이트
    const updateOfflineStatus = async () => {
        if (!workspaceId || !user?.id) return

        try {
            console.log('📴 오프라인 상태 업데이트')
            await supabase
                .from('workspacemember')
                .update({
                    is_online: false,
                    last_seen: new Date().toISOString()
                })
                .eq('workspace_id', workspaceId)
                .eq('user_id', user.id)
        } catch (err) {
            console.error('❌ 오프라인 상태 업데이트 오류:', err)
        }
    }

    // 새 메시지 처리
    const handleNewMessage = (payload) => {
        console.log('📨 새 메시지 수신:', payload)
        if (payload.eventType === 'INSERT') {
            setMessages(prev => {
                // 이미 optimistic update로 추가된 메시지인지 확인
                const optimisticIndex = prev.findIndex(msg =>
                    msg._isOptimistic &&
                    msg.sender_id === payload.new.sender_id &&
                    msg.content === payload.new.content
                )

                if (optimisticIndex !== -1) {
                    // optimistic 메시지를 실제 메시지로 교체
                    console.log('🔄 Optimistic 메시지를 실제 메시지로 교체:', payload.new.id)
                    const newMessages = [...prev]
                    newMessages[optimisticIndex] = { ...payload.new, _isOptimistic: false }
                    return newMessages
                }

                // 중복 방지 (같은 ID의 메시지가 이미 있는 경우)
                const isDuplicate = prev.some(msg => msg.id === payload.new.id)
                if (isDuplicate) {
                    console.log('🔄 중복 메시지 무시:', payload.new.id)
                    return prev
                }

                // 새 메시지 추가
                console.log('✅ 새 메시지 추가:', payload.new)
                return [...prev, payload.new]
            })
        }
    }

    // 멤버 상태 변경 처리
    const handleMemberUpdate = (payload) => {
        console.log('👥 멤버 상태 변경:', payload)
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            fetchOnlineMembers() // 간단히 다시 로드
        }
    }

    useEffect(() => {
        if (!workspaceId || !user?.id) {
            console.log('⚠️ 워크스페이스 ID 또는 사용자 정보 없음:', { workspaceId, userId: user?.id })
            return
        }

        console.log('🚀 채팅 초기화 시작:', { workspaceId, userId: user.id })

        // 초기 데이터 로드
        const initializeChat = async () => {
            setLoading(true)
            setRealtimeStatus('connecting')

            await ensureWorkspaceMember()
            await fetchMessages()
            await fetchOnlineMembers()

            setLoading(false)
        }

        initializeChat()

        // Realtime 구독 설정
        const channelName = `workspace_chat_${workspaceId}`
        console.log('📡 Realtime 채널 구독 시작:', channelName)

        const channel = supabase
            .channel(channelName)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chatmessage',
                filter: `workspace_id=eq.${workspaceId}`
            }, handleNewMessage)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'workspacemember',
                filter: `workspace_id=eq.${workspaceId}`
            }, handleMemberUpdate)
            .subscribe((status, err) => {
                console.log('📡 Realtime 구독 상태:', status, err)
                setRealtimeStatus(status)
                if (err) {
                    console.error('❌ Realtime 구독 오류:', err)
                    setError(`Realtime 연결 오류: ${err.message}`)
                }
            })

        // 페이지 떠날 때 오프라인 처리
        const handleBeforeUnload = () => {
            updateOfflineStatus()
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            console.log('🔌 채팅 정리 및 연결 해제')
            updateOfflineStatus()
            supabase.removeChannel(channel)
            window.removeEventListener('beforeunload', handleBeforeUnload)
            setRealtimeStatus('disconnected')
        }
    }, [workspaceId, user?.id])

    return {
        messages,
        onlineMembers,
        loading,
        error,
        sendMessage,
        realtimeStatus
    }
}

export default useRealtimeChat