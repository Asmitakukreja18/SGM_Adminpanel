import express from "express";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
} from "../Controllers/cart.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeFromCart);
router.get("/:cartId", getCart);

export default router;
