import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";
import responseRoutes from "./routes/responses.js";
import notificationRoutes from "./routes/notifications.js";
import userRoutes from "./routes/users.js"; // <-- add this

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/posts", postRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes); // <-- add this

app.get("/", (req, res) => {
  res.send("Backend running…");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(5001, () => console.log("Server running on http://localhost:5001"));
