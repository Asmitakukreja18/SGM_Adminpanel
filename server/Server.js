import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/category.routes.js";
import adminAuthRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import orderRoutes from "./routes/order.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/admin", adminAuthRoutes);
app.use("/admin", productRoutes);
app.use("/admin", categoryRoutes);
app.use("/admin", analyticsRoutes);

app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", whatsappRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
