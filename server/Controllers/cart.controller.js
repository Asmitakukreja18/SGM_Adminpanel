import Cart from "../Models/Cart.js";
import Product from "../Models/Product.js";


export const addToCart = async (req, res) => {
  try {
    const { cartId, productId, name, variant, price, quantity, image } = req.body;

    if (!cartId || !productId || !quantity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

   
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variantData = product.variants.find(v => v.unit === variant);
    if (!variantData) {
      return res.status(400).json({ message: "Variant not found" });
    }

    let cart = await Cart.findOne({ cartId });
    let newQuantity = quantity;

    if (cart) {
      const existingItem = cart.items.find(
        (p) => p.productId.toString() === productId && p.variant === variant
      );
      if (existingItem) {
        newQuantity += existingItem.quantity;
      }
    }

    if (variantData.stock < newQuantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Only ${variantData.stock} available.` 
      });
    }

    if (!cart) {
     
      cart = new Cart({
        cartId,
        items: [{ productId, name, variant, price, quantity, image }],
        totalAmount: price * quantity,
      });
    } else {
     
      const itemIndex = cart.items.findIndex(
        (p) => p.productId.toString() === productId && p.variant === variant
      );

      if (itemIndex > -1) {
      
        cart.items[itemIndex].quantity += quantity;
      } else {
      
        cart.items.push({ productId, name, variant, price, quantity, image });
      }

    
      cart.totalAmount = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const { cartId, productId, variant, quantity } = req.body;

    if (!cartId || !productId || quantity === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

   
    if (quantity > 0) {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });
      
      const variantData = product.variants.find(v => v.unit === variant);
      if (!variantData) return res.status(400).json({ message: "Variant not found" });

      if (variantData.stock < quantity) {
         return res.status(400).json({ 
          message: `Insufficient stock. Only ${variantData.stock} available.` 
        });
      }
    }

    const itemIndex = cart.items.findIndex(
      (p) => p.productId.toString() === productId && p.variant === variant
    );

    if (itemIndex > -1) {
      if (quantity > 0) {
        cart.items[itemIndex].quantity = quantity;
      } else {
     
        cart.items.splice(itemIndex, 1);
      }

     
      cart.totalAmount = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { cartId, productId, variant } = req.body;

    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (p) => !(p.productId.toString() === productId && p.variant === variant)
    );

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findOne({ cartId });
    
    if (!cart) {
      return res.status(200).json({ cartId, items: [], totalAmount: 0 });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
