import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 40 });

router.post("/register", limiter, register);
router.post("/login", limiter, login);
router.get("/me", requireAuth, me);

export default router;
