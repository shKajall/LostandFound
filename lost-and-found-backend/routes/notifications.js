import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// 1️⃣ Get all notifications for a user
router.get("/:email", async (req, res) => {
  try {
    const notifications = await Notification.find({ userEmail: req.params.email })
      .sort({ createdAt: -1 }); // latest first
    res.json({ success: true, notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2️⃣ Mark a notification as read
router.put("/read/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json({ success: true, notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3️⃣ Add a new notification (optional, can also be done in response route)
router.post("/", async (req, res) => {
  try {
    const { userEmail, message } = req.body;
    const newNotification = new Notification({ userEmail, message });
    await newNotification.save();
    res.status(201).json({ success: true, notification: newNotification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
