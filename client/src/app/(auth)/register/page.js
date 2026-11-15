import AuthShell from "@/components/forms/auth-shell";
import RegisterForm from "@/components/forms/register-form";

export const metadata = {
  title: "Create account | Huddle",
  description:
    "Create your Huddle account and start meeting, chatting, and collaborating with your team.",
};

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
