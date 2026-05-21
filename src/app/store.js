import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import contactReducer from '../features/contact/contactSlice'
import favoriteReducer from '../features/favorites/favoriteSlice'
import destinationReducer from '../features/destinations/destinationSlice'
import usersReducer from '../features/users/usersSlice'
import commentReducer from '../features/comments/commentSlice'
import searchReducer from '../features/search/searchSlice'
import themeReducer from '../features/theme/themeSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        contact: contactReducer,
        favorites: favoriteReducer,
        destinations: destinationReducer,
        users: usersReducer,
        comments: commentReducer,
        search: searchReducer,
        theme: themeReducer,
    },
});