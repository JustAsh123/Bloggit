import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, username } = useAuth();

  const handleSignout = async () => {
    try {
      await signOut(auth);
      console.log("Signed out.");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const toUpload = () => navigate("/upload");
  const toProfile = () => navigate(`/profile/${username}`);
  const toSignup = () => navigate("/signup");
  const toLogin = () => navigate("/login");
  const toHome = () => navigate("/");

  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand custom-brand" onClick={toHome}>
          Home
        </a>
        <button
          className="navbar-toggler text-white"
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
          <div className="ms-auto d-flex gap-2 align-items-center">
            {!currentUser ? (
              <>
                <button
                  className="btn btn-outline-light"
                  onClick={toSignup}
                  type="button"
                >
                  Sign Up
                </button>
                <button
                  className="btn btn-light"
                  onClick={toLogin}
                  type="button"
                >
                  Login
                </button>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-dark dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-dark">
                  <li>
                    <a className="dropdown-item" onClick={toProfile}>
                      My Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={toUpload}>
                      New Post
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleSignout}>
                      Sign Out
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
