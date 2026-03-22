import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { signOut } from '../supabase/auth';
import { fetchUserPreferences, updateUserPreferences } from '../supabase/preferences';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme, visualizer, setVisualizer } = useThemeStore();

  useEffect(() => {
    if (user) {
      fetchUserPreferences(user.id).then(prefs => {
        if (prefs) {
          setTheme(prefs.theme as any);
          setVisualizer(prefs.visualizer as any);
        }
      });
    }
  }, [user, setTheme, setVisualizer]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme as any);
    if (user) {
      await updateUserPreferences(user.id, { theme: newTheme });
    }
  };
  
  const handleVisualizerChange = async (newVis: string) => {
    setVisualizer(newVis as any);
    if (user) {
      await updateUserPreferences(user.id, { visualizer: newVis });
    }
  };

  const themes = [
    { id: 'retro', name: 'Retro', colors: ['bg-[#1A1A2E]', 'bg-[#E94560]'] },
    { id: 'futuristic', name: 'Futuristic', colors: ['bg-[#050510]', 'bg-[#00D4FF]'] },
    { id: 'oldschool', name: 'Old School', colors: ['bg-[#2C1810]', 'bg-[#D4A017]'] },
  ];

  const visualizers = [
    { id: 'vinyl', name: 'Vinyl record' },
    { id: 'headphones', name: 'Headphones' },
    { id: 'mp3', name: 'MP3 Equalizer' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-neon-glow font-mono uppercase tracking-widest text-text">
        SYSTEM_CONFIG
      </h1>
      
      <div className="space-y-8">
        <section className="glass p-5 rounded-xl border border-white/5 shadow-lg">
          <h2 className="text-sm font-bold text-text/50 mb-4 uppercase tracking-wider font-mono border-b border-white/10 pb-2">Active Profile</h2>
          <div className="font-mono text-primary text-sm flex justify-between items-center">
            <span>{user?.email}</span>
            <button 
              onClick={handleLogout}
              className="text-xs text-red-400 border border-red-400/30 px-3 py-1 rounded hover:bg-red-400/10 transition-colors"
            >
              DISCONNECT
            </button>
          </div>
        </section>
        
        <section>
          <h2 className="text-sm font-bold text-text/50 mb-4 uppercase tracking-wider font-mono ml-2">Display Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map(t => (
              <div 
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`glass p-4 rounded-xl cursor-pointer border-2 transition-all flex justify-between items-center ${
                  theme === t.id ? 'border-primary shadow-[0_0_15px_var(--primary)_inset]' : 'border-transparent hover:border-white/20'
                }`}
              >
                <span className="font-bold capitalize text-sm">{t.name}</span>
                <div className="flex gap-1">
                  <span className={`w-4 h-4 rounded-full ${t.colors[0]}`}></span>
                  <span className={`w-4 h-4 rounded-full ${t.colors[1]}`}></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-text/50 mb-4 uppercase tracking-wider font-mono ml-2">Visualizer Engine</h2>
          <div className="flex flex-col gap-3">
            {visualizers.map(v => (
              <label key={v.id} className="glass p-4 rounded-xl border border-transparent flex items-center justify-between cursor-pointer hover:border-white/20 transition-all [&:has(input:checked)]:border-secondary [&:has(input:checked)]:shadow-[0_0_15px_var(--secondary)_inset]">
                <span className="font-bold text-sm tracking-wide">{v.name}</span>
                <input 
                  type="radio" 
                  name="visualizer" 
                  value={v.id}
                  checked={visualizer === v.id}
                  onChange={() => handleVisualizerChange(v.id)}
                  className="w-5 h-5 accent-secondary"
                />
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
