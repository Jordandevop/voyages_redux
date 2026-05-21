import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../api/apiClient";

const initialState = {
    favorites: [],
    status: 'waiting',
    error: null,
};

export const fetchFavorites = createAsyncThunk(
    'favorites/fetchFavorites',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await apiRequest(`/favorites/index.php?user_id=${userId}`, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addFavorite = createAsyncThunk(
    'favorites/addFavorite',
    async (favoriteData, { rejectWithValue }) => {
        try {
            const response = await apiRequest('/favorites/store.php', {
                method: 'POST',
                body: JSON.stringify(favoriteData),
            });
            return response.favorite || favoriteData; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeFavorite = createAsyncThunk(
    'favorites/removeFavorite',
    async (id, { rejectWithValue }) => {
        try {
            await apiRequest('/favorites/delete.php', {
                method: 'POST',
                body: JSON.stringify({destinationId: id}),
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        clearFavorites: (state) => {
            state.favorites = [];
            state.status = 'waiting';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.status = 'success';
                state.favorites = Array.isArray(action.payload) ? action.payload : action.payload.favorites || [];
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.favorites.push(action.payload);
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.favorites = state.favorites.filter(
                    (fav) => String(fav.destination_id) !== String(action.payload)
                );
            });
    }
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;