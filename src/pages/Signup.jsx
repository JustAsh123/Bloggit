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
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { BookOpenText, Mail, User, Lock } from "lucide-react";
import toast from "react-hot-toast";

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
      toast.error("Already Signed in.");
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (pass !== cnfPass) {
      return toast.error("Passwords do not match");
    }

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return toast.error("Username already taken.");
      }

      const userCred = await createUserWithEmailAndPassword(auth, email, pass);

      await setDoc(doc(db, "users", userCred.user.uid), {
        username,
        email,
        profilePic: "",
      });

      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 min-h-screen text-center">
      <BookOpenText size={64} className="mb-4" />
      <h1 className="text-4xl font-bold text-base-content">Sign up</h1>
      <p className="text-lg pt-2 pb-8 text-gray-400">
        Join the Bloggit community to start posting.
      </p>

      <form
        onSubmit={handleSignup}
        className="w-full max-w-md space-y-4 text-left"
      >
        {/* Username */}
        <label className="input input-bordered flex items-center gap-3 w-full">
          <User className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            className="grow bg-transparent focus:outline-none placeholder:text-gray-400"
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        {/* Email */}
        <label className="input input-bordered flex items-center gap-3 w-full">
          <Mail className="w-5 h-5 text-gray-500" />
          <input
            type="email"
            className="grow bg-transparent focus:outline-none placeholder:text-gray-400"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {/* Password */}
        <label className="input input-bordered flex items-center gap-3 w-full">
          <Lock className="w-5 h-5 text-gray-500" />
          <input
            type="password"
            className="grow bg-transparent focus:outline-none placeholder:text-gray-400"
            placeholder="Password"
            required
            onChange={(e) => setPass(e.target.value)}
          />
        </label>

        {/* Confirm Password */}
        <label className="input input-bordered flex items-center gap-3 w-full">
          <Lock className="w-5 h-5 text-gray-500" />
          <input
            type="password"
            className="grow bg-transparent focus:outline-none placeholder:text-gray-400"
            placeholder="Confirm Password"
            required
            onChange={(e) => setCnfPass(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full text-lg"
        >
          Create Account
        </button>

        <p className="text-sm text-gray-500 text-center pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Log in.
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
