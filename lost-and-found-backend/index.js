import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";
import responseRoutes from "./routes/responses.js";
import notificationRoutes from "./routes/notifications.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// FIXED CORS (important for deployment)
app.use(
  cors({
    origin: "*", 
    credentials: true
  })
);

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Backend running…");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Start Server (DEPLOYMENT SAFE)
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});