import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";

export const getBookingsByHotelOwnerId = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const bookings = await prisma.booking.findMany({
      where: {
        hotel_owner_id: userId,
      },
      include: {
        room: true,
        hotel: true,
      },
      orderBy: {
        bookedAt: "desc",
      },
    });

    if (!bookings) return null;

    return bookings;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
