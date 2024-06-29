import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";

export const getBookingsByUserId = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
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
