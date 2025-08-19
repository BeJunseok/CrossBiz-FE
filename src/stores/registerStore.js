import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useRegisterStore = create(
  persist(
    (set) => ({
      formData: {},

      updateFormData: (newData) =>
        set((state) => ({
          formData: { ...state.formData, ...newData },
        })),

      resetFormData: () => set({ formData: {} }),
    }),
    {
      name: 'register-form-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
