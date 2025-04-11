
import prismaClient from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import zod from 'zod';   
const yt_regex =/^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/

const youtubesearchapi = require("youtube-search-api");

const createStreamSchema = zod.object({
    creatorId: zod.string(),
    url : zod.string()
})



export async function POST(req: NextRequest){
    try{
        const data = createStreamSchema.parse(await req.json())
        const isyt = data.url.match(yt_regex)
        if(!isyt){        
            return NextResponse.json({
                message: "Error adding stream"
            },{ 
                status: 411
            })
        }


        const extractedId = data.url.split("?v=")[1];

        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log(data.creatorId)
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: { width: number }, b: { width: number }) =>
          a.width < b.width ? -1 : 1,
        );
        console.log("reached here")
        const user: any = await prismaClient.user.findFirst({
            where:{
                email: data.creatorId
            }
        })
        const stream = await prismaClient.stream.create({
            //@ts-ignore
            data:{               
                userId: user.id ?? "",
                url: data.url,
                extractedId,
                type: "Youtube",
                title: res.title ?? "Can't find video",
                smallImg:
                (thumbnails.length > 1
                  ? thumbnails[thumbnails.length - 2].url
                  : thumbnails[thumbnails.length - 1].url) ??
                "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
                bigImg:
                thumbnails[thumbnails.length - 1].url ??
                "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
            }
        });
        return NextResponse.json({
            message: "Added Stream",
            id: stream.id
        })
    }catch(e){
        return NextResponse.json({
            message: "Error end"
        },{
            status: 411
        })
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