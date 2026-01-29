import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    unit: { type: String, required: true },   
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    images: [String],

    variants: {
      type: [variantSchema],
      required: true
    },

    stock: {
      type: Number,
      default: 0
    },

    description: String,

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
