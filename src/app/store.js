import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import authSliceReducer from "../features/auth/authSlice";
import filterReducer from "../features/filter/filterSlice";
import projectsSliceReducer from "../features/projects/projectsSlice";
import teamsSliceReducer from "../features/teams/teamsSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        teams: teamsSliceReducer,
        projects: projectsSliceReducer,
        filter: filterReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddlewares) =>
        getDefaultMiddlewares().concat(apiSlice.middleware),
});
