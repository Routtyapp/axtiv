import userStore from "../store/userStore";

const Test = () => {
    const {
        user
    } = userStore()

    console.log(user)
    
    return (
        <div>
            Test
            <p>{user && user.auth_id}</p>
        </div>
    );
}

export default Test;