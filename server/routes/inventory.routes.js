import express from "express";
import {
  addInventoryEntry,
  getCurrentStock
} from "../Controllers/inventory.controller.js";

import { verifyJWT, isAdmin } from "../Middlewares/auth.middleware.js";

const router = express.Router();


router.post(
  "/",
  verifyJWT,
  isAdmin,
  addInventoryEntry
);


router.get(
  "/stock/:productId/:variant",
  verifyJWT,
  getCurrentStock
);

export default router;
