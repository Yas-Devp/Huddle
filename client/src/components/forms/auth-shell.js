import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

import AuthVisual from "@/components/forms/auth-visual";

export default function AuthShell({ children }) {
  return (
    <main className=" min-h-svh bg-background">
      <div className="mx-auto grid min-h-svh w-full max-w-[1680px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <section className="flex min-h-svh flex-col px-6 py-7 sm:px-10 sm:py-9 lg:px-14 xl:px-20 2xl:px-28">
          <header className="mb-8 flex items-center justify-between w-full max-w-[26rem]  md:mx-auto lg:mx-0">
            <Link
              href="/"
              aria-label="Huddle home"
              className="inline-flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
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
            <ModeToggle />
          </header>

          <div className="flex flex-1 items-start py-8 lg:items-center lg:py-10">
            <div className="w-full max-w-[26rem] md:mx-auto lg:mx-0">
              {children}
            </div>
          </div>

          <footer className="text-xs text-muted-foreground">
            © 2026 Huddle. Built for better meetings.
          </footer>
        </section>

        <aside className="relative hidden p-3 pl-0 lg:block" aria-hidden="true">
          <div className="relative h-full min-h-[calc(100svh-1.5rem)] overflow-hidden rounded-[2rem] bg-card ring-1 ring-foreground/10">
            <AuthVisual />
          </div>
        </aside>
      </div>
    </main>
  );
}
