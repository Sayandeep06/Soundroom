"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Music } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-80"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="font-bold text-xl text-white">Soundroom</span>
        </Link>

        <div className="flex items-center gap-4">
          {!session ? (
            <>
              <Button
                variant="ghost"
                className="text-sm hidden md:inline-flex text-white"
                onClick={() => signIn()}
              >
                Log in
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => signIn()}
              >
                Get Started
              </Button>
            </>
          ) : (
            <>
              <span className="hidden md:inline text-sm text-white/80">
                Hello, {session.user?.name || session.user?.email}
              </span>
              <Button
                variant="secondary"
                className="text-sm"
                onClick={() => signOut()}
              >
                Log out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}