"use client";
import { Clientaxios } from "@/lib/axios";

export const Connect_Dash = {
  getWorkspaces: async () => {
    return await Clientaxios.get("workspaces");
  },
  postWorkspace: async (data) => {
    return await Clientaxios.post("workspaces/create", data);
  },
  // Redeem a workspace key. This is the only way to become a member.
  postJoinWorkspace: async (code) => {
    return await Clientaxios.post("workspaces/join", { code });
  },
  // Load one workspace; the API answers 403 for non-members.
  getWorkspace: async (id) => {
    return await Clientaxios.get(`workspaces/${id}`);
  },
  // Admin only.
  getInvitations: async (id) => {
    return await Clientaxios.get(`workspaces/${id}/invitations`);
  },
  createInvitation: async (id, data = {}) => {
    return await Clientaxios.post(`workspaces/${id}/invitations`, data);
  },
  updateInvitation: async (id, invitationId, data) => {
    return await Clientaxios.patch(
      `workspaces/${id}/invitations/${invitationId}`,
      data,
    );
  },
};
