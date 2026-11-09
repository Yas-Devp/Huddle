"use client";
import { Clientaxios } from "@/lib/axios";

export const Connect_Auth = {
  postLogin: async (data) => {
    return await Clientaxios.post("auth/login", data);
  },
  postRegister: async (data) => {
    return await Clientaxios.post("auth/register", data);
  },
  //   postLogout: async () => {
  //     return await Clientaxios.post("auth/logout");
  //   },
  getMe: async () => {
    return await Clientaxios.get("auth/me");
  },
};
