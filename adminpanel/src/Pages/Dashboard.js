import {
  Box,
  Grid,
  Card,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  ShoppingCart,
  CurrencyRupee,
  Inventory2,
  WarningAmber
} from "@mui/icons-material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../Store/OrderSlice";
import { fetchProducts } from "../Store/ProductSlice";

const salesData = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 500 },
  { name: "Thu", value: 450 },
  { name: "Fri", value: 600 },
  { name: "Sat", value: 700 },
  { name: "Sun", value: 650 }
];

const categoryData = [
  { name: "Vegetables", value: 40 },
  { name: "Fruits", value: 30 },
  { name: "Dairy", value: 20 },
  { name: "Snacks", value: 10 }
];

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#a855f7"];

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return { bg: "#DCFCE7", text: "#16A34A" };
    case "Processing":
      return { bg: "#DBEAFE", text: "#2563EB" };
    case "Pending":
      return { bg: "#FEF9C3", text: "#CA8A04" };
    case "Cancelled":
      return { bg: "#FEE2E2", text: "#DC2626" };
    default:
      return { bg: "#F3F4F6", text: "#374151" };
  }
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);


  const totalOrders = orders.length;
  const totalSales = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const totalProducts = products.length;


  const lowStockCount = products.reduce((acc, product) => {
    const lowStockVariants = product.variants.filter(v => v.stock <= 10).length;
    return acc + lowStockVariants;
  }, 0);

  const activeProducts = products.filter(p => p.isActive !== false).length; // Assuming isActive field exists or default true


  const recentOrders = orders.slice(0, 5);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4} mb={7}>
        <StatCard
          icon={<ShoppingCart />}
          bg="#dbeafe"
          color="#2563eb"
          label="Total Orders"
          value={totalOrders}
          badge="+12.5%"
          badgeColor="success"
        />
        <StatCard
          icon={<CurrencyRupee />}
          bg="#dcfce7"
          color="#16a34a"
          label="Total Sales"
          value={`₹${totalSales.toLocaleString()}`}
          badge="+8.2%"
          badgeColor="success"
        />
        <StatCard
          icon={<Inventory2 />}
          bg="#f3e8ff"
          color="#9333ea"
          label="Total Products"
          value={totalProducts}
          badge={`${activeProducts} Active`}
          badgeColor="default"
        />
        <StatCard
          icon={<WarningAmber />}
          bg="#fee2e2"
          color="#dc2626"
          label="Low Stock Items"
          value={lowStockCount}
          badge="Urgent"
          badgeColor="error"
        />
      </Grid>

      <Grid container spacing={4} mb={3}>
        <Grid item xs={12} lg={6}>
          <Card sx={cardStyle}>
            <Box sx={cardHeader}>
              <Typography fontWeight={700}>Sales Overview</Typography>
              <Button size="small" variant="outlined">
                Last 7 Days
              </Button>
            </Box>
            <Box sx={{ height: 260, width: 500 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <XAxis dataKey="name" />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>

            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={cardStyle}>
            <Typography fontWeight={700} mb={2}>
              Category Distribution
            </Typography>
            <Box sx={{ height: 260, width: 500 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    outerRadius={120}
                    innerRadius={70}
                    paddingAngle={2}
                  >

                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card sx={cardStyle}>
        <Box sx={cardHeader}>
          <Typography fontWeight={700}>Recent Orders</Typography>
        </Box>

        <Table>
          <TableHead sx={{ bgcolor: "#f9fafb" }}>
            <TableRow>
              {["Order ID", "Customer", "Date", "Amount", "Status", "Action"].map(
                (h) => (
                  <TableCell
                    key={h}
                    sx={{ fontSize: 12, fontWeight: 700, color: "#4b5563" }}
                  >
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {recentOrders.map((o) => {
              const { bg, text } = getStatusColor(o.status);
              return (
                <TableRow hover key={o._id}>
                  <TableCell fontWeight={600}>#{o._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>{o.user?.name || o.customer?.name || "Guest"}</TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell fontWeight={600}>₹{o.totalAmount}</TableCell>
                  <TableCell>
                    <Chip
                      label={o.status}
                      size="small"
                      sx={{
                        bgcolor: bg,
                        color: text,
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" sx={{ color: "#16a34a" }}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {recentOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No recent orders</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}

function StatCard({ icon, bg, color, label, value, badge, badgeColor }) {
  return (
    <Grid item xs={12} md={6} lg={3}>
      <Card sx={cardStyle}>
        <Box sx={{
          display: "flex", justifyContent: "space-between", mb: 2, width: 178,
          height: 68,
        }}>
          <Box
            sx={{
              width: 58,
              height: 58,
              bgcolor: bg,
              color,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {icon}
          </Box>
          <Chip label={badge} color={badgeColor} size="small" />
        </Box>
        <Typography fontSize={13} color="text.secondary">
          {label}
        </Typography>
        <Typography fontSize={28} fontWeight={800}>
          {value}
        </Typography>
      </Card>
    </Grid>
  );
}

const cardStyle = {
  borderRadius: 4,
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  p: 3
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 3
};

const orders = [
  {
    id: "#SGM2024001",
    customer: "Rajesh Kumar",
    date: "Today, 10:30 AM",
    amount: "₹340",
    status: "Delivered",
    bg: "#dcfce7",
    color: "#16a34a"
  },
  {
    id: "#SGM2024002",
    customer: "Priya Sharma",
    date: "Today, 11:15 AM",
    amount: "₹520",
    status: "Processing",
    bg: "#dbeafe",
    color: "#2563eb"
  },
  {
    id: "#SGM2024003",
    customer: "Amit Patel",
    date: "Today, 12:00 PM",
    amount: "₹285",
    status: "Pending",
    bg: "#fef9c3",
    color: "#ca8a04"
  }
];
