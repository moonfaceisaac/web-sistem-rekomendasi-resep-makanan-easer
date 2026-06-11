import { create } from "zustand";
import { persist } from "zustand/middleware";

// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       token: null,
//       user: null,
//       hasInteraction: false,
//       setAuth: (token, user) => set({ token, user }),
//       setHasInteraction: (val) => set({ hasInteraction: val }),
//       logout: () => set({ token: null, user: null, hasInteraction: false }),
//     }),
//     { name: "auth-storage" }
//   )
// )
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      username: null,
      accountType: null,
      user_id: null,
      hasInteraction: false,
      recommendations: [],
      recommendationDirty: true,

      setRecommendations: (recommendations) =>
        set({
          recommendations,
          recommendationDirty: false,
        }),

      markRecommendationDirty: () =>
        set({
          recommendationDirty: true,
        }),

      // setAuth: (token, user) =>
      //   set({
      //     token,
      //     accountType: user.accountType,
      //     user_id: user.user_id,
      //   }),
      setAuth: (token, username, accountType, user_id) =>
        set({
          token,
          username,
          accountType,
          user_id,
        }),

      setHasInteraction: (val) => set({ hasInteraction: val }),

      logout: () =>
        set({
          token: null,
          username: null,
          accountType: null,
          user_id: null,
          hasInteraction: false,
          recommendations: [],
          recommendationDirty: true,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
// import { create } from "zustand"
// import { login } from "../services/authService"

// export const useAuth= create( (set)=>({
//   token:null,
//   accountType:null,
//   login: async( data )=>{
//     const res=
//     await login( data )
//     localStorage
//     .setItem( "token", res.token )
//       set(res)
//   }})
// )
