import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ImagePlus, FileText, UploadCloud } from "lucide-react";

function UploadBlog() {
  const { currentUser, username } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "blog_uploads");

    const res = await fetch("https://api.cloudinary.com/v1_1/djxmd61lq/image/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      toast.success("Blog uploaded!");
      setTitle("");
      setContent("");
      setImage(null);
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload blog.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center py-10 px-4 text-center min-h-screen">
      <UploadCloud size={64} className="mb-4 text-primary" />
      <h1 className="text-4xl font-bold text-base-content">Upload Blog</h1>
      <p className="text-lg pt-2 pb-8 text-gray-400">Share your thoughts with the community.</p>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4 text-left">
        {/* Title */}
        <label className="input input-bordered flex items-center gap-3 w-full">
          <FileText className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            className="grow bg-transparent focus:outline-none placeholder:text-gray-400"
            placeholder="Blog Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        {/* Content */}
        <textarea
          className="textarea textarea-bordered w-full h-48 resize-none placeholder:text-gray-400"
          placeholder="Blog Content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {/* Image Upload */}
        <label className="input input-bordered flex items-center gap-3 w-full cursor-pointer">
          <ImagePlus className="w-5 h-5 text-gray-500" />
          <input
            type="file"
            accept="image/*"
            className="grow bg-transparent file:mr-2 file:py-1 file:px-2 file:border-none file:bg-base-300 file:text-sm file:rounded-lg"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full text-lg"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Blog"}
        </button>
      </form>
    </div>
  );
}

export default UploadBlog;
