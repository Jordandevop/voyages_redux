import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../../api/apiClient"

const initialState ={
    favorites: [],
    status: 'waiting',
    error: null,
}

export const fetchFavorites = createAsyncThunk(
    'favorite/fetchFavorites',
    async (_, { rejectWithValue }) => {
        try {
            return await apiRequest('/favorites/index.php', {
                method: 'GET',
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
);

export const addFavorite = createAsyncThunk(
    'favorite/addFavorite',
    async (destinationId, { rejectWithValue }) => {
        try {
            return await apiRequest('/favorites/store.php', {
                method: 'POST',
                body: JSON.stringify({ destination_id: destinationId }),
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
);

export const removeFavorite = createAsyncThunk(
    'favorite/removeFavorite',
    async (destinationId, { rejectWithValue }) => {
        try {
            return await apiRequest('/favorites/delete.php', {
                method: 'POST',
                body: JSON.stringify({ destination_id: destinationId }),
             })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
);

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        resetFavoriteStatus: (state) => {
            state.status = 'waiting';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.status = 'pending'
                state.error = null
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.status = 'success'
                state.favorites = action.payload || []
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.status = 'error'
                state.error = action.payload
            })

            .addCase(addFavorite.pending, (state) => {
                state.status = 'pending'
                state.error = null
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.status = 'success'
                state.favorites.push(action.payload)
            })
            .addCase(addFavorite.rejected, (state, action) => {
                state.status = 'error'
                state.error = action.payload
            })

            .addCase(removeFavorite.pending, (state) => {
                state.status = 'pending'
                state.error = null
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.status = 'success'
                state.favorites = state.favorites.filter(dest => dest.id !== action.payload.id)
            })
            .addCase(removeFavorite.rejected, (state, action) => {
                state.status = 'error'
                state.error = action.payload
            })
    },
})

export const { resetFavoriteStatus } = favoriteSlice.actions

export default favoriteSlice.reducer