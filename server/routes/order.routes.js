import express from "express";
import { getOrders, updateOrderStatus, createOrder, getOrderById } from "../Controllers/order.controller.js";
import { verifyJWT, isAdmin } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", createOrder); 
router.get("/:id", getOrderById); 
router.get("/", verifyJWT, isAdmin, getOrders);
router.put("/:id/status", verifyJWT, isAdmin, updateOrderStatus);

export default router;