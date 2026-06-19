import "dotenv/config";
import { connectDB } from "./config/db.js";
import { Meeting } from "./models/Meeting.js";
import { Task } from "./models/Task.js";
import { User } from "./models/User.js";

await connectDB();

await User.deleteOne({ email: "admin@intellmeet.com" });
await User.deleteOne({ email: "priya@intellmeet.com" });

const admin = await User.create({
  name: "Demo Admin",
  email: "admin@intellmeet.com",
  password: "password123",
  role: "admin",
  title: "Engineering Manager"
});

const member = await User.create({
  name: "Priya Sharma",
  email: "priya@intellmeet.com",
  password: "password123",
  role: "member",
  title: "Product Lead"
});

let meeting = await Meeting.findOne({ roomCode: "DEMO2026" });
if (meeting) {
  await Task.deleteMany({ meeting: meeting._id });
  await Meeting.deleteOne({ _id: meeting._id });
}

meeting = await Meeting.create({
  title: "AI Launch Readiness",
  agenda: "Review rollout blockers, action owners, and demo readiness.",
  host: admin._id,
  participants: [admin._id, member._id],
  status: "ended",
  roomCode: "DEMO2026",
  durationMinutes: 48,
  transcript: [
    { speaker: "Demo Admin", text: "We need to review the security checklist and prepare the live demo." },
    { speaker: "Priya Sharma", text: "I will share the updated onboarding flow and complete the dashboard copy." }
  ],
  summary: "The team reviewed launch readiness, security checks, onboarding flow, and demo preparation.",
  actionItems: [
    { text: "Review security checklist", assignee: admin._id },
    { text: "Share updated onboarding flow", assignee: member._id }
  ]
});

await Task.create([
  { title: "Review security checklist", meeting: meeting._id, assignee: admin._id, status: "doing", priority: "high" },
  { title: "Share updated onboarding flow", meeting: meeting._id, assignee: member._id, status: "todo", priority: "medium" }
]);

console.log("Seed complete: admin@intellmeet.com / password123");
process.exit(0);
