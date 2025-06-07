import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { collection } from "firebase/firestore";
import { db } from "../firebase";
import { getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { SquarePen } from "lucide-react";
import { User } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, username } = useAuth();
  const [pfp, setPfp] = useState("")

  const handleSignout = async () => {
    try {
      await signOut(auth);
      console.log("Signed out.");
      toast.success("Logged out successfully.")
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    const fetchPfp = async ()=>{
      try{
        const q = query(
          collection(db,"users"),
          where("username","==",username)
        );
        const snap = await getDocs(q);
        if(!snap.empty){
          const userData = snap.docs[0].data()
          setPfp(userData.profilePic || "")
        }else{
          setPfp("");
        }
      } catch (error){
        console.log("Error in pfp", error);
        setPfp("");
      }
    }
    fetchPfp();
  },[])

  const toUpload = () => navigate("/upload");
  const toProfile = () => navigate(`/profile/${username}`);
  const toSignup = () => navigate("/signup");
  const toLogin = () => navigate("/login");
  const toHome = () => navigate("/");

  return (
    <div className="navbar bg-base-300 shadow-xl">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl" onClick={toHome}>
      <MessageSquare/> 
      Bloggit</a>
  </div>
  <div className="flex-none text-2xl">
    {currentUser?(
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src={pfp==""?"/default.png":pfp} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow text-xl ">
        <li>
          <a onClick={toProfile}>
            <User />
            Profile
          </a>
        </li>
        <li><button onClick={toUpload}><SquarePen />New Post</button></li>
        <li><a onClick={handleSignout}><LogOut />Logout</a></li>
      </ul>
    </div>
    ):
    <div className="flex items-center justify-end gap-2">
      <button className="btn btn-primary" onClick={toSignup}>Sign Up</button>
      <button className="btn btn-outline" onClick={toLogin}>Log In</button>
    </div>}
  </div>
</div>
  );
}

export default Navbar;
