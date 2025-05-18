// src/components/BlogGrid.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
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

  return (
    <div className="container mt-4">
      <div className="row">
        {blogs.map((blog) => {
          const orientation = imageOrientations[blog.id] || "landscape";

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
                      onClick={() => navigate(`/profile/${blog.authorName}`)}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      {blog.authorName}
                    </a>
                  </p>
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
