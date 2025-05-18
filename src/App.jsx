import Navbar from "./components/Navbar"
import { Routes,Route } from "react-router-dom"
import Singup from "./pages/Signup"
import "./styles/App.css"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Singup />}/>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/profile" element={<Profile />}/>
      </Routes>
    </>
  )
}

export default App
