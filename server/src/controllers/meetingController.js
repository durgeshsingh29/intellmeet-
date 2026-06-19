import crypto from "crypto";
import { Meeting } from "../models/Meeting.js";
import { Message } from "../models/Message.js";
import { Task } from "../models/Task.js";
import { createMeetingIntelligence } from "../services/aiService.js";

function roomCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export async function listMeetings(req, res) {
  const meetings = await Meeting.find({
    $or: [{ host: req.user._id }, { participants: req.user._id }]
  })
    .populate("host", "name email avatar")
    .populate("participants", "name email avatar")
    .sort({ scheduledAt: -1 });
  res.json(meetings);
}

export async function createMeeting(req, res) {
  const meeting = await Meeting.create({
    title: req.body.title,
    agenda: req.body.agenda,
    scheduledAt: req.body.scheduledAt || new Date(),
    host: req.user._id,
    participants: [req.user._id],
    roomCode: roomCode()
  });
  res.status(201).json(meeting);
}

export async function getMeeting(req, res) {
  const meeting = await Meeting.findById(req.params.id)
    .populate("host", "name email avatar")
    .populate("participants", "name email avatar")
    .populate("actionItems.assignee", "name email avatar");
  if (!meeting) return res.status(404).json({ message: "Meeting not found" });

  const messages = await Message.find({ meeting: meeting._id }).populate("sender", "name avatar").sort("createdAt");
  res.json({ meeting, messages });
}

export async function updateStatus(req, res) {
  const meeting = await Meeting.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!meeting) return res.status(404).json({ message: "Meeting not found" });
  res.json(meeting);
}

export async function addTranscript(req, res) {
  const meeting = await Meeting.findById(req.params.id);
  if (!meeting) return res.status(404).json({ message: "Meeting not found" });

  meeting.transcript.push({ speaker: req.body.speaker || req.user.name, text: req.body.text });
  await meeting.save();
  res.status(201).json(meeting.transcript.at(-1));
}

export async function generateIntelligence(req, res) {
  const meeting = await Meeting.findById(req.params.id);
  if (!meeting) return res.status(404).json({ message: "Meeting not found" });

  const intelligence = await createMeetingIntelligence(meeting);
  meeting.summary = intelligence.summary;
  meeting.actionItems = intelligence.actionItems;
  await meeting.save();

  const tasks = await Task.insertMany(
    intelligence.actionItems.map((item) => ({
      title: item.text,
      meeting: meeting._id,
      assignee: item.assignee,
      dueDate: item.dueDate,
      priority: "medium"
    }))
  );

  res.json({ meeting, tasks });
}
