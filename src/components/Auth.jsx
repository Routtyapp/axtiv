import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://nhvhujoentbvkgpanwwg.supabase.co/auth/v1/callback'
      }
    })
    if (error) {
      console.error('Error logging in:', error.message)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error.message)
    }
  }

  if (loading) {
    return <div>로딩 중...</div>
  }

  if (user) {
    return (
      <div>
        <h2>환영합니다, {user.user_metadata.full_name}!</h2>
        <p>이메일: {user.email}</p>
        {user.user_metadata.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt="프로필"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        )}
        <br />
        <button onClick={signOut}>로그아웃</button>
      </div>
    )
  }

  return (
    <div>
      <h2>로그인</h2>
      <button onClick={signInWithGoogle}>Google로 로그인</button>
    </div>
  )
}