import { Router } from "express";
import {
  addTranscript,
  createMeeting,
  generateIntelligence,
  getMeeting,
  listMeetings,
  updateStatus
} from "../controllers/meetingController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.route("/").get(listMeetings).post(createMeeting);
router.get("/:id", getMeeting);
router.patch("/:id/status", updateStatus);
router.post("/:id/transcript", addTranscript);
router.post("/:id/intelligence", generateIntelligence);

export default router;
