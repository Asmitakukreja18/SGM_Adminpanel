import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true }
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: String,
        variant: String,
        quantity: Number,
        price: Number
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);