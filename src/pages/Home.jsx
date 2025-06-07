// src/pages/Home.jsx
import { useAuth } from "../hooks/useAuth.jsx";
import BlogGrid from "../components/BlogGrid.jsx";

function Home() {
  const { currentUser, username } = useAuth();

  return (
    <div className="home-container">
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-base-200 rounded-lg shadow-md max-w-3xl mx-auto">
  <h1 className="text-5xl font-extrabold text-primary mb-4">
    Welcome {username ? username : "to Bloggit"} ✨
  </h1>
  <p className="text-lg text-gray-500 max-w-xl">
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
