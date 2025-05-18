import { useAuth } from "../hooks/useAuth"
import BlogGrid from "../components/BlogGrid";
import { useNavigate } from "react-router-dom";

function Profile(){
    const {currentUser, username} = useAuth();
    const navigate = useNavigate();
    
    if(!currentUser) navigate("/");

    return (
        <><h1>Welcome, {username}</h1><BlogGrid page={"Profile"} /></>
    )
}

export default Profile