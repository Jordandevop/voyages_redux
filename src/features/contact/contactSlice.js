import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../../api/apiClient"

const initialState = {
    contacts: [],

    status: 'waiting',
    // Statut de nos requêtes
        // waiting
        // pending
        // success
        // error

    error: null,
}

export const sendMessage = createAsyncThunk(
    'contact/sendMessage',
    async (contactData, { rejectWithValue }) => {
        try {
            return await apiRequest('/contact/store.php', {
                method: 'POST',
                body: JSON.stringify(contactData),
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
);

export const fetchContacts = createAsyncThunk(
    'contact/fetchContacts',
    async (_, { rejectWithValue }) => {
        try {
            return await apiRequest('/contact/index.php', {
                method: 'GET',
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
);

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        resetContactStatus: (state) => {
            state.status = 'waiting';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.status = 'pending'
                state.error = null
            })
            .addCase(sendMessage.fulfilled, (state) => {
                state.status = 'success'
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.status = 'error'
                state.error = action.payload
            })

            .addCase(fetchContacts.pending, (state) => {
                state.status = 'pending'
                state.error = null
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.status = 'success'
                state.contacts = action.payload 
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.status = 'error'
                state.error = action.payload
            })
    }
})

export const { resetContactStatus } = contactSlice.actions;
export default contactSlice.reducer;