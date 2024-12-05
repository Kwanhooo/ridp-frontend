"use client";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import sidebarReducer from "./modules/sidebarSlice";
import {Provider} from "react-redux";


const rootReducer = combineReducers({
    sidebar: sidebarReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

// @ts-ignore
export function ReduxProvider({children}) {
    return <Provider store={store}>{children}</Provider>;
}

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
