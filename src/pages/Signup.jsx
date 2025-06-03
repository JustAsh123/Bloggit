import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cnfPass, setCnfPass] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      alert("Already signed in.");
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (pass !== cnfPass) {
      return setError("Passwords do not match");
    }

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return setError("Username already taken");
      }

      const userCred = await createUserWithEmailAndPassword(auth, email, pass);

      await setDoc(doc(db, "users", userCred.user.uid), {
        username,
        email,
        profilePic : ""
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(100vh - 56px)", paddingTop: "20px", paddingBottom: "20px" }}
    >
      <div className="card w-100 mx-3" style={{ maxWidth: "500px" }}>
        <h5 className="card-header text-center">Sign Up!</h5>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={cnfPass}
                onChange={(e) => setCnfPass(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
