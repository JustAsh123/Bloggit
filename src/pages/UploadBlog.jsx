import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function UploadBlog() {
  const { currentUser, username } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "blog_uploads"); // Your unsigned preset name

    const res = await fetch("https://api.cloudinary.com/v1_1/djxmd61lq/image/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    return json.secure_url; // Cloudinary image URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await handleImageUpload(image);
      }

      await addDoc(collection(db, "blogs"), {
        title,
        content,
        imageUrl,
        authorId: currentUser.uid,
        authorName: username,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setContent("");
      setImage(null);
      navigate("/");
    } catch (err) {
      setError("Failed to upload blog.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h3>Upload Blog</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog title"
          className="form-control mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Blog content"
          className="form-control mb-2"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>

        <input
          type="file"
          className="form-control mb-2"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Uploading..." : "Upload Blog"}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
  );
}

export default UploadBlog;
