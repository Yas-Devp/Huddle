"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { LuActivity } from "react-icons/lu";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const navLinkClass =
  "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="w-full px-4 pt-6 sm:px-6">
      <nav
        aria-label="Main navigation"
        className="mx-auto grid h-16 w-full max-w-[1260px] grid-cols-[1fr_auto] items-center gap-4 rounded-full border border-border bg-card py-2 pl-5 pr-3 text-card-foreground shadow-sm sm:pl-6 md:grid-cols-[1fr_auto_1fr]"
      >
        <Link
          href="/"
          aria-label="Huddle home"
          className="shrink-0 justify-self-start rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Image
            src="/logo/Comleted_logo_dr.png"
            alt=""
            width={109}
            height={37}
            loading="eager"
            className="h-8 w-auto dark:hidden"
          />
          <Image
            src="/logo/Comleted_logo.png"
            alt=""
            width={109}
            height={37}
            loading="eager"
            className="hidden h-8 w-auto dark:block"
          />
        </Link>

        <ul className="hidden items-center gap-1 md:flex md:justify-self-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 justify-self-end">
          <ModeToggle />

          <div className="hidden items-center gap-2 md:flex">
            <Button
              render={<Link href="/register" />}
              nativeButton={false}
              variant="secondary"
              size="lg"
              className="rounded-full px-5"
            >
              Register
            </Button>
            <Button
              render={<Link href="/login" />}
              nativeButton={false}
              size="lg"
              className="rounded-full px-5"
            >
              Login
            </Button>
          </div>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="rounded-full md:hidden"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate to a page or access your account.
                </SheetDescription>
              </SheetHeader>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-2 px-4"
              >
                <Separator className={`h-[1px]`} />
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsSheetOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <SheetFooter>
                <Button
                  render={
                    <Link
                      href="/register"
                      onClick={() => setIsSheetOpen(false)}
                    />
                  }
                  nativeButton={false}
                  variant="secondary"
                  size="lg"
                  className="w-full rounded-full"
                >
                  Register
                </Button>
                <Button
                  render={
                    <Link href="/login" onClick={() => setIsSheetOpen(false)} />
                  }
                  nativeButton={false}
                  size="lg"
                  className="w-full rounded-full"
                >
                  Login
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
