import { toast } from "sonner";

import { buildInviteUrl, formatInviteCode } from "@/lib/invite";

async function writeToClipboard(text) {
  try {
    if (!navigator.clipboard) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(field);
      return copied;
    } catch {
      return false;
    }
  }
}

/** Copy a join link, with the key inside it when the caller has one. */
export async function copyInviteLink(code) {
  const url = buildInviteUrl(code);
  const copied = await writeToClipboard(url);

  if (copied) {
    toast.success("Invite link copied", {
      description: code
        ? "The link already contains the workspace key."
        : "Ask a workspace admin for the key to share alongside it.",
    });
  } else {
    toast.error("Couldn't copy the invite link", {
      description: "You can copy the address from your browser instead.",
    });
  }

  return copied;
}

/** Copy just the key, for chat or a whiteboard. */
export async function copyWorkspaceKey(code) {
  if (!code) return false;

  const copied = await writeToClipboard(formatInviteCode(code));

  if (copied) {
    toast.success("Workspace key copied", {
      description: "Share it only with people you want in this space.",
    });
  } else {
    toast.error("Couldn't copy the workspace key", {
      description: "Select the key and copy it manually.",
    });
  }

  return copied;
}
