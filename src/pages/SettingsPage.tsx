import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useStickerStore } from '../store/stickerStore';
import { signOut } from '../supabase/auth';
import { fetchUserPreferences, updateUserPreferences } from '../supabase/preferences';
import { Moon, Sun, Trash2, LogOut, Layout } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { stickers, addSticker, clearStickers, removeSticker } = useStickerStore();

  const stickerOptions = ['🎸', '🚀', '🔥', '✨', '🛸', '🎹', '💿', '🕹️', '👾', '🌈', '🎨', '⚡', '🎧', '🍦', '🪐'];

  useEffect(() => {
    if (user) {
      fetchUserPreferences(user.id).then(prefs => {
        if (prefs) setTheme(prefs.theme as any);
      });
    }
  }, [user, setTheme]);

  const handleLogout = async () => {
    try { await signOut(); } catch (err) { console.error(err); }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme as any);
    if (user) await updateUserPreferences(user.id, { theme: newTheme });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-20">
      <header className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tighter">Settings</h1>
        <p className="text-brand-muted text-lg font-medium">Configure your personal audio environment.</p>
      </header>

      {/* User Info */}
      <section className="bg-secondary rounded-3xl p-8 flex items-center justify-between shadow-sm border border-border/50">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-1">Active Account</p>
          <h3 className="text-xl font-bold">{user?.email}</h3>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-red-500 font-bold px-6 py-3 rounded-2xl shadow-sm hover:bg-red-50 transition-all border border-red-100"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </section>

      {/* Theme Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Layout className="text-primary" size={24} /> Appearance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'light', label: 'Light', icon: Sun, desc: 'Fresh and clear' },
            { id: 'dark', label: 'Dark', icon: Moon, desc: 'Elegant and focused' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleThemeChange(item.id)}
              className={`flex flex-col gap-4 p-8 rounded-3xl border-2 transition-all text-left ${
                theme === item.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-transparent bg-secondary hover:bg-secondary/80'
              }`}
            >
              <item.icon size={28} className={theme === item.id ? 'text-primary' : 'text-brand-muted'} />
              <div>
                <span className="block font-bold text-lg">{item.label}</span>
                <span className="text-sm text-brand-muted">{item.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Sticker Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🎨 Sticker Workshop
          </h2>
          {stickers.length > 0 && (
            <button 
              onClick={clearStickers}
              className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full"
            >
              <Trash2 size={14} /> Remove All
            </button>
          )}
        </div>
        
        <div className="bg-secondary p-8 rounded-[2rem] border border-border/60">
          <p className="text-sm text-brand-muted mb-8 text-center font-medium">Click to add stickers to your interface. They'll stay right where you drag them.</p>
          <div className="flex flex-wrap justify-center gap-6">
            {stickerOptions.map(emoji => (
              <button
                key={emoji}
                onClick={() => addSticker(emoji, 200 + Math.random() * 400, 200 + Math.random() * 400)}
                className="w-20 h-20 text-4xl flex items-center justify-center bg-white rounded-3xl shadow-sm hover:scale-115 hover:rotate-12 active:scale-95 transition-all border border-border"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {stickers.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-4">
             {stickers.map(s => (
               <div key={s.id} className="bg-white px-4 py-2 rounded-2xl flex items-center gap-4 shadow-sm border border-border group">
                 <span className="text-2xl">{s.type}</span>
                 <button onClick={() => removeSticker(s.id)} className="text-brand-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                 </button>
               </div>
             ))}
          </div>
        )}
      </section>
    </div>
  );
}
