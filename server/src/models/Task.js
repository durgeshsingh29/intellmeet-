import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    meeting: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["todo", "doing", "review", "done"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: Date
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
