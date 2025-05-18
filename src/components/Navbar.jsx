import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, username } = useAuth();

  const handleSignout = async () => {
    try{
      await signOut(auth);
      console.log("Signed out.");
      navigate("/")
    } catch(error){
      console.log(error);
    }
  }
  
  const toUpload = () => {
    
  }

  const toProfile = () => {
    navigate("/profile");
  }

  const toSignup = () => {
    navigate("/signup");
  };

  const toLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Home
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <div className="ms-auto d-flex gap-2">
              {!currentUser ? (
                <>
                  <button
                    className="btn btn-outline-primary"
                    onClick={toSignup}
                    type="button"
                  >
                    Sign Up
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={toLogin}
                    type="button"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  <div class="dropdown">
                    <button
                      class="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {username}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li>
                        <a class="dropdown-item" onClick={toProfile} href="#">
                          Profile
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" onClick={toUpload} href="#">
                          NewPost
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" onClick={handleSignout} href="#">
                          Sign out
                        </a>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
