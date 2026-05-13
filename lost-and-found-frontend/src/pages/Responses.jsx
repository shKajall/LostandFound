import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../assets/logo.jpeg";
import { useLocation } from "react-router-dom";

function Responses() {
  const [posts, setPosts] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState({});

  const user = JSON.parse(localStorage.getItem("lostUser"));
  const location = useLocation();
  const selectedPostId = location.state?.postId;

  /* ---------------- FETCH POSTS ---------------- */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://lostandfound-1-eyvw.onrender.com/api/posts");
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  /* ---------------- FETCH RESPONSES ---------------- */
  useEffect(() => {
    posts.forEach((post) => fetchResponses(post._id));
  }, [posts]);

  const fetchResponses = async (postId) => {
    try {
      const res = await axios.get(
        `http://lostandfound-1-eyvw.onrender.com/api/responses/post/${postId}/${user.email}`
      );

      setResponses((prev) => ({
        ...prev,
        [postId]: res.data.responses || [],
      }));
    } catch (err) {
      console.error("Error fetching responses:", err);
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSend = async (postId, responderId = null) => {
    const message = newMessage[postId]?.trim();
    if (!message) return;

    const payload = {
      postId,
      userId: user.email,
      username: user.username,
      message,
      responderId,
    };

    try {
      const res = await axios.post(
        "http://lostandfound-1-eyvw.onrender.com/api/responses",
        payload
      );

      const updatedConv = res.data.response;

      setResponses((prev) => {
        const postConvs = prev[postId] || [];

        const index = postConvs.findIndex(
          (c) => c.responderId === updatedConv.responderId
        );

        if (index > -1) {
          const updated = [...postConvs];
          updated[index] = updatedConv;
          return { ...prev, [postId]: updated };
        } else {
          return { ...prev, [postId]: [...postConvs, updatedConv] };
        }
      });

      setNewMessage((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Error sending response:", err);
    }
  };

  /* ---------------- DELETE RESPONSE ---------------- */
  const handleDeleteResponse = async (responseId, postId) => {
    if (!window.confirm("Delete this conversation?")) return;

    try {
      const res = await axios.delete(
        `http://lostandfound-1-eyvw.onrender.com/api/responses/${responseId}/${user.email}`
      );

      if (res.data.success) {
        setResponses((prev) => ({
          ...prev,
          [postId]: prev[postId].filter((c) => c._id !== responseId),
        }));
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-100">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#030f27ff] flex flex-col items-center px-4 py-6">
      
      {/* Header */}
      <div className="flex items-center justify-center w-full max-w-4xl mb-6">
        <img src={Logo} alt="Logo" className="w-12 h-12 rounded-2xl mr-4" />
        <h1 className="text-3xl font-bold text-gray-100">Responses</h1>
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {posts.map((post) => {
          const postChats = responses[post._id] || [];
          const showInput = !selectedPostId || selectedPostId === post._id;

          return (
            <div key={post._id} className="bg-white p-5 rounded-xl shadow-lg">
              
              {/* Post Info */}
              <h2 className="text-xl font-bold mb-1">{post.itemName}</h2>
              <p className="text-gray-700 mb-1">{post.description}</p>
              <p className="text-sm text-gray-600">
                <b>Type:</b> {post.itemType}
              </p>
              <p className="text-xs text-gray-500 mt-1 mb-3">
                Posted by: {post.username || post.userEmail}
              </p>

              {/* Conversations */}
              {postChats.map((conv) => {
                const isOwner = post.userEmail === user.email;
                const isResponder = conv.responderId === user.email;

                if (!isOwner && !isResponder) return null;

                return (
                  <div key={conv._id} className="mb-4 p-3 bg-gray-100 rounded">
                    
                    {/* Conversation title FIXED */}
                    <h3 className="font-bold mb-3 text-sm">
                      {isOwner
                        ? `Conversation with ${conv.responderName || conv.responderId}`
                        : `Chat with ${post.username || post.userEmail}`}
                    </h3>

                    {/* Messages */}
                    <div className="space-y-2">
                      {conv.messages.map((msg, idx) => {
                        const mine = msg.senderId === user.email;

                        return (
                          <div
                            key={idx}
                            className={`flex ${
                              mine ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow 
                              ${
                                mine
                                  ? "bg-purple-500 text-white"
                                  : "bg-white text-gray-800"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* SINGLE INPUT ONLY (FIXED) */}
                    {showInput && (
                      <div className="flex mt-3 gap-2">
                        <input
                          type="text"
                          placeholder="Message..."
                          value={newMessage[post._id] || ""}
                          onChange={(e) =>
                            setNewMessage((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                          className="flex-1 p-2 bg-white border rounded text-black"
                        />

                        <button
                          onClick={() => handleSend(post._id, conv.responderId)}
                          className="px-3 py-2 bg-purple-600 text-white rounded-2xl"
                        >
                          Send
                        </button>
                      </div>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() =>
                        handleDeleteResponse(conv._id, post._id)
                      }
                      className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete Conversation
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Responses;