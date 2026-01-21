import express from "express";
import {
  getTopSellingProducts,
  getCategoryPerformance,
  getDailySales,
  getStockReport
} from "../Controllers/analytics.controller.js";
import { protectAdmin } from "../Middlewares/Protectadmin.js";

const router = express.Router();

router.get("/analytics/top-selling", protectAdmin, getTopSellingProducts);
router.get("/analytics/categories", protectAdmin, getCategoryPerformance);
router.get("/analytics/daily-sales", protectAdmin, getDailySales);
router.get("/analytics/stock", protectAdmin, getStockReport);

export default router;
