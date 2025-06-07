// src/pages/Profile.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import BlogGrid from "../components/BlogGrid";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { displayName } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pfp, setPfp] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { username } = useAuth();
  const navigate = useNavigate();

  const isOwnProfile = displayName === username;

  const handleChangePfp = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "blog_uploads");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/djxmd61lq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      const imageUrl = data.secure_url;

      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
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
      toast.success("Pfp Changed.");
    }
  };

  useEffect(() => {
    if (selectedFile) {
      handleChangePfp();
    }
  }, [selectedFile]);

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
          console.log(pfp);
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
    <div className="flex min-h-screen flex-col ">
      <div className="flex gap-4 items-center text-2xl sm:flex-col lg:flex-row max-w-screen-2xl mx-auto">
        {isOwnProfile ? (
          <div className="w-32 relative group">
            <img
              className="w-full rounded-full"
              src={pfp === "" ? "/default.png" : pfp}
              alt="profile"
            />

            {/* Overlay and Pencil Icon */}
            <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Pencil className="text-white w-6 h-6" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <img
            className="rounded-full"
            src={pfp === "" ? "/default.png" : pfp}
            alt="profile"
          />
        )}
        <h2>{displayName}</h2>
      </div>

      <BlogGrid blogs={blogs} page="Profile" />
    </div>
  );
}

export default Profile;
