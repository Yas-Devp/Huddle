"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, Copy, Link2 } from "lucide-react";

import { CreateSchema } from "@/lib/validations/space";
import { formatInviteCode } from "@/lib/invite";
import { copyInviteLink, copyWorkspaceKey } from "@/lib/clipboard";
import { Connect_Dash } from "@/components/router/connect_dash";
import { ModeToggle } from "@/components/mode-toggle";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const inputClassName = "h-11 rounded-xl border-border bg-muted/50 px-3.5";

function CreatedSpaceSummary({ created }) {
  const { workspace, invitation } = created;
  const code = invitation?.code;

  return (
    <section className="w-full max-w-[464px]">
      <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 ring-1 ring-primary/30">
        <Check className="size-5 text-primary" aria-hidden="true" />
      </div>

      <h1 className="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
        Your space is ready
      </h1>

      <p className="mt-3 text-base leading-6 text-muted-foreground">
        <span className="font-semibold text-foreground">{workspace.nom}</span> is
        locked. Anyone you want inside needs the workspace key below.
      </p>

      {code ? (
        <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Workspace key
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <code className="select-all font-mono text-lg font-semibold tracking-[0.12em] text-foreground">
              {formatInviteCode(code)}
            </code>

            <button
              type="button"
              onClick={() => copyWorkspaceKey(code)}
              aria-label="Copy workspace key"
              title="Copy workspace key"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Copy className="size-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Keep it safe: it is the only way into this space. You can create or
            revoke keys later from the space sidebar.
          </p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="button"
          onClick={() => copyInviteLink(code)}
          className="h-12 w-full rounded-2xl text-base font-semibold"
        >
          <Link2 aria-hidden="true" />
          Copy invite link
        </Button>

        <Button
          render={<Link href={`/spaces/join/${workspace.id}`} />}
          nativeButton={false}
          variant="outline"
          className="h-12 w-full rounded-2xl text-base font-semibold"
        >
          Open the space
        </Button>

        <Link
          href="/dashbord"
          className="py-1 text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}

export default function CreateSpacePage() {
  const [created, setCreated] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(CreateSchema),
    mode: "onTouched",
    defaultValues: {
      nom: "",
      mapId: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await Connect_Dash.postWorkspace(data);
      toast.success("Space created. Share the key to let people in.");
      setCreated(response.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ?? "Something went wrong. Try again.",
      );
    }
  };

  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      <div className="absolute right-5 top-5 z-20">
        <ModeToggle size="icon" />
      </div>

      <header className="absolute inset-x-0 top-12 z-10 flex justify-center px-5 sm:top-[75px]">
        <Link
          href="/"
          aria-label="Huddle home"
          className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Image
            src="/logo/Comleted_logo_dr.png"
            alt=""
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

      <main className="flex flex-1 items-center justify-center px-5 py-32 sm:px-6 sm:py-36">
        {created ? (
          <CreatedSpaceSummary created={created} />
        ) : (
          <div className="w-full max-w-[424px]">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground sm:pt-[13px] sm:text-4xl sm:tracking-[-0.042em]">
              Create Your <span className="whitespace-nowrap">Space 👋</span>
            </h1>

            <p className="mt-6 text-base leading-6 tracking-[-0.011em] text-muted-foreground sm:mt-[23px] sm:text-lg">
              Create a virtual workspace where your team can collaborate,
              communicate, and connect. Huddle generates a key so only invited
              people can enter.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-7 sm:mt-8"
            >
              <FieldGroup className="gap-3">
                {/* Name */}
                <Field className="gap-[9px]">
                  <FieldLabel htmlFor="space-name">Name</FieldLabel>

                  <Input
                    id="space-name"
                    placeholder="Réunion1"
                    autoComplete="off"
                    aria-invalid={!!errors.nom}
                    {...register("nom")}
                    className={inputClassName}
                  />

                  {errors.nom && (
                    <p className="text-sm text-destructive" role="alert">
                      {errors.nom.message}
                    </p>
                  )}
                </Field>

                {/* Map ID */}
                <Field className="gap-[9px]">
                  <FieldLabel htmlFor="space-map">Map ID</FieldLabel>

                  <Input
                    id="space-map"
                    type="text"
                    placeholder="Enter map ID"
                    aria-invalid={!!errors.mapId}
                    {...register("mapId")}
                    className={inputClassName}
                  />

                  {errors.mapId && (
                    <p className="text-sm text-destructive" role="alert">
                      {errors.mapId.message}
                    </p>
                  )}
                </Field>

                {/* Description */}
                <Field className="gap-[9px]">
                  <FieldLabel htmlFor="space-description">
                    Description
                  </FieldLabel>

                  <Input
                    id="space-description"
                    placeholder="Group meeting"
                    autoComplete="off"
                    aria-invalid={!!errors.description}
                    {...register("description")}
                    className={inputClassName}
                  />

                  {errors.description && (
                    <p className="text-sm text-destructive" role="alert">
                      {errors.description.message}
                    </p>
                  )}
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-11 h-[52px] w-full rounded-2xl bg-primary text-[19px] font-medium text-primary-foreground hover:bg-primary-strong"
              >
                {isSubmitting ? "Creating..." : "Create Space"}
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
