import { Meeting } from "../models/Meeting.js";
import { Task } from "../models/Task.js";

export async function getAnalytics(req, res) {
  const [meetings, tasks] = await Promise.all([
    Meeting.find({ $or: [{ host: req.user._id }, { participants: req.user._id }] }),
    Task.find({ $or: [{ assignee: req.user._id }, { assignee: null }] })
  ]);

  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const endedMeetings = meetings.filter((meeting) => meeting.status === "ended").length;

  res.json({
    totalMeetings: meetings.length,
    liveMeetings: meetings.filter((meeting) => meeting.status === "live").length,
    endedMeetings,
    totalTasks: tasks.length,
    completedTasks,
    followUpSavedHours: Math.round(endedMeetings * 0.75),
    productivityScore: Math.min(100, 62 + completedTasks * 4 + endedMeetings * 3)
  });
}
