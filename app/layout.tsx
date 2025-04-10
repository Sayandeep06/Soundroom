import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/providers"
import { Toaster } from "@/components/ui/toaster"
export const metadata: Metadata = {
  title: "Soundroom",
  description: "Your new music stream"
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <div className="fixed inset-0 -z-10 bg-black">
          <div className="absolute top-0 left-0 w-screen h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
          <div className="absolute top-0 right-0 w-screen h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-900/20 via-black to-black"></div>
          <div className="absolute bottom-0 left-0 w-screen h-screen bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
        </div>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
