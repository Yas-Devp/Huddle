"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Connect_Dash } from "@/components/router/connect_dash";
import { ModeToggle } from "@/components/mode-toggle";

// Format check only, for immediate feedback. The API re-validates the key and
// is the only thing that decides whether it is valid.
const invitationSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Workspace key is required.")
    .max(64, "Workspace key is too long.")
    .regex(/^[A-Za-z0-9-]+$/, "Use letters, numbers, and dashes only."),
});

function JoinSpaceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextSpaceId = searchParams.get("next");
  const isReturning = Boolean(nextSpaceId && /^\d+$/.test(nextSpaceId));

  const form = useForm({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      code: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const prefill = searchParams.get("code");
    if (prefill) {
      form.setValue("code", prefill, { shouldValidate: true });
    }
  }, [form, searchParams]);

  const handleJoin = async (values) => {
    try {
      const { data } = await Connect_Dash.postJoinWorkspace(values.code);

      toast.success(
        data?.alreadyMember
          ? "You are already a member of this space."
          : "Key accepted. Welcome in!",
      );

      const targetId = isReturning ? nextSpaceId : data?.workspace?.id;
      router.push(targetId ? `/spaces/join/${targetId}` : "/dashbord");
    } catch (error) {
      const status = error?.response?.status;

      if (status === 401) {
        toast.error("Please sign in to use a workspace key.");
        router.push("/login");
        return;
      }

      if (status === 429) {
        toast.error("Too many attempts. Please wait a few minutes.");
        return;
      }

      toast.error(
        error?.response?.data?.message ??
          "Could not open this workspace. Check the key and try again.",
      );
    }
  };

  return (
    <section className="w-full max-w-[464px] sm:translate-x-[14px] sm:translate-y-[10px]">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">
          Join a Workspace
        </h1>

        <p className="mt-2 text-base leading-6 text-muted-foreground">
          Every space is locked. Enter the workspace key shared with you to get
          in.
        </p>

        {isReturning ? (
          <p
            role="status"
            className="mt-4 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2.5 text-sm leading-5 text-foreground"
          >
            You tried to open a space that needs its key. Enter it below and
            we&apos;ll take you straight there.
          </p>
        ) : null}
      </div>

      <form onSubmit={form.handleSubmit(handleJoin)} className="space-y-6">
        <Controller
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="invitation-code">Workspace key</FieldLabel>

              <Input
                {...field}
                id="invitation-code"
                placeholder="e.g. K7QM-3XPD-9R"
                autoComplete="off"
                spellCheck={false}
                disabled={isLoading}
                aria-invalid={fieldState.invalid}
                className="h-[52px] rounded-xl border-border bg-card px-4 font-mono text-base uppercase tracking-wider text-foreground placeholder:text-muted-foreground"
              />

              <FieldDescription>
                Ten characters. Lowercase and dashes are fine.
              </FieldDescription>

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="h-[52px] w-full rounded-2xl text-base font-semibold"
        >
          {isLoading ? "Checking the key..." : "Unlock workspace"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        No key? Ask a workspace admin to share it with you.
      </p>

      <div className="mt-8 text-center">
        <Link
          href="/dashbord"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}

export default function JoinSpacePage() {
  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      <div className="absolute right-5 top-5 z-20">
        <ModeToggle size="icon" />
      </div>

      {/* Header */}
      <header className="absolute inset-x-0 top-12 z-10 flex justify-center px-5 sm:top-[75px]">
        <Link
          href="/"
          aria-label="Huddle home"
          className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Image
            src="/logo/Comleted_logo_dr.png"
            alt="Huddle"
            width={109}
            height={37}
            priority
            className="h-[37px] w-auto dark:hidden"
          />
          <Image
            src="/logo/Comleted_logo.png"
            alt=""
            width={109}
            height={37}
            priority
            className="hidden h-[37px] w-auto dark:block"
          />
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-5 py-32 sm:px-6 sm:py-36">
        <Suspense
          fallback={
            <div className="flex w-full max-w-[464px] justify-center py-10">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          }
        >
          <JoinSpaceForm />
        </Suspense>
      </main>
    </div>
  );
}
