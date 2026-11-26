"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Menu, PanelLeftOpen, ShieldAlert, WifiOff } from "lucide-react";
import { cn } from "cn";
import { toast } from "sonner";

import { useAuth } from "@/components/context/auth";
import { Connect_Dash } from "@/components/router/connect_dash";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

import IconRail from "./(components)/IconRail";
import MediaBar from "./(components)/MediaBar";
import WorkspaceMap from "./(components)/WorkspaceMap";
import WorkspaceSidebar from "./(components)/WorkspaceSidebar";

const ACTION_BUTTON =
  "grid size-9 place-items-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur-md outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

function StatusScreen({ icon, title, description, children }) {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground">
      {icon}
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <p className="max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {children}
    </div>
  );
}

/**
 * The workspace screen is only reachable with a Member row. The API enforces
 * that; this component merely reacts to the answer (403 sends the visitor to
 * the key screen instead of rendering the room).
 *
 * useParams() is URL data, so this component must sit behind <Suspense> for
 * the route to prerender. See the default export at the bottom of the file.
 */
function SpacePageContent() {
  const { id_space: spaceId } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [state, setState] = useState("loading");
  const [data, setData] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Used after an admin rotates the workspace key.
  const refreshWorkspace = useCallback(async () => {
    try {
      const response = await Connect_Dash.getWorkspace(spaceId);
      setData(response.data);
    } catch {
      toast.error("Could not refresh the workspace key.");
    }
  }, [spaceId]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    Connect_Dash.getWorkspace(spaceId)
      .then((response) => {
        if (cancelled) return;
        setData(response.data);
        setState("ready");
      })
      .catch((error) => {
        if (cancelled) return;

        const status = error?.response?.status;

        if (status === 401) {
          router.replace("/login");
          return;
        }

        if (status === 403) {
          toast.error("That space is locked. Enter its key to continue.");
          router.replace(
            `/spaces/join?next=${encodeURIComponent(String(spaceId))}`,
          );
          return;
        }

        if (status === 404) {
          setState("not-found");
          return;
        }

        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, reloadToken, router, spaceId]);

  const firstName = user?.prenom?.trim();
  const displayName = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
    : "You";

  const focusSearch = useCallback(() => {
    const findVisibleInput = () =>
      Array.from(document.querySelectorAll("[data-people-search]")).find(
        (element) => element.offsetParent !== null,
      );

    const visibleInput = findVisibleInput();
    if (visibleInput) {
      visibleInput.focus();
      return;
    }

    if (window.matchMedia("(max-width: 1023px)").matches) {
      setMobileOpen(true);
    } else {
      setSidebarOpen(true);
    }

    window.setTimeout(() => {
      findVisibleInput()?.focus();
    }, 340);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        focusSearch();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusSearch]);

  // Keep showing the loader while a different space id is being fetched.
  const isStale =
    state === "ready" && data && String(data.workspace?.id) !== String(spaceId);

  if (state === "loading" || isStale) {
    return (
      <StatusScreen
        icon={<Spinner className="size-6 text-muted-foreground" />}
        title="Opening the space"
        description="Checking your membership and loading the room."
      />
    );
  }

  if (state !== "ready" || !data) {
    const notFound = state === "not-found";

    return (
      <StatusScreen
        icon={
          notFound ? (
            <WifiOff
              className="size-7 text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <ShieldAlert
              className="size-7 text-muted-foreground"
              aria-hidden="true"
            />
          )
        }
        title={
          notFound ? "This space does not exist" : "Could not open this space"
        }
        description={
          notFound
            ? "The link may be out of date, or the space was deleted."
            : "Something went wrong while loading the room. Check your connection and try again."
        }
      >
        <div className="mt-2 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setState("loading");
              setReloadToken((token) => token + 1);
            }}
            disabled={notFound}
          >
            Try again
          </Button>
          <Button
            render={<Link href="/dashbord" />}
            nativeButton={false}
            className="rounded-full"
          >
            Back to dashboard
          </Button>
        </div>
      </StatusScreen>
    );
  }

  const { workspace, membership, members, invitation } = data;
  const isAdmin = membership?.role === "admin";

  const people = (members ?? []).map((member) => ({
    id: member.id,
    name:
      [member.user?.prenom, member.user?.nom].filter(Boolean).join(" ") ||
      "Member",
    initial: (member.user?.prenom || member.user?.nom || "?")
      .charAt(0)
      .toUpperCase(),
    color: member.role === "admin" ? "#D8B45A" : "#B794F6",
    status: member.role === "admin" ? "Admin" : undefined,
  }));

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      <div className="hidden h-full shrink-0 lg:flex">
        <IconRail
          displayName={displayName}
          inviteCode={invitation?.code}
          onSearch={focusSearch}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
        />

        <div
          className={cn(
            "h-full overflow-hidden bg-card shadow-[6px_0_24px_rgba(0,0,0,.28)] transition-[width] duration-300 ease-out",
            sidebarOpen ? "w-[280px]" : "w-0",
          )}
        >
          <div
            className={cn(
              "h-full w-[280px] transition-opacity duration-200",
              sidebarOpen ? "opacity-100" : "opacity-0",
            )}
          >
            <WorkspaceSidebar
              workspaceName={workspace.nom}
              workspaceId={workspace.id}
              displayName={displayName}
              people={people}
              invitation={invitation}
              isAdmin={isAdmin}
              onKeyChanged={refreshWorkspace}
              onCollapse={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      </div>

      <main className="relative min-w-0 flex-1 overflow-hidden bg-[var(--workspace-canvas)]">
        <div className="absolute right-3 top-3 z-30">
          <ModeToggle
            size="icon"
            className="rounded-full bg-card/90 backdrop-blur-md"
          />
        </div>

        <WorkspaceMap people={people} />

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open space menu"
          title="Open space menu"
          className={cn(ACTION_BUTTON, "absolute left-3 top-3 z-30 lg:hidden")}
        >
          <Menu className="size-4" aria-hidden="true" />
        </button>

        {!sidebarOpen ? (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            title="Open sidebar"
            className={cn(
              ACTION_BUTTON,
              "absolute left-3 top-3 z-30 hidden lg:grid",
            )}
          >
            <PanelLeftOpen className="size-4" aria-hidden="true" />
          </button>
        ) : null}

        <MediaBar displayName={displayName} />
      </main>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[88vw] max-w-[320px] gap-0 border-border bg-card p-0 text-foreground data-[side=left]:w-[88vw] sm:max-w-[320px]"
        >
          <SheetTitle className="sr-only">Space menu</SheetTitle>
          <SheetDescription className="sr-only">
            Browse members, share the workspace key, and find people in this
            Huddle space.
          </SheetDescription>
          <WorkspaceSidebar
            workspaceName={workspace.nom}
            workspaceId={workspace.id}
            displayName={displayName}
            people={people}
            invitation={invitation}
            isAdmin={isAdmin}
            isDrawer
            onKeyChanged={refreshWorkspace}
            onCollapse={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function SpacePage() {
  return (
    <Suspense
      fallback={
        <StatusScreen
          icon={<Spinner className="size-6 text-muted-foreground" />}
          title="Opening the space"
          description="Checking your membership and loading the room."
        />
      }
    >
      <SpacePageContent />
    </Suspense>
  );
}
