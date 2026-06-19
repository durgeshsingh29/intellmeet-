import { Task } from "../models/Task.js";

export async function listTasks(req, res) {
  const tasks = await Task.find({ $or: [{ assignee: req.user._id }, { assignee: null }] })
    .populate("assignee", "name email avatar")
    .populate("meeting", "title roomCode")
    .sort({ createdAt: -1 });
  res.json(tasks);
}

export async function createTask(req, res) {
  const task = await Task.create(req.body);
  res.status(201).json(task);
}

export async function updateTask(req, res) {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
}
