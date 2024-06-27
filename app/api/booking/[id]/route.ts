import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!params.id) {
      return new NextResponse("Payment Intent id is required.", {
        status: 400,
      });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const booking = await prisma.booking.update({
      where: {
        payment_intent_id: params.id,
      },
      data: {
        payment_status: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.log("ERR at /api/booking/id PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!params.id) {
      return new NextResponse("Booking id is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const booking = await prisma.booking.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.log("ERR at /api/booking/id DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!params.id) {
      return new NextResponse("Hotel id is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await prisma.booking.findMany({
      where: {
        payment_status: true,
        roomId: params.id,
        end_date: {
          gt: yesterday,
        },
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.log("ERR at /api/booking/id GET", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
