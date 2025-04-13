"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import music from "@/public/music.png"
export default function Header() {
const { data: session } = useSession();
console.log(session)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image src={music} alt="header logo" width={35} height={35}/>
          <span className="font-bold text-xl">Soundroom</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm hover:text-purple-400 transition cursor-pointer">Home</Link>
          <Link href="#pricing" className="text-sm hover:text-purple-400 transition cursor-pointer">Pricing</Link>
          <Link href="#footer" className="text-sm hover:text-purple-400 transition cursor-pointer">Contact Us</Link>
        </nav>

        <div className="flex items-center gap-4">
          {!session ? (
            <>
              <Button
                variant="ghost"
                className="text-sm hidden md:inline-flex cursor-pointer"
                onClick={() => signIn()}
              >
                Log in
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer"
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
                variant="ghost"
                className="text-sm cursor-pointer"
                onClick={() => signOut()}
              >
                Log out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
