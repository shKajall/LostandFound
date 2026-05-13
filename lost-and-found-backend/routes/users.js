import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const JWT_SECRET = "secretkey"; // later move to .env

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        error: "Email, username, and password are required"
      });
    }

    // Check existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        error: "User already exists"
      });
    }

    // Check username
    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(400).json({
        success: false,
        error: "Username already taken"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = new User({
      email,
      username,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

router.put("/update-username/:email", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: "Username required"
      });
    }

    const usernameTaken = await User.findOne({ username });

    if (usernameTaken) {
      return res.status(400).json({
        success: false,
        error: "Username already taken"
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      { username },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Username updated",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

export default router;