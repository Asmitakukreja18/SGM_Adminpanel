import Product from "../Models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { name, sku, categoryId, subCategoryId, description, isActive } = req.body;
    let variants = req.body.variants;

    if (typeof variants === "string") {
      variants = JSON.parse(variants);
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
    }

    const product = await Product.create({
      name,
      sku,
      categoryId,
      subCategoryId,
      description,
      isActive: isActive === "true" || isActive === true,
      variants,
      images
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getProducts = async (req, res) => {
  const products = await Product.find()
    .populate("categoryId", "name")
    .populate("subCategoryId", "name")
    .sort({ createdAt: -1 });

  res.json(products);
};

export const updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (updateData.variants && typeof updateData.variants === "string") {
      updateData.variants = JSON.parse(updateData.variants);
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(
        (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
     
      updateData.images = newImages; 
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};


export const matchProducts = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid items list" });
    }

    let foundProducts = [];
    let notFound = [];

    for (const itemName of items) {
    
      const product = await Product.findOne({
        name: { $regex: itemName, $options: "i" },
        isActive: true
      });

      if (product) {
        foundProducts.push(product);
      } else {
        notFound.push(itemName);
      }
    }

    res.json({ found: foundProducts, notFound });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
