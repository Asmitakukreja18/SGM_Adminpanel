import Cart from "../Models/Cart.js";


export const addToCart = async (req, res) => {
  try {
    const { cartId, productId, name, variant, price, quantity, image } = req.body;

    if (!cartId || !productId || !quantity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ cartId });

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
