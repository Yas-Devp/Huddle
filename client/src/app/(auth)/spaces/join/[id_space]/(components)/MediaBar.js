"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronUp,
  Headphones,
  Mic,
  MicOff,
  Smile,
  VolumeX,
} from "lucide-react";
import { cn } from "cn";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const MENU_CLASS =
  "w-64";

const CONTROL_BUTTON =
  "grid size-9 place-items-center rounded-full text-primary outline-none transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card";

const CHEVRON_BUTTON =
  "grid h-9 w-5 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card";

const REACTIONS = ["👋", "🎉", "❤️", "😂", "👍"];

export default function MediaBar({ displayName = "Youmes" }) {
  const [micOn, setMicOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [micDevice, setMicDevice] = useState("default");
  const [speakerDevice, setSpeakerDevice] = useState("speakers");
  const [floating, setFloating] = useState([]);
  const timers = useRef(new Set());
  const reactionCount = useRef(0);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => clearTimeout(timer));
      pending.clear();
    };
  }, []);

  const react = (emoji) => {
    reactionCount.current += 1;
    const id = reactionCount.current;
    const offset = ((id % 5) - 2) * 16;

    setFloating((current) => [...current, { id, emoji, offset }]);

    const timer = setTimeout(() => {
      setFloating((current) => current.filter((item) => item.id !== id));
      timers.current.delete(timer);
    }, 1900);

    timers.current.add(timer);
  };

  return (
    <div className="absolute bottom-2 left-1/2 z-30 -translate-x-1/2 sm:bottom-5">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-full h-24"
        aria-hidden="true"
      >
        {floating.map((item) => (
          <span
            key={item.id}
            className="absolute bottom-0 left-1/2 animate-bounce text-2xl drop-shadow-[0_6px_10px_rgba(0,0,0,.45)]"
            style={{ marginLeft: `${item.offset}px` }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1 rounded-full border border-border bg-card/95 p-1.5 shadow-[0_16px_44px_rgba(0,0,0,.25)] backdrop-blur-md">
        <div className="relative mr-1 ml-0.5">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>
        </div>

        <div className="flex items-center rounded-full bg-foreground/[0.04] p-0.5 ring-1 ring-foreground/5">
          <button
            type="button"
            onClick={() => setMicOn((value) => !value)}
            aria-pressed={micOn}
            aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
            title={micOn ? "Mute microphone" : "Unmute microphone"}
            className={cn(CONTROL_BUTTON, !micOn && "text-rose-400")}
          >
            {micOn ? (
              <Mic className="size-4" aria-hidden="true" />
            ) : (
              <MicOff className="size-4" aria-hidden="true" />
            )}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Microphone options"
              title="Microphone options"
              render={<button type="button" className={CHEVRON_BUTTON} />}
            >
              <ChevronUp className="size-3" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="center"
              sideOffset={12}
              className={MENU_CLASS}
            >
              <DropdownMenuRadioGroup
                value={micDevice}
                onValueChange={setMicDevice}
              >
                <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Microphone
                </DropdownMenuLabel>
                <DropdownMenuRadioItem
                  value="default"
                  className="rounded-lg focus:bg-muted focus:text-foreground"
                >
                  Default microphone
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="headset"
                  className="rounded-lg focus:bg-muted focus:text-foreground"
                >
                  Studio headset
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem
                onClick={() => setMicOn((value) => !value)}
                className="rounded-lg focus:bg-muted focus:text-foreground"
              >
                {micOn ? (
                  <MicOff className="size-3.5" aria-hidden="true" />
                ) : (
                  <Mic className="size-3.5" aria-hidden="true" />
                )}
                {micOn ? "Mute microphone" : "Unmute microphone"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center rounded-full bg-foreground/[0.04] p-0.5 ring-1 ring-foreground/5">
          <button
            type="button"
            onClick={() => setSoundOn((value) => !value)}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute sound" : "Unmute sound"}
            title={soundOn ? "Mute sound" : "Unmute sound"}
            className={cn(CONTROL_BUTTON, !soundOn && "text-rose-400")}
          >
            {soundOn ? (
              <Headphones className="size-4" aria-hidden="true" />
            ) : (
              <VolumeX className="size-4" aria-hidden="true" />
            )}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Speaker options"
              title="Speaker options"
              render={<button type="button" className={CHEVRON_BUTTON} />}
            >
              <ChevronUp className="size-3" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="center"
              sideOffset={12}
              className={MENU_CLASS}
            >
              <DropdownMenuRadioGroup
                value={speakerDevice}
                onValueChange={setSpeakerDevice}
              >
                <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Speakers
                </DropdownMenuLabel>
                <DropdownMenuRadioItem
                  value="speakers"
                  className="rounded-lg focus:bg-muted focus:text-foreground"
                >
                  MacBook speakers
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="headphones"
                  className="rounded-lg focus:bg-muted focus:text-foreground"
                >
                  Studio headphones
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem
                onClick={() => setSoundOn((value) => !value)}
                className="rounded-lg focus:bg-muted focus:text-foreground"
              >
                {soundOn ? (
                  <VolumeX className="size-3.5" aria-hidden="true" />
                ) : (
                  <Headphones className="size-3.5" aria-hidden="true" />
                )}
                {soundOn ? "Mute sound" : "Unmute sound"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Send a reaction"
            title="Send a reaction"
            render={<button type="button" className={CONTROL_BUTTON} />}
          >
            <Smile className="size-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="center"
            sideOffset={12}
            className="w-auto"
          >
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              React
            </div>
            <DropdownMenuGroup className="grid grid-cols-5 gap-1">
              {REACTIONS.map((emoji) => (
                <DropdownMenuItem
                  key={emoji}
                  onClick={() => react(emoji)}
                  aria-label={`React with ${emoji}`}
                  className="justify-center rounded-lg p-1.5 text-lg leading-none focus:bg-muted"
                >
                  {emoji}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
