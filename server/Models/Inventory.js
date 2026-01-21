import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    variant: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true
    },
    reason: {
      type: String,
      required: false,
      default: "Manual Update"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
