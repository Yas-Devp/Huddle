"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/auth";

export default function PageMe() {
  const { isAuthenticated, checkAuth } = useAuth();

  const [user, Setuser] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User is not authenticated. Redirecting to login page...");
    }
    const fetchUser = async () => {
      const data = await checkAuth();
      console.log("User data:", data);
      Setuser(data.user);
    };

    fetchUser();
  }, [checkAuth]);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your account <br />
          {isAuthenticated ? "Authenticated" : "Not Authenticated"}
        </h2>

        {user && (
          <div className="mt-6 text-center text-gray-600">
            <p>Nom: {user.nom}</p>
            <p>Prénom: {user.prenom}</p>
            <p>Email: {user.email}</p>
            <p>Téléphone: {user.telephone}</p>
          </div>
        )}
      </div>
    </div>
  );
}
