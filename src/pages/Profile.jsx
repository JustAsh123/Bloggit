// src/pages/Profile.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import BlogGrid from "../components/BlogGrid";

function Profile() {
  const { username } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), where("authorName", "==", username));
        const snap = await getDocs(q);
        const userBlogs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(userBlogs);
      } catch (err) {
        console.error("Error fetching user blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [username]);

  if (loading) return <p className="text-center mt-4">Loading profile...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Posts by {username}</h2>
      <BlogGrid blogs={blogs} page="Profile" />
    </div>
  );
}

export default Profile;
