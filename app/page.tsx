"use client"
import Header from "./components/Header"

import Link from "next/link"
import { Music, ChevronRight, } from "lucide-react"
import { Button } from "@/components/ui/button"
import Redirect from "./components/Redirect"
import { signIn } from "next-auth/react"
import { Linkedin, Twitter, Mail } from "lucide-react"
export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <Redirect/>
      <Header />
      <HeroSection />
      <PricingSection />
      <Footer />
    </div>
  )
}


function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400">
            Let Your Friends Drive the Music on Your Parties
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-2xl mx-auto">
            Soundroom connects friends with their music queue. Create your stream and vote with friends
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => signIn()} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 px-8">
              Start Sharing Now
            </Button>
          </div>

          <div className="relative mx-auto max-w-5xl mt-12">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-xl blur-md animate-pulse"></div>
            <div className="relative bg-zinc-900/80 backdrop-blur border border-white/10 rounded-xl overflow-hidden shadow-2xl p-8">
              <div className="grid grid-cols-3 gap-4 relative">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden relative group"
                    style={{
                      animationDelay: `${i * 200}ms`,
                      animation: "pulse 3s infinite alternate",
                    }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        i % 3 === 0
                          ? "from-purple-500 to-indigo-600"
                          : i % 3 === 1
                            ? "from-pink-500 to-rose-600"
                            : "from-blue-500 to-cyan-600"
                      } opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Music
                        className={`w-8 h-8 text-white opacity-80 group-hover:scale-125 transition-transform duration-300 ${
                          i % 5 === 0
                            ? "rotate-0"
                            : i % 5 === 1
                              ? "rotate-45"
                              : i % 5 === 2
                                ? "rotate-90"
                                : i % 5 === 3
                                  ? "rotate-180"
                                  : "rotate-270"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-24 w-full mt-8 rounded-lg bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-blue-900/50 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-purple-500/20 to-transparent animate-music-bar"
                  style={{ animationDuration: "2.5s" }}
                ></div>
                <div
                  className="absolute inset-y-0 left-10 w-1/4 bg-gradient-to-r from-pink-500/20 to-transparent animate-music-bar"
                  style={{ animationDuration: "1.7s" }}
                ></div>
                <div
                  className="absolute inset-y-0 left-32 w-1/5 bg-gradient-to-r from-blue-500/20 to-transparent animate-music-bar"
                  style={{ animationDuration: "2.1s" }}
                ></div>
                <div
                  className="absolute inset-y-0 left-48 w-1/6 bg-gradient-to-r from-purple-500/20 to-transparent animate-music-bar"
                  style={{ animationDuration: "1.4s" }}
                ></div>
                <div
                  className="absolute inset-y-0 left-64 w-1/3 bg-gradient-to-r from-pink-500/20 to-transparent animate-music-bar"
                  style={{ animationDuration: "1.9s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}








function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "Forever",
      description: "Start jamming with friends instantly",
      features: [
        "Create & share 1 music room",
        "Real-time voting on songs",
        "Auto-ordered music queue",
        "Up to 5 listeners",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Plus",
      price: "$5",
      period: "per month",
      description: "For friend groups and regular listeners",
      features: [
        "Up to 3 active rooms",
        "Room customization options",
        "Unlimited voting & queue updates",
        "Up to 25 listeners",
        "Priority room performance",
      ],
      cta: "Upgrade to Plus",
      popular: true,
    },
    {
      name: "Studio",
      price: "$19",
      period: "per month",
      description: "For creators and stream hosts",
      features: [
        "Unlimited rooms",
        "Advanced queue controls",
        "Listener analytics",
        "Live chat & mod tools",
        "Up to 100+ listeners",
        "Priority support",
      ],
      cta: "Go Studio",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 relative">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Choose the plan that fits how you share music with friends</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-zinc-900/50 backdrop-blur border rounded-xl overflow-hidden transition-all duration-300 ${
                plan.popular
                  ? "border-purple-500 scale-105 md:scale-110 shadow-lg shadow-purple-500/20"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center text-sm py-1 font-medium">
                  Most Popular
                </div>
              )}

              <div className="p-8 pt-12">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-zinc-400 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-zinc-400"> {plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-3 mt-1 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => signIn()}
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}




function Footer() {
  return (
    <footer id="footer" className="bg-zinc-950 border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-bold text-xl">Soundroom</span>
            </Link>
            <p className="text-zinc-400 mb-4 max-w-xs">
              Connecting creators and fans through the power of music. Elevate your streams with fan-driven music
              experiences.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link
                href="https://www.linkedin.com/in/sayandeep-dey-2a0aba227/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://x.com/gitpushsayan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:deysayandeepdev@gmail.com"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Integrations", "FAQ", "Changelog"].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Blog", "Careers", "Press", "Partners"].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              {["Documentation", "Tutorials", "Support", "API", "Community"].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Soundroom. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-zinc-500 text-sm hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-zinc-500 text-sm hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-zinc-500 text-sm hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

