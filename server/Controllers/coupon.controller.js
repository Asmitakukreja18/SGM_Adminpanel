export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

   
    const coupons = {
      "FIRST50": { discount: 50, type: "flat" },
      "WELCOME10": { discount: 10, type: "percentage" },
      "SAVE20": { discount: 20, type: "flat" }
    };

    const coupon = coupons[code.toUpperCase()];

    if (coupon) {
      res.status(200).json({ 
        success: true, 
        code: code.toUpperCase(),
        ...coupon 
      });
    } else {
      res.status(404).json({ message: "Invalid coupon code" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
