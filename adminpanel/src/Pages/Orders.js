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
  Button
} from "@mui/material";
import { useEffect } from "react";
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

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateOrderStatus({ id, status: newStatus }));
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
    </Box>
  );
}
