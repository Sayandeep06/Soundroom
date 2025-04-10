import PrismaClient from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const downvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  const user = await PrismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
  }

  try {
    const data = downvoteSchema.parse(await req.json());

    await PrismaClient.upvote.delete({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: data.streamId,
        },
      },
    });

    return NextResponse.json({ message: "Downvoted successfully" });
  } catch (e) {
    console.error(e); // log it for debug
    return NextResponse.json({ message: "Error downvoting" }, { status: 400 });
  }
}