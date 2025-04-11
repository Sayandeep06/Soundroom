
import prismaClient from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import zod from 'zod';   
const yt_regex =/^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/
//@ts-ignore
import { Innertube } from "youtubei.js";

const createStreamSchema = zod.object({
    creatorId: zod.string(),
    url : zod.string()
})



export async function POST(req: NextRequest) {
    try {
      const data = createStreamSchema.parse(await req.json());
      const isyt = data.url.match(yt_regex);
  
      if (!isyt) {
        return NextResponse.json({ message: "Regex" }, { status: 400 });
      }
  
      const extractedId = data.url.split("?v=")[1];
  
      const youtube = await Innertube.create();
      const res = await youtube.getBasicInfo(extractedId);
      const info = res.basic_info;
  
      const url = `https://www.youtube.com/watch?v=${extractedId}`;
      const title = info.title ?? "Can't find video";
  
      const thumbnails = info.thumbnail ?? [];
      const smallImg = thumbnails[0]?.url ?? "";
      const bigImg = thumbnails[thumbnails.length - 1]?.url ?? "";
  
      const user = await prismaClient.user.findFirst({
        where: {
          email: data.creatorId,
        },
      });
  
      const stream = await prismaClient.stream.create({
        data: {
          userId: user?.id ?? "",
          url,
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
      console.error("Error while creating stream:", e);
      return NextResponse.json(
        { message: "Error end" },
        { status: 411 }
      );
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