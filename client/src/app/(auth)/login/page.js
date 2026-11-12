import AuthShell from "@/components/forms/auth-shell";
import LoginForm from "@/components/forms/login-form";

export const metadata = {
  title: "Sign in | Huddle",
  description:
    "Sign in to Huddle to start managing your projects and meeting with your team.",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
