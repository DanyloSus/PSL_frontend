import { create } from "zustand";

interface LogSheetState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setOpen: (isNextOpen: boolean) => void;
}

export const useLogSheetStore = create<LogSheetState>(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setOpen: isNextOpen => set({ isOpen: isNextOpen })
}));
