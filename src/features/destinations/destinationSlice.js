import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../api/apiClient";

const initialState = {
    items: [], 
    status: 'waiting', 
    error: null,
};

export const fetchDestinations = createAsyncThunk(
    'destinations/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiRequest('/destinations/index.php', {
                method: 'GET',
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const destinationSlice = createSlice({
    name: 'destinations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDestinations.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(fetchDestinations.fulfilled, (state, action) => {
                state.status = 'success';
                state.items = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
            })
            .addCase(fetchDestinations.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            });
    }
});

export default destinationSlice.reducer;