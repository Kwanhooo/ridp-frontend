"use client";
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from "@/store";

interface SidebarState {
    isSidebarOpen: boolean;
}

const initialState: SidebarState = {
    isSidebarOpen: true,
};

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setSidebarState: (state, action: PayloadAction<boolean>) => {
            state.isSidebarOpen = action.payload;
        },
    },
});

export const {toggleSidebar, setSidebarState} = sidebarSlice.actions;
export default sidebarSlice.reducer;
export const selectSidebar = (state: RootState) => state.sidebar.isSidebarOpen;
