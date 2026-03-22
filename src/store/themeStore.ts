import { create } from 'zustand';

interface ThemeState {
  theme: 'retro' | 'futuristic' | 'oldschool';
  visualizer: 'vinyl' | 'headphones' | 'mp3';
  setTheme: (theme: 'retro' | 'futuristic' | 'oldschool') => void;
  setVisualizer: (visualizer: 'vinyl' | 'headphones' | 'mp3') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'retro',
  visualizer: 'vinyl',
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
  setVisualizer: (visualizer) => set({ visualizer }),
}));
