// routes/posts.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Post from "../models/Post.js";
import User from "../models/User.js";

const router = express.Router();

// ---------------- MULTER CONFIG ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------- SPECIFIC ROUTES ----------------

// Get posts for a specific user
router.get("/user/:email", async (req, res) => {
  try {
    const posts = await Post.find({ userEmail: req.params.email }).sort({
      createdAt: -1,
    });

    const user = await User.findOne({ email: req.params.email });

    const postsWithUsername = posts.map((post) => ({
      ...post.toObject(),
      username: user?.username || "Unknown",
    }));

    res.json({ success: true, posts: postsWithUsername });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- GENERAL ROUTES ----------------

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    const postsWithUsername = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findOne({ email: post.userEmail });
        return {
          ...post.toObject(),
          username: user?.username || "Unknown",
        };
      })
    );

    res.json({ success: true, posts: postsWithUsername });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, error: "Post not found" });

    const user = await User.findOne({ email: post.userEmail });

    const postWithUsername = {
      ...post.toObject(),
      username: user?.username || "Unknown",
    };

    res.json({ success: true, post: postWithUsername });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create a new post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { itemName, description, itemType, userEmail } = req.body;

    if (!itemName || !description || !userEmail) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const newPost = new Post({
      itemName,
      description,
      itemType,
      userEmail,
      imageUrl: req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null,
    });

    const savedPost = await newPost.save();

    const user = await User.findOne({ email: userEmail });

    const postWithUsername = {
      ...savedPost.toObject(),
      username: user?.username || "Unknown",
    };

    res.status(201).json({ success: true, data: postWithUsername });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- UPDATE POST (with optional image) ----------------
router.put("/post/:id", upload.single("image"), async (req, res) => {
  try {
    const postId = req.params.id;
    const { itemName, description, itemType } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, error: "Post not found" });
    }

    // Update text fields
    if (itemName) post.itemName = itemName;
    if (description) post.description = description;
    if (itemType) post.itemType = itemType;

    // Update image if a new one is provided
    if (req.file) {
      post.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    await post.save();

    res.json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------- DELETE POST ----------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost)
      return res
        .status(404)
        .json({ success: false, error: "Post not found" });

    // Delete image from server if exists
    if (deletedPost.imageUrl) {
      const filePath = `uploads/${path.basename(deletedPost.imageUrl)}`;
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
