import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./Models/Admin.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ email: "admin@smartgrocery.com" });
    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    await Admin.create({
      email: "admin@smartgrocery.com",
      password: "admin123",
      role: "ADMIN"
    });

    console.log("Admin created: admin@smartgrocery.com / admin123");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
