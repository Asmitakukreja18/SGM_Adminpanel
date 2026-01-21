import express from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  matchProducts
} from "../Controllers/product.controller.js";

import { protectAdmin } from "../Middlewares/Protectadmin.js";
import { upload } from "../Middlewares/upload.middleware.js";

const router = express.Router();


router.post("/products", protectAdmin, upload.array("images", 5), addProduct);

router.get("/products", getProducts);


router.post("/products/match", matchProducts);


router.put("/products/:id", protectAdmin, upload.array("images", 5), updateProduct);


router.delete("/products/:id", protectAdmin, deleteProduct);

export default router;
