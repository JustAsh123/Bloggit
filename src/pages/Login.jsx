import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BookOpenText, Mail, Lock } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Incorrect user credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 min-h-screen text-center">
      <BookOpenText size={64} className="mb-4" />
      <h1 className="text-4xl font-bold text-base-content">Log in</h1>
      <p className="text-lg pt-2 pb-8 text-gray-400">
        Log in to continue your Blog journey.
      </p>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 text-left"
      >
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

        <button
          type="submit"
          className="btn btn-primary w-full text-lg"
        >
          Log in
        </button>

        <p className="text-sm text-gray-500 text-center pt-2">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Sign up!
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
