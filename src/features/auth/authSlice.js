import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { apiRequest } from "../../api/apiClient"

// Si l'utilisateur recharge la page
const storedUser = localStorage.getItem('user') 
const storedToken = localStorage.getItem('token') 

const initialState = {
    user: storedUser ?JSON.parse(storedUser) : null,

    token: storedToken || null,

    status: 'waiting',
    // Statut de nos requete
        // waiting
        // pending
        // success
        // error

    error: null,
}

export const loginUser = createAsyncThunk(

    // nom de l'action
    'auth/loginUser',

    // fonction nous permettant de faire la connexion
    // RejectedWithValue : fonction fournie par createAsyncThunk
    // permet de retourner une erreur personnalisée : le message de notre API
    async (userInfos, { rejectWithValue }) => {
        try {
            return await apiRequest('/auth/login.php', {
                // Méthode POST
                method: 'POST',
                // on envoie du JSON
                body: JSON.stringify(userInfos),
            })
        } catch(error) {
            return rejectWithValue(error.message)
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userInfos, {rejectWithValue}) => {
        try {
            return await apiRequest('/auth/register.php', {
                method: 'POST',
                body: JSON.stringify(userInfos),
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)


const authSlice = createSlice({
    name: 'auth',

    initialState,

    reducers: {
        logout: (state, action)=>{
            state.user = null;
            state.token = null;
            state.status = 'waiting';
            state.error= null;

            localStorage.removeItem('user');
            localStorage.removeItem('token')
        },
        updateLocalUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
    },

    extraReducers : (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'pending'

                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'success'

                state.user = action.payload 

                state.token = action.payload.accessToken

                localStorage.setItem('user', JSON.stringify(action.payload))
                localStorage.setItem('token', action.payload.accessToken)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'error'

                state.error = action.payload
            })
            .addCase(registerUser.pending, (state)=> {
                state.status = 'pending'

                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action)=>{
                state.status= 'success'

                state.user = action.payload

                state.token = action.payload.accessToken

                localStorage.setItem('user', JSON.stringify(action.payload))
                localStorage.setItem('token', action.payload.accessToken)
            })

            .addCase(registerUser.rejected, (state, action)=>{
                 state.status = 'error'

                state.error = action.payload
            })
    }
})

export const {logout, updateLocalUser} = authSlice.actions
export default authSlice.reducer;