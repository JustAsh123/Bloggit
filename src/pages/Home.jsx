// src/pages/Home.jsx
import { useAuth } from "../hooks/useAuth.jsx";
import BlogGrid from "../components/BlogGrid.jsx";
import "../styles/Home.css";

function Home() {
  const { currentUser, username } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome {username ? username : "to Bloggit"} ✨</h1>
        <p className="hero-subtitle">
          {username
            ? "Explore the latest blogs from the community."
            : "Join us to create and explore amazing blog posts!"}
        </p>
      </div>

      <BlogGrid page="Home" />
    </div>
  );
}

export default Home;
