"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  BellOff,
  Copy,
  Gift,
  Mail,
  Map,
  Search,
  Settings,
} from "lucide-react";
import { cn } from "cn";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { copyInviteLink } from "@/lib/clipboard";

const MENU_CLASS =
  "w-64";

const RAIL_BUTTON =
  "relative grid size-9 place-items-center rounded-xl text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function IconRail({
  displayName = "Youmes",
  inviteCode,
  onSearch,
  onToggleSidebar,
}) {
  const [hasUnread, setHasUnread] = useState(true);
  const [muted, setMuted] = useState(false);

  return (
    <nav
      aria-label="Workspace shortcuts"
      className="flex h-full w-14 shrink-0 flex-col items-center border-r border-border bg-background py-3"
    >
      <Link
        href="/dashbord"
        aria-label="Huddle dashboard"
        title="Huddle dashboard"
        className="rounded-[11px] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Image
          src="/logo/Icon_bg_logo_svg.svg"
          alt=""
          width={36}
          height={36}
          priority
          className="size-9 rounded-[11px]"
        />
      </Link>

      <button
        type="button"
        onClick={onSearch}
        aria-label="Search people (Ctrl+F)"
        title="Search people (Ctrl+F)"
        className={cn(RAIL_BUTTON, "mt-5", "mb-2")}
      >
        <Search className="size-[18px]" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-muted px-1 text-[7px] font-semibold uppercase leading-[11px] tracking-wide text-muted-foreground">
          Ctrl
        </span>
      </button>

      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Office map and people"
        title="Office map and people"
        aria-current="page"
        className={cn(RAIL_BUTTON, "mt-2 bg-foreground/10 text-foreground")}
      >
        <Map className="size-[18px]" aria-hidden="true" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Notifications"
          title="Notifications"
          render={<button type="button" className={cn(RAIL_BUTTON, "mt-1")} />}
        >
          <Bell className="size-[18px]" aria-hidden="true" />
          {hasUnread && !muted ? (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#c4a7f5] ring-2 ring-background" />
          ) : null}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={10}
          className={MENU_CLASS}
        >
          <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Notifications
          </div>
          <div className="rounded-xl bg-muted px-2.5 py-2">
            <p className="flex items-center gap-2 text-[11.5px] font-medium text-foreground">
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
              Amanda is in the office
            </p>
            <p className="mt-0.5 pl-3.5 text-[10px] text-muted-foreground">
              Say hi on the map · just now
            </p>
          </div>
          <DropdownMenuSeparator className="bg-white/5" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setHasUnread(false);
                toast.success("All caught up");
              }}
              className="rounded-lg focus:bg-muted focus:text-foreground"
            >
              <Bell className="size-3.5" aria-hidden="true" />
              Mark all as read
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setMuted((value) => !value);
                toast.info(
                  muted ? "Notifications unmuted" : "Notifications muted",
                );
              }}
              className="rounded-lg focus:bg-muted focus:text-foreground"
            >
              {muted ? (
                <Bell className="size-3.5" aria-hidden="true" />
              ) : (
                <BellOff className="size-3.5" aria-hidden="true" />
              )}
              {muted ? "Unmute notifications" : "Mute notifications"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="mt-auto flex flex-col items-center gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Share this space"
            title="Share this space"
            render={<button type="button" className={RAIL_BUTTON} />}
          >
            <Gift className="size-[18px]" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-sky-400 ring-2 ring-background" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={10}
            className={MENU_CLASS}
          >
            <DropdownMenuGroup>
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Share the space
              </div>
              <DropdownMenuItem
                onClick={() => copyInviteLink(inviteCode)}
                disabled={!inviteCode}
                className="rounded-lg focus:bg-muted focus:text-foreground"
              >
                <Copy className="size-3.5" aria-hidden="true" />
                Copy invite link
              </DropdownMenuItem>
              {!inviteCode ? (
                <p className="px-2 pb-1.5 text-[10px] leading-snug text-muted-foreground">
                  Only workspace admins can share the key.
                </p>
              ) : null}
              <DropdownMenuItem
                disabled
                className="rounded-lg focus:bg-muted focus:text-foreground"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                Invite by email
                <span className="ml-auto text-[9px] uppercase tracking-wide text-muted-foreground">
                  Soon
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="/me"
          aria-label="Profile and settings"
          title="Profile and settings"
          className={RAIL_BUTTON}
        >
          <Settings className="size-[18px]" aria-hidden="true" />
        </Link>

        <Link
          href="/me"
          aria-label={`${displayName} — open your profile`}
          title={`${displayName} — profile`}
          className="relative mt-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>
        </Link>
      </div>
    </nav>
  );
}
