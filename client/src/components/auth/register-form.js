"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/context/auth";

import PasswordField from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { registerSchema } from "@/lib/validations/auth";

const inputClassName = "h-11 rounded-xl border-border bg-muted/50 px-3.5";

export default function RegisterForm() {
  const { signup } = useAuth();
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

  const onSubmit = async (value) => {
    setStatus("");
    try {
      const data = await signup({
        nom: value.nom,
        prenom: value.prenom,
        telephone: value.phone,
        email: value.email,
        password: value.password,
      });
      console.log("Signup successful:", data);
      setStatus("Signup successful!");
    } catch (error) {
      console.error("Signup failed:", error);
      setStatus("Signup failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Welcome <span aria-hidden="true">👋</span>
        </h1>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">
          Today is a new day. It&apos;s your day. You shape it. Create an
          account to start meeting with your team.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
        <FieldGroup className="gap-5">
          <FieldGroup className="flex flex-row gap-5">
            <Field data-invalid={Boolean(errors.nom)}>
              <FieldLabel htmlFor="nom">Nom</FieldLabel>
              <Input
                id="nom"
                type="text"
                autoComplete="nom"
                placeholder="yourname"
                spellCheck={false}
                aria-invalid={Boolean(errors.nom)}
                aria-describedby={errors.nom ? "nom-error" : undefined}
                className={inputClassName}
                {...register("nom")}
              />
              <FieldError id="nom-error">{errors.nom?.message}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors.prenom)}>
              <FieldLabel htmlFor="prenom">Prénom</FieldLabel>
              <Input
                id="prenom"
                type="text"
                autoComplete="prenom"
                placeholder="yourprenom"
                spellCheck={false}
                aria-invalid={Boolean(errors.prenom)}
                aria-describedby={errors.prenom ? "prenom-error" : undefined}
                className={inputClassName}
                {...register("prenom")}
              />
              <FieldError id="prenom-error">
                {errors.prenom?.message}
              </FieldError>
            </Field>
          </FieldGroup>

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

          <Field data-invalid={Boolean(errors.phone)}>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="0770649499"
              spellCheck={false}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={inputClassName}
              {...register("phone")}
            />
            <FieldError id="phone-error">{errors.phone?.message}</FieldError>
          </Field>

          <FieldGroup className="flex flex-row gap-5">
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
          </FieldGroup>

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
