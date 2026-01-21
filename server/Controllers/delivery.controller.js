export const getDeliveryCharges = async (req, res) => {
  try {
   
    const charge = 30;
    res.status(200).json({ charge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
