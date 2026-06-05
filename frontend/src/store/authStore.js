import { create } from "zustand"
import { persist } from "zustand/middleware"

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
      user: null,
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

      setAuth: (token, user) => set({ token, user }),

      setHasInteraction: (val) =>
        set({ hasInteraction: val }),

      logout: () =>
        set({
          token: null,
          user: null,
          hasInteraction: false,
          recommendations: [],
          recommendationDirty: true,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
// import { create } from "zustand"
import { login } from "../services/authService"

export const useAuth= create( (set)=>({ 
  token:null,
  accountType:null,
  login: async( data )=>{
    const res=
    await login( data )
    localStorage
    .setItem( "token", res.token )
      set(res)
  }})
)

