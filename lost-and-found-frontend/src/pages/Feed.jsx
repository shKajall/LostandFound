import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";

function Feed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  // Get logged-in user info
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("lostUser"));
    if (user?.email) setUserEmail(user.email);
  }, []);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
const response = await axios.get(`https://lostandfound-1-eyvw.onrender.com/api/posts/${id}`);
        setItems(response.data.posts || []);
        setLoading(false);
      } catch (err) {
        console.error("Axios error:", err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Delete a post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
  const response = await axios.delete(`https://lostandfound-1-eyvw.onrender.com/api/posts/${id}`);
      if (response.status === 200) {
        setItems(items.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-200">Loading feed...</p>;

  return (
    <div className="min-h-screen bg-[#030f27ff] flex flex-col items-center px-4 py-6">
      {/* Feed header with logo */}
      <div className="flex items-center justify-center w-full max-w-4xl mb-6">
        <img src={Logo} alt="Lost N Found Logo" className="w-12 h-12 rounded-2xl object-contain mr-4" />
        <h1 className="text-3xl font-bold text-gray-100">Feed</h1>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-300">No items posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative"
            >
              {/* Delete button for own posts */}
              {item.userEmail === userEmail && (
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              )}

              {/* Post info */}
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.itemName}</h3>
              <p className="text-gray-700 mb-2">{item.description}</p>

              {item.itemType && (
                <span
                  className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                    item.itemType.toLowerCase() === "lost"
                      ? "bg-red-100 text-red-800"
                      : item.itemType.toLowerCase() === "found"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1)}
                </span>
              )}

              <p className="text-xs text-gray-500 mt-3">
                Posted by: {item.username || item.userEmail?.split("@")[0] || "Unknown"} |{" "}
                {new Date(item.createdAt).toLocaleString("en-US", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>

              {/* Post image */}
              <div className="mt-3">
                <img
                  src={item.imageUrl || "/placeholder.png"}
                  alt="item"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              {/* Buttons: Make / View Response */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate(`/responses/${item._id}`, { state: { postId: item._id } })}
                  className="px-3 py-1 text-white text-sm rounded bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 hover:opacity-90 transition"
                >
                  Make Response
                </button>
                <button
                  onClick={() => navigate(`/responses/${item._id}`, { state: { postId: item._id } })}
                  className="px-3 py-1 text-white text-sm rounded bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 hover:opacity-90 transition"
                >
                  View Response
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;
