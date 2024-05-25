import prisma from "@/lib/db";

export const getBookings = async (hotelId: string) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await prisma.booking.findMany({
      where: {
        hotelId,
        end_date: {
          gt: yesterday,
        },
      },
    });

    return bookings;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
