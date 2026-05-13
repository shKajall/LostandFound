import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../assets/logo.jpeg";

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [itemType, setItemType] = useState("lost");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(localStorage.getItem("lostUser"));
  const userEmail = loggedInUser?.email; // backend expects email

  useEffect(() => {
  axios.get(`https://lostandfound-1-eyvw.onrender.com/api/posts/${id}`)
      .then((res) => {
        const post = res.data.post;
        setItemName(post.itemName);
        setDescription(post.description);
        setItemType(post.itemType);
        if (post.imageUrl) setPreview(post.imageUrl);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("itemName", itemName);
    formData.append("description", description);
    formData.append("itemType", itemType);
    formData.append("userEmail", userEmail); // use email as backend expects
    if (image) formData.append("image", image);

    try {
      await axios.put(`https://lostandfound-1-eyvw.onrender.com/api/posts/post/${id}`, // match backend route
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Post updated successfully!");
      navigate("/mylistings");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[#030f27ff] flex items-center justify-center p-6">
      <div className="max-w-xl w-full p-6 bg-white shadow-lg rounded-xl">

        {/* Header with logo */}
        <div className="flex items-center justify-center mb-6">
          <img src={Logo} alt="Lost N Found Logo" className="w-12 h-12 rounded-2xl object-contain mr-4" />
          <h1 className="text-2xl font-bold text-purple-700">Edit Item</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Item Name */}
          <label className="block font-semibold">Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full p-2 border rounded bg-white"
          />

          {/* Description */}
          <label className="block font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded bg-white"
          />

          {/* Item Type */}
          <label className="block font-semibold">Item Type</label>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="w-full p-2 rounded bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          {/* Image Upload */}
          <label className="block font-semibold">Change Image (optional)</label>
          <input
            type="file"
            id="imageUpload"
            className="hidden"
            onChange={handleImageChange}
          />
          <label
            htmlFor="imageUpload"
            className="inline-block px-4 py-2 rounded-lg cursor-pointer bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white hover:opacity-90 transition"
          >
            Select Image
          </label>

          {/* Preview current or selected image */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-lg border"
            />
          )}
          {image && !preview && (
            <p className="mt-2 text-sm text-gray-600">Selected: {image.name}</p>
          )}

          {/* Update Button */}
          <button
            type="submit"
            className="w-full p-2 rounded-lg text-white bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 hover:opacity-90 transition"
          >
            Update Item
          </button>
        </form>
      </div>
    </div>
  );
}
