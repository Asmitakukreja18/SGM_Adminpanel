import Order from "../Models/Order.js";
import Product from "../Models/Product.js";
import Category from "../Models/Category.js";


export const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);
    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCategoryPerformance = async (req, res) => {
  try {
    const categoryStats = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.name",
          totalSales: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          itemCount: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);
    res.json(categoryStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Daily Sales Summary (Last 7 Days)
export const getDailySales = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStockReport = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId", "name");
    
    const report = {
      lowStock: [],
      outOfStock: []
    };

    products.forEach(p => {
      p.variants.forEach(v => {
        if (v.stock === 0) {
          report.outOfStock.push({
            name: p.name,
            variant: v.unit,
            category: p.categoryId?.name,
            stock: 0
          });
        } else if (v.stock <= 10) {
          report.lowStock.push({
            name: p.name,
            variant: v.unit,
            category: p.categoryId?.name,
            stock: v.stock
          });
        }
      });
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
