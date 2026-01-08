import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true }, // unique identifier
    username: { type: String, required: true, unique: true }, // permanent display name
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
