// store/reservationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Reservation {
  id: string;
  hotelName: string;
  city: string;
  price: number;
  roomType: "standard" | "vip";
  date: string;
}

interface ReservationState {
  reservations: Reservation[];
}

const initialState: ReservationState = {
  reservations: [],
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.push(action.payload);
    },
  },
});

export const { addReservation } = reservationSlice.actions;
export default reservationSlice.reducer;
