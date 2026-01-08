import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // Who will receive the notification
  message: { type: String, required: true },   // Notification text
  read: { type: Boolean, default: false },     // Unread by default
  createdAt: { type: Date, default: Date.now } // Timestamp
});

export default mongoose.model("Notification", notificationSchema);
