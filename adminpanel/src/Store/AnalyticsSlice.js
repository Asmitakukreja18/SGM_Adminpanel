import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

export const fetchTopSelling = createAsyncThunk("analytics/fetchTopSelling", async (_, thunkAPI) => {
  try {
    const res = await api.get("/admin/analytics/top-selling");
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const fetchCategoryPerformance = createAsyncThunk("analytics/fetchCategoryPerformance", async (_, thunkAPI) => {
  try {
    const res = await api.get("/admin/analytics/categories");
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const fetchDailySales = createAsyncThunk("analytics/fetchDailySales", async (_, thunkAPI) => {
  try {
    const res = await api.get("/admin/analytics/daily-sales");
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const fetchStockReport = createAsyncThunk("analytics/fetchStockReport", async (_, thunkAPI) => {
  try {
    const res = await api.get("/admin/analytics/stock");
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    topSelling: [],
    categoryPerformance: [],
    dailySales: [],
    stockReport: { lowStock: [], outOfStock: [] },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchTopSelling.pending, (state) => { state.loading = true; })
      .addCase(fetchTopSelling.fulfilled, (state, action) => {
        state.loading = false;
        state.topSelling = action.payload;
      })
      
  
      .addCase(fetchCategoryPerformance.fulfilled, (state, action) => {
        state.categoryPerformance = action.payload;
      })

   
      .addCase(fetchDailySales.fulfilled, (state, action) => {
        state.dailySales = action.payload;
      })

    
      .addCase(fetchStockReport.fulfilled, (state, action) => {
        state.stockReport = action.payload;
        state.loading = false;
      });
  }
});

export default analyticsSlice.reducer;
