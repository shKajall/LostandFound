import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { getNotifications, markAsRead } from "../services/notificationAPI";
import Logo from "../assets/Logo.jpeg";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("lostUser"));
  const userEmail = user?.email;

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!userEmail) return;
    try {
      const res = await getNotifications(userEmail);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, [userEmail]);

  // Toggle dropdown and mark unread as read
  const handleOpenDropdown = async () => {
    setShowDropdown(!showDropdown);

    try {
      await Promise.all(
        notifications.filter((n) => !n.read).map((n) => markAsRead(n._id))
      );
      fetchNotifications(); // refresh after marking as read
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("lostUser");
    window.location.href = "/login";
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="relative w-full shadow-md border-b border-gray-200">
      {/* Instagram-like gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 opacity-80 blur-sm"></div>

      <nav className="relative max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + Site Name */}
    <div className="flex items-center space-x-3">
      {/* Logo */}
      <img
        src={Logo} // make sure Logo is imported
        alt="Lost N Found Logo"
        className="w-10 h-10 rounded-2xl object-contain"
      />
      {/* Site Name */}
      <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 tracking-wide">
        Lost N Found
      </h1>
    </div>
        <div className="flex space-x-3 items-center">
          {/* Links with Instagram-like colors */}
          <Link
            to="/post-item"
            className="px-4 py-2 bg-white text-pink-500 rounded-lg no-underline font-semibold hover:opacity-90 transition"
          >
            Post Item
          </Link>
          <Link
            to="/feed"
            className="px-4 py-2 bg-white text-pink-500 rounded-lg no-underline font-semibold hover:opacity-90 transition"
          >
            Feed
          </Link>
          <Link
            to="/responses"
            className="px-4 py-2 bg-white text-pink-500 rounded-lg no-underline font-semibold hover:opacity-90 transition"
          >
            Responses
          </Link>
          <Link
            to="/mylistings"
            className="px-4 py-2 bg-white text-pink-500 rounded-lg no-underline font-semibold hover:opacity-90 transition"
          >
            My Listings
          </Link>

          {/* Notification Bell */}
          <div className="relative cursor-pointer" onClick={handleOpenDropdown}>
            <FaBell size={22} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-pink-500 rounded-lg no-underline font-semibold hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-6 top-20 bg-white text-black shadow-lg rounded-lg w-80 max-h-80 overflow-auto z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                  !n.read ? "bg-pink-50" : ""
                }`}
                onClick={() => markAsRead(n._id)}
              >
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </header>
  );
}
