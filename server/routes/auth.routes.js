import express from "express";
import { adminLogin, getMe, updateProfile } from "../Controllers/auth.controller.js";
import { protectAdmin } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/me", protectAdmin, getMe);
router.put("/profile", protectAdmin, updateProfile);

export default router;
