import { useAuth } from "../hooks/useAuth.jsx";

function Home(){
    const {currentUser, username} = useAuth();

    return(
        <div>
            {currentUser?(
                <h1>Welcome, {username}</h1>
            ):(
                <h1>Please Log in.</h1>
            )}
        </div>
    )
}

export default Home;