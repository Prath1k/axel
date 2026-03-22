import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Sticker {
  id: string;
  type: string; // emoji or icon name
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface StickerState {
  stickers: Sticker[];
  addSticker: (type: string, x: number, y: number) => void;
  removeSticker: (id: string) => void;
  updateSticker: (id: string, updates: Partial<Sticker>) => void;
  clearStickers: () => void;
}

export const useStickerStore = create<StickerState>()(
  persist(
    (set) => ({
      stickers: [],
      addSticker: (type, x, y) => set((state) => ({
        stickers: [
          ...state.stickers,
          {
            id: crypto.randomUUID(),
            type,
            x,
            y,
            rotation: Math.random() * 30 - 15,
            scale: 0.8 + Math.random() * 0.4
          }
        ]
      })),
      removeSticker: (id) => set((state) => ({
        stickers: state.stickers.filter((s) => s.id !== id)
      })),
      updateSticker: (id, updates) => set((state) => ({
        stickers: state.stickers.map((s) => s.id === id ? { ...s, ...updates } : s)
      })),
      clearStickers: () => set({ stickers: [] }),
    }),
    {
      name: 'axel-stickers',
    }
  )
);
