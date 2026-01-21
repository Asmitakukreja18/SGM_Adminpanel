import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    }
  }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    icon: {
      type: String,
      default: "📦" 
    },
    iconBg: {
      type: String,
      default: "#F3F4F6"
    },
    iconColor: {
      type: String,
      default: "#111827"
    },

    subCategories: [subCategorySchema],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
