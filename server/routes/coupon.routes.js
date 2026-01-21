import express from "express";
import { applyCoupon } from "../Controllers/coupon.controller.js";

const router = express.Router();

router.post("/apply", applyCoupon);

export default router;
