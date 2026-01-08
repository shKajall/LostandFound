import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    itemType: { type: String }, // lost or found
    imageUrl: { type: String },
    userEmail: { type: String, required: true }, // owner's email
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
