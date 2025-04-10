"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import DashboardHeader from "../components/DashboardHeader"
import { ChevronDown, ChevronUp, SkipBack, SkipForward, Share2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import YouTube from "react-youtube"

export default function Streamview({ creatorId }: { creatorId: string }) {
  interface Stream {
    id: string;
    url: string;
    extractedId: string;
    type: string;
    title: string;
    smallImg: string;
    bigImg: string;
    userId?: string;
    upvotes: number;
    haveUpvoted: boolean;
  }

  const { toast } = useToast()
  const [streams, setStreams] = useState<Stream[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [storedIndex, setStoredIndex] = useState<number | null>(null)

  useEffect(() => {
    const index = Number(localStorage.getItem(`streamIndex-${creatorId}`))
    if (!isNaN(index)) setStoredIndex(index)
  }, [creatorId])

  const fetchStreams = async () => {
    try {
      const res = await axios.get(`/api/streams/?creatorId=${creatorId}`)
      //@ts-ignore
      const sorted = res.data.streams.sort((a: Stream, b: Stream) => b.upvotes - a.upvotes)
      setStreams(sorted)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchStreams()
    const interval = setInterval(fetchStreams, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (streams.length > 0) {
      if (storedIndex !== null && storedIndex < streams.length) {
        setCurrentIndex(storedIndex)
      } else {
        setCurrentIndex(0)
      }
    }
  }, [streams, storedIndex])

  useEffect(() => {
    localStorage.setItem(`streamIndex-${creatorId}`, String(currentIndex))
  }, [currentIndex, creatorId])

  const handleVote = async (id: string, type: string) => {
    try {
      await axios.post(`/api/streams/${type}`, { streamId: id })
      fetchStreams()
    } catch (err) {
      console.error(err)
    }
  }

  const handleShare = () => {
    if (!creatorId) return

    const shareableLink = `${window.location.origin}/creator/${creatorId}`

    navigator.clipboard.writeText(shareableLink).then(() => {
      setCopied(true)
      toast({
        title: "Link copied to clipboard!",
        description: shareableLink,
        duration: 3000,
      })
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      toast({
        title: "Error copying link.",
        description: "Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    })
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const handleNext = () => {
    if (streams.length > 0) {
      setCurrentIndex((currentIndex + 1) % streams.length)
    }
  }

  const currentStream = streams[currentIndex]

  return (
    <div className="pt-20 px-6">
      <DashboardHeader />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          {currentStream && (
            <div className="aspect-video w-full">
              <YouTube
                videoId={currentStream.extractedId.split("&")[0]}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    autoplay: 1,
                    controls: 1,
                    modestbranding: 1,
                  },
                }}
                onEnd={handleNext}
                className="w-full h-full rounded-xl"
              />
              <div className="mt-2 text-lg text-white font-semibold">{currentStream.title}</div>
              <div className="mt-2 flex gap-2">
                <Button onClick={() => handleVote(currentStream.id, "upvote")} className="text-white">
                  <ChevronUp /> {currentStream.upvotes}
                </Button>
                <Button onClick={() => handleVote(currentStream.id, "downvote")} variant="destructive">
                  <ChevronDown />
                </Button>
                <Button onClick={handlePrevious} disabled={currentIndex === 0}>
                  <SkipBack />
                </Button>
                <Button onClick={handleNext} disabled={currentIndex >= streams.length - 1}>
                  <SkipForward />
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className={`${copied ? "animate-pulse" : ""}`}
                >
                  {copied ? "Link Copied" : "Share Stream"} <Share2 />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3 space-y-4">
          <div className="flex w-full gap-2 text-white justify-center h-10 text-bold items-center bg-indigo-600 rounded-md px-2">
            <div>
              Voting Queue
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-2">
            <div className="space-y-2">
              {streams.map((stream, idx) => (
                <Card key={stream.id} className={idx === currentIndex ? "opacity-50" : ""}>
                  <CardContent className="p-2 flex items-center gap-4">
                    <img src={stream.smallImg} alt="thumb" className="w-20 rounded" />
                    <div className="flex-1">
                      <div className="text-sm font-medium line-clamp-2">{stream.title}</div>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                      <Button variant="ghost" size="sm"  onClick={() => handleVote(stream.id, "upvote")}>
                        <ChevronUp />
                      </Button>
                      <div className="text-sm">{stream.upvotes}</div>
                      <Button variant="ghost" size="sm" onClick={() => handleVote(stream.id, "downvote")}>
                        <ChevronDown />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}