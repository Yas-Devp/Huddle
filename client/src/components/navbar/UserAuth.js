"use client";

import Link from "next/link";
import { useAuth } from "@/components/context/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(user) {
  const initials = [user?.prenom, user?.nom]
    .filter(Boolean)
    .map((part) => part.trim().charAt(0))
    .join("")
    .toUpperCase();

  return initials || "HU";
}

export default function UserAuth({ showStatus = true }) {
  const { user, logout } = useAuth();

  const fullName =
    [user?.prenom?.charAt(0).toUpperCase() + user?.prenom?.slice(1), user?.nom]
      .filter(Boolean)
      .join(" ") || "My account";
  const initials = getInitials(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Open account menu for ${fullName}`}
        render={
          <button
            type="button"
            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        }
      >
        <Avatar size="lg" className="cursor-pointer">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt={user ? fullName : "Huddle user"}
          />
          <AvatarFallback>{initials}</AvatarFallback>
          {showStatus ? (
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          ) : null}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="truncate text-sm font-medium text-foreground">
              {fullName}
            </span>
            {user?.email ? (
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            ) : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/me" />}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/dashbord" />}>
            Dashboard
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={logout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
