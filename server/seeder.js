import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Category from "./Models/Category.js";
import Product from "./Models/Product.js";
import Order from "./Models/Order.js";

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    console.log("Cleaning database...");
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log("Seeding Categories...");
    const categories = await Category.insertMany([
      {
        name: "Vegetables",
        icon: "Carrot",
        iconBg: "#DCFCE7",
        iconColor: "#16A34A",
        subCategories: [{ name: "Leafy Greens" }, { name: "Root Vegetables" }, { name: "Cruciferous" }]
      },
      {
        name: "Fruits",
        icon: "Apple",
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
        subCategories: [{ name: "Citrus" }, { name: "Berries" }, { name: "Tropical" }]
      },
      {
        name: "Dairy & Eggs",
        icon: "Egg",
        iconBg: "#FEF9C3",
        iconColor: "#CA8A04",
        subCategories: [{ name: "Milk" }, { name: "Cheese" }, { name: "Yogurt" }]
      }
    ]);

    console.log("Seeding Products...");
    const products = await Product.insertMany([
      {
        name: "Fresh Spinach",
        sku: "VEG-001",
        categoryId: categories[0]._id,
        subCategoryId: categories[0].subCategories[0]._id,
        images: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=200"],
        variants: [
          { unit: "250g", price: 30, stock: 50 },
          { unit: "500g", price: 55, stock: 5 } 
        ],
        description: "Fresh organic spinach leaves."
      },
      {
        name: "Red Tomato",
        sku: "VEG-002",
        categoryId: categories[0]._id,
        subCategoryId: categories[0].subCategories[0]._id, 
        images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=200"],
        variants: [
          { unit: "1kg", price: 40, stock: 100 },
          { unit: "500g", price: 22, stock: 0 } 
        ],
        description: "Juicy red tomatoes."
      },
      {
        name: "Kashmir Apple",
        sku: "FRU-001",
        categoryId: categories[1]._id,
        subCategoryId: categories[1].subCategories[0]._id,
        images: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=200"],
        variants: [
          { unit: "1kg", price: 120, stock: 200 }
        ],
        description: "Sweet and crunchy apples from Kashmir."
      },
      {
        name: "Farm Fresh Eggs",
        sku: "DAI-001",
        categoryId: categories[2]._id,
        subCategoryId: categories[2].subCategories[0]._id, 
        images: ["https://images.unsplash.com/photo-1582722878654-02fd23747037?auto=format&fit=crop&q=80&w=200"],
        variants: [
          { unit: "6pcs", price: 45, stock: 30 },
          { unit: "12pcs", price: 85, stock: 15 }
        ],
        description: "Organic brown eggs."
      }
    ]);

    console.log("Seeding Orders...");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    await Order.insertMany([
      {
        customer: { name: "Rahul Sharma", phone: "9876543210", address: "123 Green Park, Delhi" },
        items: [
          { productId: products[0]._id, name: products[0].name, variant: "250g", quantity: 2, price: 30 }
        ],
        totalAmount: 60,
        status: "Delivered",
        createdAt: twoDaysAgo
      },
      {
        customer: { name: "Priya Singh", phone: "8765432109", address: "456 Blue Hills, Mumbai" },
        items: [
          { productId: products[2]._id, name: products[2].name, variant: "1kg", quantity: 1, price: 120 },
          { productId: products[0]._id, name: products[0].name, variant: "500g", quantity: 1, price: 55 }
        ],
        totalAmount: 175,
        status: "Processing",
        createdAt: yesterday
      },
      {
        customer: { name: "Amit Verma", phone: "7654321098", address: "789 Red Street, Bangalore" },
        items: [
          { productId: products[3]._id, name: products[3].name, variant: "12pcs", quantity: 2, price: 85 }
        ],
        totalAmount: 170,
        status: "Pending",
        createdAt: today
      }
    ]);

    console.log("Data Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
