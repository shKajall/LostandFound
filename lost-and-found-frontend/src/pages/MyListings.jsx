import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../assets/Logo.jpeg";
import { useNavigate } from "react-router-dom";

function MyListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Get logged-in user info
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("lostUser"));
    if (user?.email) setUserEmail(user.email);
    if (user?.username) setUsername(user.username);
  }, []);

  // Fetch user's posts
  useEffect(() => {
    if (!userEmail) return;

    axios
      .get(`http://localhost:5001/api/posts/user/${userEmail}`)
      .then((res) => {
        setItems(res.data.posts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Axios error:", err);
        setLoading(false);
      });
  }, [userEmail]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await axios.delete(`http://localhost:5001/api/posts/${id}`);
      if (res.status === 200) {
        setItems(items.filter((item) => item._id !== id));
        alert("Item deleted!");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item");
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/edit-item/${id}`;
  };

  if (loading)
    return <p className="text-center mt-10 text-white">Loading posts...</p>;

  return (
    <div className="min-h-screen bg-[#030f27ff] flex flex-col items-center px-4 py-6">

      {/* My Listings header with logo */}
      <div className="flex items-center justify-center w-full max-w-4xl mb-6">
        <img src={Logo} alt="Lost N Found Logo" className="w-12 h-12 rounded-2xl object-contain mr-4" />
        <h1 className="text-3xl font-bold rounded-2xl text-gray-100">My Listings</h1>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-white">You have not posted any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-3 rounded-lg shadow hover:shadow-md transition duration-200 flex flex-col"
            >
              {/* IMAGE LEFT + DETAILS RIGHT */}
              <div className="flex flex-col md:flex-row gap-3">
                {/* IMAGE */}
                <div className="w-full md:w-1/3">
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt="item"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>

                {/* DETAILS */}
                <div className="w-full md:w-2/3 flex flex-col space-y-1">
                  <p className="text-lg font-bold text-gray-900">{item.itemName}</p>
                  <p className="text-gray-700 text-sm">{item.description}</p>
                  <p className="text-gray-700 text-sm">
                    <strong>Type:</strong>{" "}
                    <span className="px-2 py-1 bg-purple-100 rounded text-purple-700 font-medium">
                      {item.itemType || "Not specified"}
                    </span>
                  </p>
                  <p className="text-gray-500 text-xs">
                    Posted by: {item.username || username || "Unknown"} <br />
                    Created: {new Date(item.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              {/* BUTTONS: Edit, Delete, View Responses */}
              <div className="flex justify-between mt-3 gap-2">
                <button
                  onClick={() => handleEdit(item._id)}
                  className="flex-1 px-2 py-1 text-white rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 hover:opacity-90 text-sm"
                >
                  Edit Item
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 px-2 py-1 text-white rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 hover:opacity-90 text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/responses/${item._id}`)}
                  className="flex-1 px-2 py-1 text-white rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 hover:opacity-90 text-sm"
                >
                  View Responses
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;
