"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/auth";

export default function PageMe() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center px-6 py-12">
        <p className="text-sm text-muted-foreground">Loading your session…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
          My account
        </h2>

        <div className="mt-6 text-center text-muted-foreground">
          <p>Nom: {user.nom}</p>
          <p>Prénom: {user.prenom}</p>
          <p>Email: {user.email}</p>
          <p>Téléphone: {user.telephone || "—"}</p>
        </div>
      </div>
    </div>
  );
}
