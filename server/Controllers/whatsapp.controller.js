export const createWhatsAppOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    if (!customer || !items || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

   
    let message = `*New Order Request*\n\n`;
    message += `*Customer:* ${customer.name}\n`;
    message += `*Phone:* ${customer.phone}\n\n`;
    message += `*Items:*\n`;
    
    items.forEach((item) => {
      message += `- ${item.name} (x${item.qty}) - ₹${item.price * item.qty}\n`;
    });

    message += `\n*Total Amount:* ₹${totalAmount}`;

  
    const encodedMessage = encodeURIComponent(message);
    

    const adminPhone = "919876543210"; 
    
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

    res.status(200).json({ whatsappUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
