import { useEffect } from "react"
import { supabase } from "../lib/supabase"
import userStore from "../store/userStore"
import { Link } from "react-router"

const Home = () => {
    const {
        user,
        setUser
    } = userStore()

    useEffect(() => {
        const userData = localStorage.getItem("sb-nhvhujoentbvkgpanwwg-auth-token")
        const parsedUser = JSON.parse(userData)
        const userId = parsedUser?.user.id

        if (userId) getUserData(userId)
        else console.log("No user ID found")
    }, [])

    
    const getUserData = async (userId) => {
        const {data, error} = await supabase
        .from("User")
        .select("*")
        .eq("auth_id", userId)
        .single()

        if (error) {
            console.log("Error fetching user data:", error.message)
            alert("사용자 데이터를 불러오는데 실패했습니다.")
            return
        }

        if (data) {
            setUser(data)
            // 저장 직후 확인
            setTimeout(() => {
                console.log("저장된 상태:", userStore.getState().user)  // 👈 추가
            }, 1000)
        }
    }

    return (
    <div>
        Home
        <div>
            {user && <p>{user.auth_id}</p>}
            <Link to="/test">ㄱㄱ</Link>
        </div>
    </div>
    )
}

export default Home