import { Room } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookRoomStore {
  bookedRoomData: RoomDataType | null;
  paymentIntentId: string | null;
  clientSecret: string | undefined;
  setRoomData: (data: RoomDataType) => void;
  setPaymentIntentId: (paymentIntentId: string) => void;
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

const useBookRoom = create<BookRoomStore>()(
  persist(
    (set) => ({
      bookedRoomData: null,
      paymentIntentId: null,
      clientSecret: undefined,
      setRoomData: (data: RoomDataType) => {
        set({ bookedRoomData: data });
      },
      setPaymentIntentId: (paymentIntentId: string) => {
        set({ paymentIntentId });
      },
      setClientSecret: (clientSecret: string) => {
        set({ clientSecret });
      },
      resetBookRoom: () => {
        set({
          bookedRoomData: null,
          paymentIntentId: null,
          clientSecret: undefined,
        });
      },
    }),
    {
      name: "BookRoom",
    }
  )
);

export default useBookRoom;
