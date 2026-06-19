import { Router } from "express";
import { createTask, listTasks, updateTask } from "../controllers/taskController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.route("/").get(listTasks).post(createTask);
router.patch("/:id", updateTask);

export default router;
