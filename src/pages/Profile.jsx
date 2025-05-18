import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom";

function Profile(){
    const {currentUser, username} = useAuth();
    const navigate = useNavigate();
    
    if(!currentUser) navigate("/");

    return (
        <h1>Welcome, {username}</h1>
    )
}

export default Profile