import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const user = JSON.parse(localStorage.getItem("lostUser"));
  const userEmail = user?.email;

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!userEmail) return;
    try {
      const res = await axios.get(`http://localhost:5001/api/notifications/${userEmail}`);
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.notifications.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userEmail]);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/notifications/read/${id}`);
      fetchNotifications(); // refresh list
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <div className="relative">
      {/* Bell icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative text-gray-700 hover:text-purple-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500">No notifications</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`p-4 border-b cursor-pointer hover:bg-purple-50 ${
                    !n.read ? "bg-purple-100" : ""
                  }`}
                >
                  <p className="text-gray-800 text-sm">{n.message}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
