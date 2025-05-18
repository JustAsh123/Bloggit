import Navbar from "./components/Navbar"
import { Routes,Route } from "react-router-dom"
import Singup from "./pages/Signup"
import "./styles/App.css"
import Home from "./pages/Home"
import Login from "./pages/Login"
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Singup />}/>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
      </Routes>
    </>
  )
}

export default App
