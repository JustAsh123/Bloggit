// src/pages/Profile.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import BlogGrid from "../components/BlogGrid";
import "../styles/Profile.css";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { displayName } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pfp, setPfp] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false); // NEW
  const { username } = useAuth();
  const navigate = useNavigate();

  const isOwnProfile = displayName === username;

  const handleChangePfp = async () => {
    if (!selectedFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "blog_uploads");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/djxmd61lq/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const imageUrl = data.secure_url;

      const q = query(collection(db, "users"), where("username", "==", username));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const userDoc = snap.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), {
          profilePic: imageUrl,
        });
        setPfp(imageUrl);
        setSelectedFile(null);
        navigate(`/profile/${displayName}`);
      }
    } catch (error) {
      console.error("Error uploading profile pic:", error);
    } finally {
      setUploading(false);
      document.getElementById("closeModalBtn")?.click();
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          where("authorName", "==", displayName)
        );
        const snap = await getDocs(q);
        const userBlogs = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(userBlogs);
      } catch (err) {
        console.error("Error fetching user blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPfp = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("username", "==", displayName)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const userData = snap.docs[0].data();
          setPfp(userData.profilePic || "");
        } else {
          setPfp("");
        }
      } catch (error) {
        console.log("Error fetching profile pic:", error);
        setPfp("");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
    fetchPfp();
  }, [displayName]);

  if (loading) return <p className="text-center mt-4">Loading profile...</p>;

  return (
    <>
      <div className="container mt-4 d-flex align-items-center gap-3">
        {isOwnProfile ? (
          <div
            className="pfp-wrapper"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <img
              className="profile-pfp"
              src={pfp === "" ? "/default.png" : pfp}
              alt="profile"
            />
            <div className="pfp-overlay">
              <Pencil size={24} />
            </div>
          </div>
        ) : (
          <img
            className="profile-pfp"
            src={pfp === "" ? "/default.png" : pfp}
            alt="profile"
          />
        )}
        <h2>{displayName}</h2>
      </div>

      {/* Modal for changing PFP */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Change PFP
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModalBtn" // NEW
              ></button>
            </div>
            <div className="modal-body">
              {uploading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2">Uploading image...</p>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleChangePfp}
                disabled={uploading} // Disable button while uploading
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <BlogGrid blogs={blogs} page="Profile" />
    </>
  );
}

export default Profile;
