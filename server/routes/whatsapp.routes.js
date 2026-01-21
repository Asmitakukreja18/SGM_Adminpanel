import express from "express";
import { createWhatsAppOrder } from "../Controllers/whatsapp.controller.js";

const router = express.Router();

router.post("/whatsapp", createWhatsAppOrder);

export default router;
