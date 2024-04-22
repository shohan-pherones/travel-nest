import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!params.roomId) {
      return new NextResponse("Room id is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const room = await prisma.room.update({
      where: {
        id: params.roomId,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("ERR at /api/room/roomId PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { userId } = auth();

    if (!params.roomId) {
      return new NextResponse("Hotel id is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const room = await prisma.room.delete({
      where: {
        id: params.roomId,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("ERR at /api/room/roomId DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
