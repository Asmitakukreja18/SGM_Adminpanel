import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../Store/OrderSlice";

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

export default function OrdersManagement() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateOrderStatus({ id, status: newStatus }));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/40";
    if (imagePath.startsWith("http")) return imagePath;
    const normalizedPath = imagePath.replace(/\\/g, "/");
    return `http://localhost:5000/${normalizedPath}`;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  return (
    <Box p={3}>
      <Box mb={4}>
        <Typography fontSize={24} fontWeight={700}>
          Order Management
        </Typography>
        <Typography color="text.secondary">
          View and manage customer orders
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 3, border: "1px solid #eee" }}>

        <Box p={3} display="flex" gap={2}>
          <TextField size="small" placeholder="Search orders..." />

          <Select size="small" defaultValue="">
            <MenuItem value="">All Status</MenuItem>
            <MenuItem>Pending</MenuItem>
            <MenuItem>Processing</MenuItem>
            <MenuItem>Delivered</MenuItem>
            <MenuItem>Cancelled</MenuItem>
          </Select>

          <TextField size="small" type="date" />
        </Box>

        <Table>
          <TableHead sx={{ bgcolor: "#F9FAFB" }}>
            <TableRow>
              {[
                "Order ID",
                "Customer",
                "Date & Time",
                "Items",
                "Amount",
                "Status",
                "Actions"
              ].map(h => (
                <TableCell
                  key={h}
                  sx={{ fontSize: 12, fontWeight: 700 }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : orders.map((o) => {
              const { bg, text } = getStatusColor(o.status);
              return (
                <TableRow key={o._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    #{o._id.slice(-6).toUpperCase()}
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>{o.user?.name || o.customer?.name || "Guest"}</Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {o.user?.email || o.customer?.phone || "N/A"}
                    </Typography>
                  </TableCell>

                  <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{o.items.length} items</TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    ₹{o.totalAmount}
                  </TableCell>

                  <TableCell>
                    <Select
                      size="small"
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      sx={{
                        bgcolor: bg,
                        color: text,
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: "999px",
                        ".MuiOutlinedInput-notchedOutline": {
                          border: "none"
                        }
                      }}
                    >
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      sx={{
                        color: "#2563EB",
                        fontWeight: 600,
                        textTransform: "none"
                      }}
                      onClick={() => handleViewDetails(o)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <Box
          p={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontSize={14} color="text.secondary">
            Showing {orders.length} entries
          </Typography>
        </Box>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Order Details #{selectedOrder?._id.slice(-6).toUpperCase()}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Customer Information</Typography>
                <Typography variant="body2"><strong>Name:</strong> {selectedOrder.user?.name || selectedOrder.customer?.name}</Typography>
                <Typography variant="body2"><strong>Phone:</strong> {selectedOrder.user?.phone || selectedOrder.customer?.phone}</Typography>
                <Typography variant="body2"><strong>Address:</strong> {selectedOrder.user?.address || selectedOrder.customer?.address}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Order Information</Typography>
                <Typography variant="body2"><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</Typography>
                <Typography variant="body2"><strong>Status:</strong> {selectedOrder.status}</Typography>
                <Typography variant="body2"><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>Order Items</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Variant</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Box
                              component="img"
                              src={getImageUrl(item.productId?.images?.[0])}
                              sx={{ width: 40, height: 40, borderRadius: 1, objectFit: "cover" }}
                            />
                            <Typography variant="body2">{item.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{item.variant}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell>₹{item.quantity * item.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
