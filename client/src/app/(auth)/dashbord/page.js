"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import UserAuth from "@/components/navbar/UserAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAuth } from "@/components/context/auth";
import { useRouter } from "next/navigation";
import { WorkspaceCard } from "./(components)/WorkspaceCard";
import { ModeToggle } from "@/components/mode-toggle";
import { Connect_Dash } from "@/components/router/connect_dash";
import { TbArrowUpRight } from "react-icons/tb";

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [query, setQuery] = useState("");

  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/me");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await Connect_Dash.getWorkspaces();
        console.log("Workspaces fetched successfully:", response.data);
        setWorkspaces(response.data.workspaces);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        toast.error("Failed to load workspaces. Please try again later.");
      }
    };

    fetchWorkspaces();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleWorkspaces = normalizedQuery
    ? workspaces.filter((workspace) =>
        (workspace.nom ?? "").toLowerCase().includes(normalizedQuery),
      )
    : workspaces;

  const handleJoinSpace = () => {
    router.push("/spaces/join");
    setQuery("");
  };

  const handleCreateSpace = () => {
    router.push("/spaces/create");
    setQuery("");
  };

  const handleDuplicate = (workspace) => {
    // setWorkspaces((current) => [
    //   {
    //     ...workspace,
    //     id: crypto.randomUUID(),
    //     title: `${workspace.title} (Copy)`,
    //     updatedAt: "Today",
    //   },
    //   ...current,
    // ]);
    toast.info("This feature is not active yet.");
  };

  const handleDelete = (workspace) => {
    // setWorkspaces((current) =>
    //   current.filter((item) => item.id !== workspace.id),
    // );
    toast.info(`"${workspace.nom}" delete option is not active yet.`);
  };

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-5 ">
            <Link
              href="/"
              aria-label="Huddle home"
              className="shrink-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Image
                src="/logo/Comleted_logo_dr.png"
                alt=""
                width={109}
                height={37}
                loading="eager"
                className="h-8 w-auto dark:hidden"
              />
              <Image
                src="/logo/Comleted_logo.png"
                alt=""
                width={109}
                height={37}
                loading="eager"
                className="hidden h-8 w-auto dark:block"
              />
            </Link>

            <div className="hidden items-center gap-2 sm:flex">
              <Badge className="ml-0.5 hidden h-7 rounded-full px-2 text-sm font-semibold sm:inline-flex">
                All
              </Badge>

              <Link
                href="/dashbord"
                aria-current="page"
                className="ml-1 hidden text-sm font-medium text-muted-foreground transition-colors md:inline"
              >
                Created Spaces
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-4">
            <ModeToggle size="icon" />
            <Button
              type="button"
              size="lg"
              aria-label="Join Space"
              onClick={handleJoinSpace}
              variant="outline"
              className="rounded-full px-3 text-base sm:px-4"
            >
              <TbArrowUpRight data-icon="inline-start" />
              <span className="hidden sm:inline">Join Space</span>
            </Button>

            <Button
              type="button"
              size="lg"
              aria-label="Create Space"
              onClick={handleCreateSpace}
              className="rounded-full px-3 text-base sm:px-4"
            >
              <Plus data-icon="inline-start" />
              <span className="hidden sm:inline">Create Space</span>
            </Button>

            <UserAuth showStatus={true} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            Created Work Spaces.
          </h1>

          <div className="w-full md:w-[260px] md:shrink-0">
            <InputGroup className="rounded-xl border-border/80 bg-muted/40">
              <InputGroupAddon align="inline-start">
                <Search aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                aria-label="Search work spaces"
                className="text-sm"
              />
            </InputGroup>
          </div>
        </div>

        {workspaces.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p role="status" className="text-sm text-muted-foreground">
              You don&apos;t have any work spaces yet.
            </p>
            <Button
              type="button"
              size="sm"
              className="rounded-full"
              onClick={handleCreateSpace}
            >
              <Plus data-icon="inline-start" />
              Create Space
            </Button>
          </div>
        ) : visibleWorkspaces.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleWorkspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                onDuplicate={() => handleDuplicate(workspace)}
                onDelete={() => handleDelete(workspace)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p role="status" className="text-sm text-muted-foreground">
              No work spaces match{" "}
              <span className="text-foreground">
                &ldquo;{query.trim()}&rdquo;
              </span>
              .
            </p>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm"
              onClick={() => setQuery("")}
            >
              Clear search
            </Button>
          </div>
        )}

        <p className="mt-16 text-center text-sm text-muted-foreground">
          This is the first version of{" "}
          <Link
            href="/"
            className="font-medium text-muted-foreground underline decoration-dotted underline-offset-4 transition-colors hover:text-foreground"
          >
            Huddle.
          </Link>
        </p>
      </main>
    </div>
  );
}
