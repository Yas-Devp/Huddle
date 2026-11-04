---
name: shadcn-ui
description: "Use when adding or customizing shadcn/ui components in a React app — shadcn CLI init/add/apply/migrate, components.json, Base UI vs Radix primitives, Tailwind v4 theming with CSS variables and @theme inline, the cn helper, extending variants with cva, forms with Field + react-hook-form + zod, accessibility, and pulling upstream component updates."
license: MIT
---

# shadcn/ui

Use shadcn/ui the way it is designed: components are source files copied into your repo, built
on headless primitives (Base UI by default, Radix or React Aria optional) and styled with
Tailwind. You own the code, so customize it in place and manage updates deliberately.

## When to Use This Skill

- Setting up shadcn/ui in a Next.js, Vite, React Router, TanStack Start, Astro, or Laravel app
- Adding components (`button`, `dialog`, `field`, `data-table` patterns) and wiring them together
- Re-theming: brand colors, radius, dark mode, adding a semantic color like `warning`
- Building validated forms with `Field`, react-hook-form, and zod
- Updating copied components to upstream fixes without losing local edits

For Tailwind itself (utilities, `@theme`, v3→v4) see `tailwind-css`; for token architecture
and component API design across a design system see `ui-design-systems`.

## Workflow

1. Initialise (existing project with Tailwind v4 and a `@/*` path alias already configured):
   ```bash
   npx shadcn@latest init              # Base UI primitives by default
   npx shadcn@latest init -b radix     # choose Radix explicitly (also in CI scripts)
   ```
   New project from scratch: `npx shadcn@latest init -t vite` (or `next`, `start`,
   `react-router`, `laravel`, `astro`), optionally `--monorepo`.
2. Add components; they land in `aliases.ui` (default `@/components/ui`):
   ```bash
   npx shadcn@latest add button dialog field input
   npx shadcn@latest add @acme/pricing-table     # namespaced third-party registry
   ```
3. Run `npx shadcn@latest info` to see the detected framework, base, aliases, and installed items.
4. Commit the generated files like any other source.

## components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": { "@acme": "https://registry.acme.com/{name}.json" }
}
```

- `style`, `tailwind.baseColor`, and `tailwind.cssVariables` are fixed after init; changing
  them means re-adding components.
- `tailwind.config` stays empty on Tailwind v4.
- Aliases must resolve through `tsconfig` `paths` (or `package.json#imports`), or the CLI writes broken imports.
- Registry URLs may use `${ENV_VAR}` in headers for private registries; never inline tokens.

## Theming

Every surface token has a `-foreground` pair. Define values in `:root`/`.dark`, map them to
Tailwind with `@theme inline`:

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";
@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --primary: oklch(0.55 0.2 262);
  --primary-foreground: oklch(0.985 0 0);
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}
.dark {
  --primary: oklch(0.7 0.16 262);
  --primary-foreground: oklch(0.2 0 0);
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Then use `bg-warning text-warning-foreground`. Change the theme through these variables, not
by editing hex values inside component files. `npx shadcn@latest apply <preset> --only theme`
applies a preset's theme to an existing project.

## Customizing components

Edit the copied file. Add variants in the component's `cva` call so they stay type-safe:

```tsx
// components/ui/button.tsx (excerpt)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90", // added
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
```

- Compose rather than fork: build `ConfirmDialog` in `components/` from `ui/dialog`; keep
  `components/ui/*` close to upstream so updates stay mergeable.
- Merge classes with `cn()` so callers can override (`className` last). New projects import it
  from the `cn` package; `lib/utils.ts` re-exports it. `npx shadcn@latest migrate cn` converts
  older `clsx` + `tailwind-merge` setups.
- Polymorphism differs by primitive: Base UI uses a `render` prop
  (`<DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>`), Radix uses
  `asChild` (`<DialogTrigger asChild><Button>Open</Button></DialogTrigger>`). Follow the base
  recorded in your project; don't mix both in one component.

## Forms

Use `Field` components with react-hook-form's `Controller` and a zod schema:

```tsx
const schema = z.object({ email: z.email("Enter a valid email") })
const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } })

<form onSubmit={form.handleSubmit(onSubmit)}>
  <FieldGroup>
    <Controller name="email" control={form.control} render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input {...field} id="email" type="email" aria-invalid={fieldState.invalid} />
        <FieldDescription>We never share it.</FieldDescription>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )} />
  </FieldGroup>
  <Button type="submit">Save</Button>
</form>
```

Install with `npx shadcn@latest add field input button` plus `react-hook-form`,
`@hookform/resolvers`, `zod`. For schema details see `zod-validation`.

## Keeping components updated

- Preview upstream changes before touching files:
  `npx shadcn@latest add button --dry-run` and `npx shadcn@latest add button --diff`.
- Re-add with `--overwrite` only on a clean git tree, then re-apply local edits from the diff.
- Primitive libraries (`@base-ui/react`, `radix-ui`) are normal dependencies — update them with your package manager.

## Rules

- Treat `components/ui/*` as your code: review, test, and lint it like the rest of the app.
- Theme through CSS variables; keep component files free of hard-coded colors.
- Keep accessible names: every `Dialog`/`Sheet` needs a title (visually hidden if necessary),
  icon-only buttons need `aria-label` or `sr-only` text.
- Pass `-b radix` / `-b base` explicitly in scripts so CI matches the project's primitives.
- Never run `add --overwrite` on files with uncommitted changes.

## Common Mistakes

- `Cannot find module '@/components/ui/button'` → missing `paths` alias in `tsconfig.json`
  (and in `tsconfig.app.json` for Vite) or a mismatched `aliases` entry.
- New color class does nothing → variable defined in `:root` but not mapped in `@theme inline`.
- Dark mode never activates → `.dark` class not toggled on `<html>` or the `@custom-variant` line removed.
- Following a Radix tutorial (`asChild`) in a Base UI project → use the `render` prop.
- Using the legacy `<Form>`/`<FormField>` wrapper from old guides → current docs use `Field` + `Controller`.

## Verify

- `npx shadcn@latest info` reports the expected base, style, and aliases.
- `tsc --noEmit` and the build pass after adding components.
- Toggle light/dark and check contrast of every `*/*-foreground` pair (WCAG AA 4.5:1 for text).
- Tab through dialogs, menus, and forms: focus is trapped and restored, Escape closes, errors are announced.
