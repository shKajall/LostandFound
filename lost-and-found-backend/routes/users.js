import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Create or register a user (only once)
router.post("/register", async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) return res.status(400).json({ error: "Email and username required" });

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    // Check if username is taken
    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) return res.status(400).json({ error: "Username already taken" });

    user = new User({ email, username });
    await user.save();

    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a user's info by email
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update username
router.put("/update-username/:email", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username required" });

    // Check if username is taken
    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) return res.status(400).json({ error: "Username already taken" });

    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      { username },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
