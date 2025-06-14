import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

function BlogGrid({ page, blogs: externalBlogs }) {
  const [blogs, setBlogs] = useState([]);
  const { username, loading } = useAuth();
  const navigate = useNavigate();
  const [authorProfiles, setAuthorProfiles] = useState({});

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

        let filteredBlogs = blogList;
        if (page === "Profile") {
          if (!username || loading) return;
          filteredBlogs = blogList.filter(
            (blog) => blog.authorName === username
          );
        }

        setBlogs(filteredBlogs);

        // Fetch profile pictures
        const uniqueUserIds = [
          ...new Set(filteredBlogs.map((blog) => blog.authorId)),
        ];
        const userProfiles = {};
        await Promise.all(
          uniqueUserIds.map(async (userId) => {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              userProfiles[userId] = userSnap.data();
            }
          })
        );
        setAuthorProfiles(userProfiles);
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

  const toggleLike = async (blogId) => {
    if (!auth.currentUser) {
      toast.error("You must be logged in to do that.");
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      console.log("Attempting to delete blog ID:", blogId);
      await deleteDoc(doc(db, "blogs", blogId));
      console.log("Blog deleted from Firestore");

      setBlogs((prev) => {
        const updated = prev.filter((b) => b.id !== blogId);
        console.log("Updated blogs after deletion:", updated);
        return updated;
      });

      toast.success("Blog deleted.");
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete blog.");
    }
  };

  return (
    <div className="px-2 py-10 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
        {blogs.map((blog) => {
          const likesCount = blog.likes ? blog.likes.length : 0;
          const isLiked = blog.likes?.includes(auth.currentUser?.uid);
          const author = authorProfiles[blog.authorId];
          const profilePictureUrl = author?.profilePic || "/default.png";

          return (
            <div
              key={blog.id}
              className="card bg-base-300 border shadow-md w-[25rem] transition duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-lg"
            >
              <figure className="h-72 w-full overflow-hidden rounded-t-md">
                <img src={blog.imageUrl || "/default-featured-image.png.jpg"} className="w-full h-full" alt="Blog" />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-xl font-semibold line-clamp-1">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-300 line-clamp-3">
                  {blog.content}
                </p>
                <div className="card-actions justify-between items-center mt-4">
                  <Link to={`/profile/${blog.authorName}`}>
                    <div className="flex items-center">
                      <img
                        src={profilePictureUrl}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="Author"
                      />
                      <p className="ml-3 font-medium">{blog.authorName}</p>
                    </div>
                  </Link>
                  <div className="flex flex-col gap-1">
                    <button
                      className={`btn btn-sm ${
                        isLiked ? "btn-error" : "btn-outline btn-secondary"
                      }`}
                      onClick={() => toggleLike(blog.id)}
                    >
                      <Heart size={18} />
                      {likesCount}
                    </button>
                    {page == "profile" && blog.authorName == username && (
                      <button
                        className="btn btn-outline hover:border-pink-600"
                        onClick={()=>handleDelete(blog.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
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
