import { create } from "zustand";

import { login } from "../services/authService";

export const useAuth = create((set) => ({
  token: null,

  accountType: null,

  login: async (data) => {
    const res = await login(data);

    localStorage.setItem("token", res.token);

    set(res);
  },
}));
