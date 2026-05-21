import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../api/apiClient";

const initialState = {
    items: [],
    status: 'waiting', 
    error: null,
    
    addStatus: 'waiting', 
    addError: null,
};

export const fetchCommentsByDestination = createAsyncThunk(
    'comments/fetchByDestination',
    async (destinationId, { rejectWithValue }) => {
        try {
            return await apiRequest(`/comments/by-destination.php?destination_id=${destinationId}`, {
                method: 'GET',
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addComment = createAsyncThunk(
    'comments/addComment',
    async (commentData, { rejectWithValue }) => {
        try {
            return await apiRequest('/comments/store.php', {
                method: 'POST',
                body: JSON.stringify(commentData),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        resetAddCommentStatus: (state) => {
            state.addStatus = 'waiting';
            state.addError = null;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchCommentsByDestination.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(fetchCommentsByDestination.fulfilled, (state, action) => {
                state.status = 'success';
                state.items = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
            })
            .addCase(fetchCommentsByDestination.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })

            .addCase(addComment.pending, (state) => {
                state.addStatus = 'pending';
                state.addError = null;
            })
            .addCase(addComment.fulfilled, (state) => {
                state.addStatus = 'success';
            })
            .addCase(addComment.rejected, (state, action) => {
                state.addStatus = 'error';
                state.addError = action.payload;
            });
    }
});

export const { resetAddCommentStatus } = commentSlice.actions;
export default commentSlice.reducer;