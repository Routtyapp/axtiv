import { create } from "zustand";
import { persist } from "zustand/middleware";

const userStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user
        }),

      setSession: (session) =>
        set({
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user
        }),

      setLoading: (loading) => set({ loading }),

      login: (session) =>
        set({
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
          loading: false
        }),

      logout: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          loading: false
        }),

      updateUserProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...updates
            }
          });
        }
      },

      clearAuth: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          loading: false
        })
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default userStore;
