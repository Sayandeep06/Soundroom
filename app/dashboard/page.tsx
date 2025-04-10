"use client"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import DashboardHeader from "../components/DashboardHeader"
import { ChevronDown, ChevronUp, SkipBack, SkipForward, Share2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"
import YouTube from "react-youtube"

export default function Dashboard() {
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

  const { data: session } = useSession()
  const { toast } = useToast()
  const [streams, setStreams] = useState<Stream[]>([])
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const fetchStreams = async () => {
    try {
      const res = await axios.get("/api/streams/my")
      //@ts-ignore
      const sorted = res.data.streams.sort((a: Stream, b: Stream) => b.upvotes - a.upvotes)
      setStreams(sorted)
  
      if (sorted.length === 1) {
        setCurrentIndex(0)
      }
  
      if (sorted.length > 1 && currentIndex >= sorted.length) {
        setCurrentIndex(0)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const savedIndex = localStorage.getItem("currentStreamIndex")
    if (savedIndex) setCurrentIndex(Number(savedIndex))

    fetchStreams()
    const interval = setInterval(fetchStreams, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    localStorage.setItem("currentStreamIndex", String(currentIndex))
  }, [currentIndex])

  const handleAddStream = async () => {
    if (!url || !session?.user?.email) return
    setLoading(true)
    try {
      await axios.post("/api/streams", {
        //@ts-ignore
        creatorId: session?.user?.id || session?.user?.email,
        url,
      })
      setUrl("")
      fetchStreams()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (streamId: string) => {
    try {
      await axios.delete(`/api/streams?streamId=${streamId}`)
      fetchStreams()
      toast({
        title: "Stream deleted successfully",
        duration: 2000,
      })
    } catch (err) {
      toast({
        title: "Error deleting stream",
        variant: "destructive",
        duration: 2000,
      })
      console.error(err)
    }
  }

  const handleVote = async (id: string, type: string) => {
    try {
      await axios.post(`/api/streams/${type}`, { streamId: id })
      fetchStreams()
    } catch (err) {
      console.error(err)
    }
  }

  const handleShare = () => {
    const creatorId = streams[currentIndex]?.userId
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

  useEffect(() => {
    const interval = setInterval(() => {
      const iframe = iframeRef.current
      if (!iframe) return

      const player = iframe.contentWindow
      if (!player) return

      player.postMessage('{"event":"listening","id":1}', "*")
    }, 1000)

    window.addEventListener("message", handleYouTubeEvent)
    return () => {
      clearInterval(interval)
      window.removeEventListener("message", handleYouTubeEvent)
    }
  }, [currentIndex, streams])

  const handleYouTubeEvent = (event: MessageEvent) => {
    if (event.origin !== "https://www.youtube.com") return
    const data = JSON.parse(event.data)
    if (data?.info === 0) {
      handleNext()
    }
  }

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
                <Button onClick={handleNext} disabled={streams.length <= 1}>
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
          <div className="flex gap-2 text-white">
            <Input
              placeholder="Enter video URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button
              onClick={handleAddStream}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
              disabled={loading}
            >
              Add
            </Button>
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
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(stream.id)}>
                        <Trash2 className="text-red-500" size={16} />
                    </Button>
                    <div className="flex flex-col gap-1 items-center">
                      <Button variant="ghost" size="sm" onClick={() => handleVote(stream.id, "upvote")}>
                        <ChevronUp /> {stream.upvotes}
                      </Button>
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