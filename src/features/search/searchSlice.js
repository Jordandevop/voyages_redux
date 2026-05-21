import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../api/apiClient";

const initialState = {
    results: [],
    status: 'waiting',
     // waiting 
     //  pending 
     //  success 
     // error
    error: null,
};

export const searchDestinations = createAsyncThunk(
    'search/searchDestinations',
    async (searchParams, { rejectWithValue }) => {
        try {
            const activeParams = Object.fromEntries(
                Object.entries(searchParams).filter(([_, value]) => value !== "")
            );
            
            const queryParams = new URLSearchParams(activeParams).toString();

            const endpoint = queryParams ? `/destinations/search.php?${queryParams}` : '/destinations/index.php';

            return await apiRequest(endpoint, {
                method: 'GET',
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.results = [];
            state.status = 'waiting';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchDestinations.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(searchDestinations.fulfilled, (state, action) => {
                state.status = 'success';
                state.results = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
            })
            .addCase(searchDestinations.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            });
    }
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;