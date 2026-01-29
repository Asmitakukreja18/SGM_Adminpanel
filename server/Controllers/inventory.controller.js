import Inventory from "../Models/Inventory.js";
import Product from "../Models/Product.js";

export const addInventoryEntry = async (req, res) => {
  const { productId, variant, quantity, type, reason } = req.body;

  try {
 
    const entry = await Inventory.create({
      productId,
      variant,
      quantity,
      type,
      reason
    });


    const product = await Product.findById(productId);
    if (product) {
      const variantIndex = product.variants.findIndex((v) => v.unit === variant);
      if (variantIndex > -1) {
        if (type === "IN") {
          product.variants[variantIndex].stock += Number(quantity);
        } else if (type === "OUT") {
          product.variants[variantIndex].stock -= Number(quantity);
        }
        
       
        product.stock = product.variants.reduce((acc, curr) => acc + Number(curr.stock), 0);
        
        await product.save();
      }
    }

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentStock = async (req, res) => {
  try {
    const { productId, variant } = req.params;

    const entries = await Inventory.find({ productId, variant });

    const totalStock = entries.reduce((acc, entry) => {
      if (entry.type === "IN") return acc + entry.quantity;
      if (entry.type === "OUT") return acc - entry.quantity;
      return acc;
    }, 0);

    res.json({ productId, variant, stock: totalStock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
