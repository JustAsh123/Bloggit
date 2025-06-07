import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Login from "./pages/Login"
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UploadBlog from "./pages/UploadBlog";
import { Routes,Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const { username } = useAuth(); // we just access to trigger context
  const { loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:displayName" element={<Profile />} />
        <Route path="/upload" element={<UploadBlog />} />
      </Routes>
      <Toaster></Toaster>
    </>
  );
}
export default App;