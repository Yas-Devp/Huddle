import Link from "next/link";
import { ArrowRight, Hand, Sparkle } from "lucide-react";
import { LuActivity } from "react-icons/lu";
import { IoMdFingerPrint } from "react-icons/io";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 pb-28 pt-10 sm:px-6 sm:pb-32 sm:pt-16">
      <div
        aria-hidden
        className="brand-glow pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-3xl sm:h-[48rem] sm:w-[64rem]"
      />

      <div className="relative flex w-full max-w-5xl flex-col items-center text-center">
        {/* <span
          aria-hidden
          className="absolute left-0 top-0 size-5 text-brand sm:left-1/2 sm:-ml-[19vw] sm:size-7 sm:-translate-x-1/2"
        >
          <Sparkle className="absolute inset-0 size-full fill-current blur-[6px]" />
          <Sparkle className="relative size-full fill-current" />
        </span> */}

        {/* <span
          aria-hidden
          className="absolute bottom-1 right-0 size-7 text-brand sm:left-1/2 sm:right-auto sm:ml-[21vw] sm:size-9 sm:-translate-x-1/2"
        >
          <Sparkle className="absolute inset-0 size-full fill-current blur-[8px]" />
          <Sparkle className="relative size-full fill-current" />
        </span> */}

        <Badge className="h-7 rounded-full px-4 text-xs font-medium">
          <LuActivity className="mr-1 size-3" />
          Beta version
        </Badge>

        <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]">
          <span className="block">Now you can enjoy a</span>
          <span className="block">Meeting like a reel</span>
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-base md:text-lg">
          Meet, chat, and collaborate in real time. Huddle brings your team
          together in one calm, focused space, wherever you are.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10">
          <Button
            render={<Link href="/register" />}
            nativeButton={false}
            variant="secondary"
            size="lg"
            className="h-12 rounded-full px-6 text-base text-brand sm:px-7"
          >
            Start Now
            <ArrowRight />
          </Button>

          <Button
            render={<Link href="/register" aria-label="Join a Huddle" />}
            nativeButton={false}
            size="icon-lg"
            className="size-12 rounded-xl [&_svg:not([class*='size-'])]:size-5"
          >
            <IoMdFingerPrint />
          </Button>
        </div>
      </div>
    </main>
  );
}
