// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesSlice";
import reservationsReducer from "./reservationSlice"; 

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    reservations: reservationsReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
