import prismaClient from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import zod from "zod";

const yt_regex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const createStreamSchema = zod.object({
  creatorId: zod.string(),
  url: zod.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = createStreamSchema.parse(await req.json());

    const match = data.url.match(yt_regex);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid YouTube URL" },
        { status: 411 }
      );
    }

    const extractedId = match[1];
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${extractedId}&format=json`;

    const oembedRes = await fetch(oembedUrl);
    if (!oembedRes.ok) {
      return NextResponse.json(
        { message: "Failed to fetch video info" },
        { status: 411 }
      );
    }

    const videoData = await oembedRes.json();
    const title = videoData.title || "Untitled Video";

    const smallImg = `https://img.youtube.com/vi/${extractedId}/mqdefault.jpg`;
    const bigImg = `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`;

    const user = await prismaClient.user.findFirst({
      where: {
        email: data.creatorId,
      },
    });

    const stream = await prismaClient.stream.create({
      data: {
        userId: user?.id ?? "",
        url: data.url,
        extractedId,
        type: "Youtube",
        title,
        smallImg,
        bigImg,
      },
    });

    return NextResponse.json({
      message: "Added Stream",
      id: stream.id,
    });
  } catch (e) {
    console.error("POST /stream error:", e);
    return NextResponse.json({ message: "Error adding stream" }, { status: 411 });
  }
}


//req.nextUrl.searchParams.get("creatorId")

export async function GET(req: NextRequest){
    try{
        const creatorId = req.nextUrl.searchParams.get("creatorId")
        if(!creatorId)  return NextResponse.json({ message: "Missing creatorId"},{status: 411})
        const streams = await prismaClient.stream.findMany({
            where:{
                userId: creatorId ?? ""
            },
            include: {
                _count: {
                    select:{
                        upvotes: true
                    }
                },
                upvotes: {
                    where: {userId: creatorId ?? ""}
                }
            }
        })
        return NextResponse.json({
            streams: streams.map(({_count, ...rest})=>({
                ...rest,
                upvotes: _count.upvotes,
                haveUpvoted: rest.upvotes.length ? true : false
            }))
        })

    }catch(e){
        message: "Error getting streams"
    }
}

export async function DELETE(req: NextRequest) {
    try {
      const streamId = req.nextUrl.searchParams.get("streamId")
      if (!streamId) {
        return NextResponse.json({ message: "Missing streamId" }, { status: 411 })
      }
  
      await prismaClient.stream.delete({
        where: { id: streamId },
      })
  
      return NextResponse.json({ message: "Deleted successfully" })
    } catch (e) {
      return NextResponse.json(
        { message: "Error deleting stream" },
        { status: 500 }
      )
    }
}