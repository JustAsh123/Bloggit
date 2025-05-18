import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth"; // your custom auth hook

function BlogGrid({ page }) {
  const [blogs, setBlogs] = useState([]);
  const { username, loading } = useAuth();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogSnap = await getDocs(collection(db, "blogs"));
        const blogList = blogSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (page === "Profile") {
          if (!username || loading) return; // Wait for username to load
          setBlogs(blogList.filter(blog => blog.authorName === username));
        } else {
          setBlogs(blogList);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, [page, username, loading]);

  return (
    <div className="container mt-4">
      <div className="row">
        {blogs.map(blog => (
          <div className="col-md-4 mb-4" key={blog.id}>
            <div className="card h-100">
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  className="card-img-top"
                  alt="Blog Cover"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text text-truncate">{blog.content}</p>
                <p className="text-muted mt-auto mb-2">By {blog.authorName}</p>
                <button className="btn btn-primary btn-sm" disabled>
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogGrid;
