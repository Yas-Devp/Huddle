"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function PasswordField({
  id,
  label,
  error,
  registration,
  autoComplete = "current-password",
  placeholder = "Enter your password",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const errorId = `${id}-error`;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <InputGroup className="h-11 rounded-xl bg-muted/50">
        <InputGroupInput
          id={id}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="h-full px-3.5"
          {...registration}
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            onClick={() => setIsVisible((visible) => !visible)}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            aria-controls={id}
          >
            <HugeiconsIcon
              icon={isVisible ? ViewOffIcon : ViewIcon}
              aria-hidden="true"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <FieldError id={errorId}>{error?.message}</FieldError>
    </Field>
  );
}
