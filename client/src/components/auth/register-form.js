"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import PasswordField from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { registerSchema } from "@/lib/validations/auth";

const inputClassName = "h-11 rounded-xl border-border bg-muted/50 px-3.5";

export default function RegisterForm() {
  const [status, setStatus] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit() {
    setStatus("");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus(
      "Demo mode — your details were validated on the client, but account creation is not connected to a backend yet."
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Welcome <span aria-hidden="true">👋</span>
        </h1>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">
          Today is a new day. It&apos;s your day. You shape it. Create an account
          to start meeting with your team.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
        <FieldGroup className="gap-5">
          <Field data-invalid={Boolean(errors.username)}>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="yourname"
              spellCheck={false}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? "username-error" : undefined}
              className={inputClassName}
              {...register("username")}
            />
            <FieldError id="username-error">
              {errors.username?.message}
            </FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              spellCheck={false}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClassName}
              {...register("email")}
            />
            <FieldError id="email-error">{errors.email?.message}</FieldError>
          </Field>

          <PasswordField
            id="password"
            label="Password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.password}
            registration={register("password")}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            error={errors.confirmPassword}
            registration={register("confirmPassword")}
          />

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="h-11 w-full rounded-xl bg-primary-strong hover:bg-primary-strong/90"
          >
            {isSubmitting ? (
              <>
                <Spinner data-icon="inline-start" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </FieldGroup>

        {status ? (
          <p
            role="status"
            aria-live="polite"
            className="mt-4 text-sm leading-5 text-brand"
          >
            {status}
          </p>
        ) : null}
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
