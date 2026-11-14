"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/auth";

import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  ArrowLeft,
  ArrowUpRight,
  Mail,
  Phone,
  UserRound,
  ShieldCheck,
  Settings2,
  CircleCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function PageMe() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("You are not login in");
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 p-8">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const initials =
    `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 ">
        {/* Top navigation */}
        <div className="mb-12 flex items-center justify-between">
          <button
            onClick={() => router.replace("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <Badge variant="outline" className="gap-2 rounded-full px-3 py-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Account active
          </Badge>
        </div>

        {/* Page title */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Personal workspace
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Your profile<span className="text-primary">.</span>
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Your personal information and account details, all in one place.
          </p>
        </div>

        {/* Main profile */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Left profile panel */}
          <aside>
            <Card className="rounded-2xl border-border/70 shadow-none">
              <CardContent className="flex flex-col items-center px-6 py-9 text-center">
                <div className="relative mb-5">
                  <Avatar className="h-28 w-28 rounded-full border-4 border-muted">
                    <AvatarFallback className="bg-primary text-3xl font-semibold text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-background bg-emerald-500" />
                </div>

                <h2 className="text-xl font-semibold">
                  {user.prenom} {user.nom}
                </h2>

                <p className="mt-1 max-w-full break-all text-sm text-muted-foreground">
                  {user.email}
                </p>

                <Separator className="my-7" />

                <div className="w-full space-y-4 text-left">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <CircleCheck className="h-4 w-4 text-emerald-500" />
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Account</span>
                    <span className="font-medium">Personal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-border/70 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">Secure account</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your account is currently authenticated.
                </p>
              </div>
            </div>
          </aside>

          {/* Right content */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Personal information</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your registered account information.
                </p>
              </div>

              <Settings2 className="h-5 w-5 text-muted-foreground" />
            </div>

            <Card className="overflow-hidden rounded-2xl border-border/70 shadow-none">
              <CardContent className="p-0">
                {/* First name */}
                <div className="flex items-center gap-4 px-5 py-4 sm:px-7">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <UserRound className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      FIRST NAME
                    </p>
                    <p className="mt-1 font-medium">
                      {user.prenom || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Last name */}
                <div className="flex items-center gap-4 px-5 py-4 sm:px-7">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <UserRound className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      LAST NAME
                    </p>
                    <p className="mt-1 font-medium">
                      {user.nom || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 px-5 py-4 sm:px-7">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      EMAIL ADDRESS
                    </p>
                    <p className="mt-1 break-all font-medium">
                      {user.email || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4 px-5 py-4 sm:px-7">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      PHONE NUMBER
                    </p>
                    <p className="mt-1 font-medium">
                      {user.telephone || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom information */}
            <div className="flex flex-col justify-between gap-3 rounded-2xl bg-muted/40 p-5 sm:flex-row sm:items-center sm:px-7">
              <div>
                <p className="text-sm font-medium">
                  Need to update your details?
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Contact your administrator for account changes.
                </p>
              </div>

              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                Account overview
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-border/60 pt-6">
          <p className="text-xs text-muted-foreground">
            Personal account · Profile overview
          </p>
        </footer>
      </div>
    </main>
  );
}
