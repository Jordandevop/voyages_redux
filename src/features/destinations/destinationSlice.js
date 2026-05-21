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

export const removeDestination = createAsyncThunk(
    'destinations/removeDestination',
    async (destinationId, { rejectWithValue }) => {
        try {
            await apiRequest('/destinations/delete.php', {
                method: 'POST',
                body: JSON.stringify({ id: destinationId }),
            });
            return destinationId; 
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
            })
            .addCase(removeDestination.fulfilled, (state, action)=>{
                state.items = state.items.filter((dest) => dest.id !== action.payload);
            })
    }
});

export default destinationSlice.reducer;