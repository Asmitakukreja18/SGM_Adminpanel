import Order from "../Models/Order.js";
import Product from "../Models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { items, customer, totalAmount } = req.body;


    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      const variantIndex = product.variants.findIndex((v) => v.unit === item.variant);
      if (variantIndex === -1) {
        return res.status(400).json({ message: `Variant not found: ${item.variant} for ${item.name}` });
      }

      if (product.variants[variantIndex].stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name} (${item.variant}). Available: ${product.variants[variantIndex].stock}`
        });
      }
    }


    for (const item of items) {
      const product = await Product.findById(item.productId);
      const variantIndex = product.variants.findIndex((v) => v.unit === item.variant);

      product.variants[variantIndex].stock -= item.quantity;
      await product.save();
    }


    const order = await Order.create({
      items,
      customer,
      totalAmount
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};