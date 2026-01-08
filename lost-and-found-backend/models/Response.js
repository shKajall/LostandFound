import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },    // sender of the message
  content: { type: String, required: true },     // message content
  timestamp: { type: Date, default: Date.now },  // when it was sent
});

const responseSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    responderId: { type: String, required: true },  // user who responded
    messages: [messageSchema],                      // all messages between post owner and responder
  },
  { timestamps: true }
);

const Response = mongoose.model("Response", responseSchema);
export default Response;
