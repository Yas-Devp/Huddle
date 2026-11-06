"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import PasswordField from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema } from "@/lib/validations/auth";

const inputClassName = "h-11 rounded-xl border-border bg-muted/50 px-3.5";
export default function LoginForm() {
  const [status, setStatus] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit() {
    setStatus("");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus(
      "Demo mode — your details were validated on the client, but sign-in is not connected to a backend yet.",
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Welcome Back <span aria-hidden="true">👋</span>
        </h1>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">
          Today is a new day. It&apos;s your day. You shape it. Sign in to start
          managing your projects.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
        <FieldGroup className="gap-5">
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
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            registration={register("password")}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Field orientation="horizontal" className="w-auto">
              <Controller
                control={control}
                name="remember"
                render={({ field }) => (
                  <Checkbox
                    id="remember"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
              <FieldLabel
                htmlFor="remember"
                className="font-normal text-muted-foreground"
              >
                Remember me
              </FieldLabel>
            </Field>

            <button
              type="button"
              onClick={() =>
                setStatus(
                  "Password reset is not available in this demo yet. Use your account password to sign in.",
                )
              }
              className="rounded-sm text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Forgot password?
            </button>
          </div>

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
                Signing in…
              </>
            ) : (
              "Sign in"
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
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
