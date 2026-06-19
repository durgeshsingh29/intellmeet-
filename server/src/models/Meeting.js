import mongoose from "mongoose";

const actionItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: Date,
    status: { type: String, enum: ["todo", "doing", "done"], default: "todo" }
  },
  { _id: true }
);

const transcriptSchema = new mongoose.Schema(
  {
    speaker: { type: String, default: "Participant" },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    agenda: { type: String, default: "" },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    scheduledAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["scheduled", "live", "ended"], default: "scheduled" },
    roomCode: { type: String, required: true, unique: true },
    transcript: [transcriptSchema],
    summary: { type: String, default: "" },
    actionItems: [actionItemSchema],
    recordingUrl: { type: String, default: "" },
    durationMinutes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
