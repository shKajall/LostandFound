import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Logo from "../assets/logo.jpeg";

function PostItem() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [itemType, setItemType] = useState("lost");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isUsernameLocked, setIsUsernameLocked] = useState(true);
  const [usernameError, setUsernameError] = useState("");

  const user = JSON.parse(localStorage.getItem("lostUser"));
  const loggedInEmail = user?.email || "";

  useEffect(() => {
    if (!loggedInEmail) return;

    axios.get(`https://lostandfound-1-eyvw.onrender.com/api/users/${loggedInEmail}`)
      .then((res) => {
        setUsername(res.data.user.username || loggedInEmail.split("@")[0]);
        setIsUsernameLocked(true);
      })
      .catch((err) => console.error(err));
  }, [loggedInEmail]);

  const handleUsernameChange = async (e) => {
    const value = e.target.value.trim();
    setUsername(value);

    if (value.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }

    try {
      const res = await axios.get(
        `http://lostandfound-1-eyvw.onrender.com/api/posts/check-username/${value}`
      );
      if (res.data.exists) {
        setUsernameError("Username already taken");
      } else {
        setUsernameError("");
      }
    } catch {
      setUsernameError("Error checking username");
    }
  };

  const saveUsername = async () => {
    if (!username || usernameError) {
      alert("Fix username error before saving");
      return;
    }

    try {
      const res = await axios.put(
        `http://lostandfound-1-eyvw.onrender.com/api/users/update-username/${loggedInEmail}`,
        { username }
      );

      localStorage.setItem("lostUser", JSON.stringify(res.data.user));
      setIsUsernameLocked(true);
      setSuccessMessage("Username updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMessage("Error updating username.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    setItemName("");
    setDescription("");
    setItemType("lost");
    setImage(null);
    setPreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usernameError) {
      alert("Fix username error before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("itemName", itemName);
      formData.append("description", description);
      formData.append("itemType", itemType);
      if (image) formData.append("image", image);
      formData.append("userEmail", loggedInEmail);

      const response = await axios.post(
        "http://lostandfound-1-eyvw.onrender.com/api/posts",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccessMessage("Item posted successfully!");
      navigate("/feed", { state: response.data.data });
      handleCancel();
    } catch (error) {
      console.error(error);
      setSuccessMessage("Error connecting to backend.");
    }

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030f27ff]">
      <Navbar />

      {/* Centered Card */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-10">
        <section className="relative w-full max-w-lg p-8 rounded-2xl shadow-2xl bg-white overflow-hidden">
         {/* Card content */}
<div className="relative z-10 text-gray-800">
  {/* Logo */}
  <div className="flex justify-center mb-4">
    <img src={Logo} alt="Lost N Found Logo" className="w-16 h-16 rounded-2xl object-contain" />
  </div>

  {/* Heading */}
  <h1 className="text-3xl font-bold mb-6 text-center">Post a New Item</h1>

  {successMessage && (
    <p className="text-center text-green-600 font-semibold mb-4">
      {successMessage}
    </p>
  )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* USERNAME FIELD */}
              <div className="relative">
                <label htmlFor="username" className="block font-semibold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  readOnly={isUsernameLocked}
                  className={`w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
                    isUsernameLocked ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                />
                {isUsernameLocked ? (
                  <button
                    type="button"
                    onClick={() => setIsUsernameLocked(false)}
                   className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 
               rounded text-white font-semibold 
               bg-gradient-to-r from-purple-500 via-pink-500 via-orange-500 to-yellow-400 
               hover:from-purple-600 hover:via-pink-600 hover:via-orange-600 hover:to-yellow-500 transition-all text-sm"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={saveUsername}
                   className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 
               rounded text-white font-semibold 
               bg-gradient-to-r from-purple-500 via-pink-500 via-orange-500 to-yellow-400 
               hover:from-purple-600 hover:via-pink-600 hover:via-orange-600 hover:to-yellow-500 transition-all text-sm"
                  >
                    Save
                  </button>
                )}
                {usernameError && (
                  <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                )}
              </div>

              {/* ITEM NAME */}
              <div>
                <label htmlFor="itemName" className="block font-semibold mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label htmlFor="description" className="block font-semibold mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>

              {/* ITEM TYPE */}
<div>
  <label htmlFor="itemType" className="block font-semibold mb-1">
    Item Type
  </label>
  <select
    id="itemType"
    value={itemType}
    onChange={(e) => setItemType(e.target.value)}
    className="w-full px-4 py-2 rounded-lg text-white appearance-none
               bg-gradient-to-r from-purple-500 via-pink-500 via-orange-400 to-yellow-400
               focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" >
               <option value="lost">Lost</option>
              <option value="found">Found</option>
              </select>
              </div>
              {/* IMAGE UPLOAD */}
              <div>
                <label htmlFor="imageUpload" className="block font-semibold mb-1">
                  Upload Item Image
                </label>
                <label className="inline-block px-4 py-2 rounded-lg cursor-pointer text-white font-semibold 
                  bg-gradient-to-r from-purple-500 via-pink-500 via-orange-500 to-yellow-400 
                  hover:from-purple-600 hover:via-pink-600 hover:via-orange-600 hover:to-yellow-500 transition-all text-sm">
                  Choose File
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-lg border border-yellow-400 mt-2"
                  />
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                 className="px-6 py-2 rounded-lg text-white font-semibold shadow-sm 
               bg-gradient-to-r from-purple-500 via-pink-500 via-orange-500 to-yellow-400 
               hover:from-purple-600 hover:via-pink-600 hover:via-orange-600 hover:to-yellow-500 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                 className="px-6 py-2 rounded-lg text-white font-semibold shadow-md 
               bg-gradient-to-r from-purple-500 via-pink-500 via-orange-500 to-yellow-400 
               hover:from-purple-600 hover:via-pink-600 hover:via-orange-600 hover:to-yellow-500 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PostItem;
