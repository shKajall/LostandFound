import express from "express";
import Response from "../models/Response.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const router = express.Router();

/* ----------------------------------------------------
   POST MESSAGE (owner or responder)
---------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { postId, userId, username, message } = req.body;

    if (!postId || !userId || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Get post owner
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const ownerId = post.userEmail;

    // Determine who is responder & who is owner
    const responderId = userId === ownerId ? req.body.responderId : userId;

    // Get responder username
    const responderUser = await User.findOne({ email: responderId });
    const responderName = responderUser?.username || responderId;

    // Find conversation for this responder
    let conversation = await Response.findOne({ postId, responderId });

    if (!conversation) {
      // Create new conversation
      conversation = await Response.create({
        postId,
        responderId,
        responderName,
        messages: []
      });
    }

    // Push new message
    conversation.messages.push({
      senderId: userId,
      senderName: username,
      content: message,
      timestamp: new Date(),
    });

    await conversation.save();

    // Notify owner
    if (userId !== ownerId) {
      await Notification.create({
        userEmail: ownerId,
        message: `${username} responded to your post "${post.itemName}"`,
        postId,
        responseId: conversation._id
      });
    }

    res.status(201).json({ success: true, response: conversation });

  } catch (err) {
    console.error("Error posting response:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

/* ----------------------------------------------------
   GET ALL RESPONSES VISIBLE TO USER
---------------------------------------------------- */
router.get("/post/:postId/:userId", async (req, res) => {
  try {
    const { postId, userId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const ownerId = post.userEmail;

    const responses = await Response.find({ postId }).sort({ createdAt: 1 });

    const visible = responses.filter(
      (r) => r.responderId === userId || userId === ownerId
    );

    res.status(200).json({ success: true, responses: visible });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching chats" });
  }
});

/* ----------------------------------------------------
   DELETE CONVERSATION
---------------------------------------------------- */
router.delete("/:responseId/:userId", async (req, res) => {
  try {
    const { responseId, userId } = req.params;

    const conversation = await Response.findById(responseId);
    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    const post = await Post.findById(conversation.postId);
    const ownerId = post.userEmail;

    if (userId !== ownerId && userId !== conversation.responderId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await conversation.deleteOne();

    res.status(200).json({ success: true, message: "Deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting" });
  }
});

export default router;
