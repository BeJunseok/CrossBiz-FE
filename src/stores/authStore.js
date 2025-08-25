import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      accessToken: null,
      user: null,
      userId: null, 

      login: (accessToken, userData) => {
        set({
          isLoggedIn: true,
          accessToken,
          user: userData,
          userId: userData.userId, 
        });
      },

      logout: () => {
        set({
          isLoggedIn: false,
          accessToken: null,
          user: null,
          userId: null,
        });
      },

     
      getAccessToken: () => get().accessToken,
      getUserId: () => get().userId,
      getUser: () => get().user,
      getIsLoggedIn: () => get().isLoggedIn,

      // 인증 상태 확인 함수
      isAuthenticated: () => {
        const { isLoggedIn, accessToken } = get();
        return isLoggedIn && !!accessToken;
      },

     
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
