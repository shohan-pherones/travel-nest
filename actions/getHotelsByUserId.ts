import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const getHotelsByUserId = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const hotels = await prisma.hotel.findMany({
      where: {
        userId,
      },
      include: {
        rooms: true,
      },
    });

    if (!hotels) return null;

    return hotels;
  } catch (error: any) {
    throw new Error(error);
  }
};
