"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, MoreVertical, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

const checkerboardStyle = {
  backgroundColor: "#fafafa",
  backgroundImage:
    "linear-gradient(45deg, #ebebeb 25%, transparent 25%, transparent 75%, #ebebeb 75%), linear-gradient(45deg, #ebebeb 25%, transparent 25%, transparent 75%, #ebebeb 75%)",
  backgroundSize: "36px 36px",
  backgroundPosition: "0 0, 18px 18px",
};

function WorkspacePreview({ title }) {
  return (
    <div
      role="img"
      aria-label={`${title} preview`}
      className="aspect-[16/10] w-full overflow-hidden rounded-xl ring-1 ring-black/5"
      style={checkerboardStyle}
    />
  );
}

function WorkspaceMenu({ workspace, onDuplicate, onDelete }) {
  const Router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Open actions for ${workspace.nom}`}
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="rounded-full text-muted-foreground hover:text-foreground"
          />
        }
      >
        <MoreVertical />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              toast.info(`Opening ${workspace.nom}…`);
              Router.push(`/spaces/join/${workspace.id}`);
            }}
          >
            <ExternalLink aria-hidden="true" />
            Open
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy aria-hidden="true" />
            Duplicate
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatRelativeDate(createdAt) {
  if (!createdAt) return "";

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "Unknown date";

  return formatDistanceToNow(date, { addSuffix: true });
}

export function WorkspaceCard({ workspace, onDuplicate, onDelete }) {
  const relativeDate = formatRelativeDate(workspace?.createdAt);

  return (
    <article className="group min-w-0">
      <WorkspacePreview title={workspace.nom} />

      <div className="mt-3 flex items-center justify-between gap-2">
        <h2 className="min-w-0 truncate text-sm font-semibold">
          {workspace.nom}
        </h2>

        <div className="flex shrink-0 items-center gap-0.5 pr-2">
          <span className="text-xs text-muted-foreground">{relativeDate}</span>

          <WorkspaceMenu
            workspace={workspace}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </div>
      </div>
    </article>
  );
}
