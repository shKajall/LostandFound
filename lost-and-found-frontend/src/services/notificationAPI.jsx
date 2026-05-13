// src/services/notificationAPI.jsx
import axios from "axios";

const API_BASE = "http://localhost:5001/api/notifications";

// Get all notifications for a specific user
export const getNotifications = async (email) => {
  try {
    const response = await axios.get(`${API_BASE}/${email}`);
    return response;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Mark a notification as read
export const markAsRead = async (id) => {
  try {
    const response = await axios.put(`${API_BASE}/read/${id}`);
    return response;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};
