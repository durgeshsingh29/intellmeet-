import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    meeting: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    type: { type: String, enum: ["chat", "note", "system"], default: "chat" }
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
