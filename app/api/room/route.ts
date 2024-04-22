import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const room = await prisma.room.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at /api/room POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
