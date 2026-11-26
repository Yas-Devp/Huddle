"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronsLeft,
  Copy,
  Link2,
  Lock,
  RefreshCw,
  UserX,
  X,
} from "lucide-react";
import { cn } from "cn";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { formatInviteCode } from "@/lib/invite";
import { Connect_Dash } from "@/components/router/connect_dash";

import { copyInviteLink, copyWorkspaceKey } from "@/lib/clipboard";
import { SIDEBAR_PEOPLE } from "./data";

function InviteCard({
  workspaceId,
  invitation,
  isAdmin,
  people = [],
  onKeyChanged,
}) {
  const [busy, setBusy] = useState(false);
  const code = invitation?.code;

  const rotateKey = async () => {
    if (!isAdmin || busy) return;

    const confirmed = window.confirm(
      code
        ? "Create a new key? The current key stops working immediately."
        : "Create a workspace key?",
    );
    if (!confirmed) return;

    setBusy(true);

    try {
      if (invitation?.id) {
        await Connect_Dash.updateInvitation(workspaceId, invitation.id, {
          isActive: false,
        });
      }

      const response = await Connect_Dash.createInvitation(workspaceId);

      toast.success("New workspace key created", {
        description: formatInviteCode(response.data?.invitation?.code ?? ""),
      });

      await onKeyChanged?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Could not create a new workspace key.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl bg-muted p-4 ring-1 ring-border">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[12.5px] font-semibold leading-tight text-foreground">
          Workspace key
        </h2>
        <Lock className="size-3.5 text-muted-foreground" aria-hidden="true" />
      </div>

      <p className="mt-1 text-[10.5px] leading-snug text-muted-foreground">
        {isAdmin
          ? "Anyone you share this key with can enter this space."
          : "Only workspace admins can see and share the key."}
      </p>

      {isAdmin && code ? (
        <>
          <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-card px-2.5 py-2 ring-1 ring-border">
            <code className="select-all font-mono text-[12px] font-semibold tracking-[0.08em] text-foreground">
              {formatInviteCode(code)}
            </code>
            <button
              type="button"
              onClick={() => copyWorkspaceKey(code)}
              aria-label="Copy workspace key"
              title="Copy workspace key"
              className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Copy className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 flex items-stretch gap-1 rounded-[10px] bg-[#9564dd] p-[3px]">
            <Button
              type="button"
              onClick={() => copyInviteLink(code)}
              className="h-7 flex-1 gap-1.5 rounded-lg bg-transparent text-[11.5px] font-semibold text-white shadow-none hover:bg-white/15 focus-visible:ring-white/70"
            >
              <Link2 className="size-3.5" aria-hidden="true" />
              Copy invite link
            </Button>
          </div>
        </>
      ) : (
        <p className="mt-3 rounded-lg bg-card px-2.5 py-2 text-[10.5px] leading-snug text-muted-foreground">
          {isAdmin
            ? "This space has no active key. Create one below."
            : "Ask a workspace admin for the key."}
        </p>
      )}

      {isAdmin ? (
        <button
          type="button"
          onClick={rotateKey}
          disabled={busy}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[10.5px] font-medium text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-60"
        >
          <RefreshCw
            className={cn("size-3", busy && "animate-spin")}
            aria-hidden="true"
          />
          {busy ? "Creating a new key…" : "New key"}
        </button>
      ) : null}

      {people.length > 0 ? (
        <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
          <AvatarGroup className="grayscale">
            {people.slice(0, 3).map((person) => (
              <Avatar key={person.id} size="sm">
                <AvatarFallback
                  className="text-[10px] font-semibold text-[#1e1335]"
                  style={{ backgroundColor: person.color }}
                >
                  {person.initial}
                </AvatarFallback>
              </Avatar>
            ))}
            {people.length > 3 ? (
              <AvatarGroupCount>+{people.length - 3}</AvatarGroupCount>
            ) : null}
          </AvatarGroup>
        </div>
      ) : null}
    </div>
  );
}

function PersonRow({ person, online }) {
  return (
    <div className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-foreground/[0.04]">
      <Avatar className="size-8">
        <AvatarFallback
          className={cn(
            "text-[11px] font-semibold",
            online ? "text-[#1e1335]" : "text-[#40331a]",
          )}
          style={{ backgroundColor: person.color }}
        >
          {person.initial}
        </AvatarFallback>
        {online ? (
          <span className="absolute -bottom-0.5 -right-0.5 z-10 size-2.5 rounded-full bg-emerald-400 ring-2 ring-card" />
        ) : null}
      </Avatar>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-[11.5px] font-medium leading-tight",
            online ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {person.name}
        </p>
        {person.status ? (
          <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
            {person.status}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function PeopleGroup({ label, people, online, open, onToggle }) {
  return (
    <section className="first:mt-1">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 rounded-md px-2 pb-1.5 pt-2 text-[9.5px] font-semibold uppercase tracking-[0.09em] text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        {label} ({people.length})
        <ChevronDown
          className={cn(
            "size-3 transition-transform duration-200",
            !open && "-rotate-90",
          )}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div className="space-y-0.5">
          {people.map((person) => (
            <PersonRow key={person.id} person={person} online={online} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default function WorkspaceSidebar({
  workspaceName,
  workspaceId,
  displayName = "Youmes",
  people,
  invitation,
  isAdmin = false,
  onKeyChanged,
  onCollapse,
  isDrawer = false,
}) {
  const [query, setQuery] = useState("");
  const [onlineOpen, setOnlineOpen] = useState(true);
  const [offlineOpen, setOfflineOpen] = useState(true);

  const hasProvidedPeople = Array.isArray(people);
  const onlineSource = hasProvidedPeople ? people : SIDEBAR_PEOPLE.online;
  const offlineSource = hasProvidedPeople ? [] : SIDEBAR_PEOPLE.offline;

  const normalizedQuery = query.trim().toLowerCase();
  const matches = (person) =>
    !normalizedQuery ||
    person.name.toLowerCase().includes(normalizedQuery) ||
    (person.status ?? "").toLowerCase().includes(normalizedQuery);

  const onlinePeople = onlineSource.filter(matches);
  const offlinePeople = offlineSource.filter(matches);
  const totalPeople = onlineSource.length + offlineSource.length;
  const hasResults = onlinePeople.length + offlinePeople.length > 0;

  return (
    <aside
      aria-label="Space sidebar"
      className="flex h-full min-h-0 w-full flex-col bg-card"
    >
      <div className="flex items-start justify-between gap-3 px-5 pb-2 pt-5">
        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-semibold tracking-[-0.01em] text-foreground">
            {workspaceName || displayName}
          </h1>
          <p className="mt-0.5 truncate text-[11px] font-medium text-muted-foreground">
            {totalPeople} {totalPeople === 1 ? "person" : "people"}
          </p>
        </div>
        {onCollapse ? (
          <button
            type="button"
            onClick={onCollapse}
            aria-label={isDrawer ? "Close space menu" : "Collapse sidebar"}
            title={isDrawer ? "Close menu" : "Collapse sidebar"}
            className="-mr-1 -mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isDrawer ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <ChevronsLeft className="size-4" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      <div className="px-4 pt-3">
        <InviteCard
          workspaceId={workspaceId}
          invitation={invitation}
          isAdmin={isAdmin}
          people={onlineSource}
          onKeyChanged={onKeyChanged}
        />
      </div>

      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="px-4 pt-3"
      >
        <InputGroup className="h-9 gap-0 rounded-full border-border bg-background has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30">
          <InputGroupInput
            data-people-search
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people"
            aria-label="Search people"
            autoComplete="off"
            className="h-9 px-3.5 text-[11px] text-foreground placeholder:text-muted-foreground"
          />
          <InputGroupAddon
            align="inline-end"
            className="gap-1 px-2 py-0"
            aria-hidden="true"
          >
            <kbd className="rounded bg-muted px-1 py-0.5 font-sans text-[9px] font-medium leading-none text-muted-foreground ring-1 ring-border">
              Ctrl
            </kbd>
            <kbd className="rounded bg-muted px-1 py-0.5 font-sans text-[9px] font-medium leading-none text-muted-foreground ring-1 ring-border">
              F
            </kbd>
          </InputGroupAddon>
        </InputGroup>
      </form>

      <div className="min-h-0 flex-1 overflow-y-auto px-3.5 pb-6">
        {hasResults ? (
          <>
            {onlinePeople.length > 0 ? (
              <PeopleGroup
                label={hasProvidedPeople ? "Members" : "Online"}
                people={onlinePeople}
                online
                open={onlineOpen}
                onToggle={() => setOnlineOpen((open) => !open)}
              />
            ) : null}
            {offlinePeople.length > 0 ? (
              <PeopleGroup
                label="Offline"
                people={offlinePeople}
                online={false}
                open={offlineOpen}
                onToggle={() => setOfflineOpen((open) => !open)}
              />
            ) : null}
          </>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-2 px-4 text-center">
            <UserX className="size-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-[11px] font-medium text-muted-foreground">
              No one here by that name
            </p>
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              Try a different search or invite someone new.
            </p>
          </div>
        )}
      </div>

      {isDrawer ? (
        <div className="border-t border-border p-4">
          <Link
            href="/dashbord"
            className="flex items-center gap-2 rounded-lg text-[11px] font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to dashboard
          </Link>
        </div>
      ) : null}
    </aside>
  );
}
