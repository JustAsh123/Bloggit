import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cnfPass, setCnfPass] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

    const {currentUser, usn} = useAuth();

  const navigate = useNavigate("/");

    useEffect(()=>{
        alert("Already signed in.")
        if(currentUser){navigate("/")}
    },[])

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (pass !== cnfPass) {
      return setError("Passwords do not match");
    }

    try {
      // Check if username is unique
      const q = query(collection(db, "users"), where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return setError("Username already taken");
      }

      const userCred = await createUserWithEmailAndPassword(auth, email, pass);

      // Save username to Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        username: username,
        email: email,
      });
      navigate("/")
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card w-50">
        <h5 className="card-header">Sign Up!</h5>
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
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
