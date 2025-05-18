import { useAuth } from "../hooks/useAuth.jsx";
import BlogGrid from "../components/BlogGrid.jsx";

function Home(){
    const {currentUser, username} = useAuth();

    return(
        <div>
            <h1>Homepage</h1>
            <BlogGrid page={"Home"} />
        </div>
    )
}

export default Home;