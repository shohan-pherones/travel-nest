import { Room } from "@prisma/client";
import { create } from "zustand";

interface BookRoomStore {
  bookedRoomData: RoomDataType | null;
  paymentIntent: string | null;
  clientSecret: string | undefined;
  setRoomData: (data: RoomDataType) => void;
  setPaymentIntent: (paymentIntent: string) => void;
  setClientSecret: (clientSecret: string) => void;
  resetBookRoom: () => void;
}

interface RoomDataType {
  room: Room;
  totalPrice: number;
  breakfastIncluded: boolean;
  startDate: Date;
  endDate: Date;
}

const useBookRoom = create<BookRoomStore>((set) => ({
  bookedRoomData: null,
  paymentIntent: null,
  clientSecret: undefined,
  setRoomData: (data: RoomDataType) => {
    set({ bookedRoomData: data });
  },
  setPaymentIntent: (paymentIntent: string) => {
    set({ paymentIntent });
  },
  setClientSecret: (clientSecret: string) => {
    set({ clientSecret });
  },
  resetBookRoom: () => {
    set({
      bookedRoomData: null,
      paymentIntent: null,
      clientSecret: undefined,
    });
  },
}));
