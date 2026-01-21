import express from "express";
import { getDeliveryCharges } from "../Controllers/delivery.controller.js";

const router = express.Router();

router.get("/charges", getDeliveryCharges);

export default router;
