import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../api/apiClient";

const initialState = {
    updateStatus: 'waiting', 
    updateError: null,
    
    passwordStatus: 'waiting', 
    passwordError: null,
};

export const updateProfile = createAsyncThunk(
    'users/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            return await apiRequest('/profile/update.php', {
                method: 'POST',
                body: JSON.stringify(profileData),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const changePassword = createAsyncThunk(
    'users/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            return await apiRequest('/profile/change-password.php', {
                method: 'POST',
                body: JSON.stringify(passwordData),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        resetProfileStatus: (state) => {
            state.updateStatus = 'waiting';
            state.updateError = null;
            state.passwordStatus = 'waiting';
            state.passwordError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.updateStatus = 'pending';
                state.updateError = null;
            })
            .addCase(updateProfile.fulfilled, (state) => {
                state.updateStatus = 'success';
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateStatus = 'error';
                state.updateError = action.payload;
            })
            
            .addCase(changePassword.pending, (state) => {
                state.passwordStatus = 'pending';
                state.passwordError = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.passwordStatus = 'success';
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.passwordStatus = 'error';
                state.passwordError = action.payload;
            });
    }
});

export const { resetProfileStatus } = usersSlice.actions;
export default usersSlice.reducer;