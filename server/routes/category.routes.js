import express from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from "../Controllers/Category.controller.js";

import { protectAdmin } from "../Middlewares/Protectadmin.js";

const router = express.Router();

router.post("/categories", protectAdmin, addCategory);
router.get("/categories", getCategories); // Public
router.put("/categories/:id", protectAdmin, updateCategory);
router.delete("/categories/:id", protectAdmin, deleteCategory);

export default router;
