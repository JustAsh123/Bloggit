// src/components/BlogGrid.jsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function BlogGrid({ page, blogs: externalBlogs }) {
  const [blogs, setBlogs] = useState([]);
  const { username, loading } = useAuth();
  const navigate = useNavigate();
  const [imageOrientations, setImageOrientations] = useState({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogSnap = await getDocs(collection(db, "blogs"));
        const blogList = blogSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        blogList.sort((a, b) => {
          const aTime = a.createdAt?.toMillis() || 0;
          const bTime = b.createdAt?.toMillis() || 0;
          return bTime - aTime;
        });

        if (page === "Profile") {
          if (!username || loading) return;
          setBlogs(blogList.filter((blog) => blog.authorName === username));
        } else {
          setBlogs(blogList);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    if (externalBlogs) {
      setBlogs(externalBlogs);
    } else {
      fetchBlogs();
    }
  }, [page, username, loading, externalBlogs]);

  const onImageLoad = (e, blogId) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageOrientations((prev) => ({
      ...prev,
      [blogId]: naturalHeight > naturalWidth ? "portrait" : "landscape",
    }));
  };

  const toggleLike = async (blogId) => {
    if (!auth.currentUser) {
      alert("You must be logged in to like posts!");
      return;
    }

    const blogRef = doc(db, "blogs", blogId);
    const userId = auth.currentUser.uid;

    const blog = blogs.find((b) => b.id === blogId);
    if (!blog) return;

    const userLiked = blog.likes?.includes(userId);

    try {
      if (userLiked) {
        await updateDoc(blogRef, { likes: arrayRemove(userId) });
      } else {
        await updateDoc(blogRef, { likes: arrayUnion(userId) });
      }
      // Optimistic UI update:
      setBlogs((prevBlogs) =>
        prevBlogs.map((b) =>
          b.id === blogId
            ? {
                ...b,
                likes: userLiked
                  ? b.likes.filter((id) => id !== userId)
                  : [...(b.likes || []), userId],
              }
            : b
        )
      );
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleDelete = async (blogId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "blogs", blogId));
      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete blog.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {blogs.map((blog) => {
          const orientation = imageOrientations[blog.id] || "landscape";
          const likesCount = blog.likes ? blog.likes.length : 0;
          const isLiked = blog.likes?.includes(auth.currentUser?.uid);

          return (
            <div className="col-md-4 mb-4" key={blog.id}>
              <div className="card h-100">
                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl}
                    alt="Blog Cover"
                    onLoad={(e) => onImageLoad(e, blog.id)}
                    style={
                      orientation === "portrait"
                        ? {
                            width: "auto",
                            maxHeight: "300px",
                            display: "block",
                            margin: "0 auto",
                          }
                        : { width: "100%", height: "auto" }
                    }
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text">{blog.content}</p>
                  <p className="text-muted mt-auto mb-2">
                    By{" "}
                    <a
                      href="#!"
                      onClick={() => navigate(`/profile/${blog.authorName}`)}
                    >
                      {blog.authorName}
                    </a>
                  </p>
                  <button
                    className={`btn btn-sm ${
                      isLiked ? "btn-danger" : "btn-outline-danger"
                    }`}
                    onClick={() => toggleLike(blog.id)}
                  >
                    {isLiked ? "♥" : "♡"} {likesCount}
                  </button>

                  {/* Show delete button only on Profile page and if current user is author */}
                  {page === "Profile" && blog.authorId === auth.currentUser?.uid && (
                    <button
                      className="btn btn-sm btn-outline-secondary mt-2"
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BlogGrid;
