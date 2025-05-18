import { useAuth } from "../hooks/useAuth.jsx";

function Home(){
    const {currentUser, username} = useAuth();

    return(
        <div>
            <h1>Homepage</h1>
        </div>
    )
}

export default Home;