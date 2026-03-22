import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Home, Library, Settings, Music2 } from 'lucide-react';
import MiniPlayer from '../player/MiniPlayer';
import AudioProvider from '../player/AudioProvider';
import StickerLayer from '../stickers/StickerLayer';

export default function MainLayout() {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg">
        <div className="animate-pulse text-primary font-bold px-6 py-2 rounded-full border border-primary">
          LOADING...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-bg text-text selection:bg-primary/20 overflow-hidden font-sans">
      <AudioProvider />
      <StickerLayer />
      
      {/* Modern Sidebar */}
      <aside className="w-20 md:w-64 border-r border-border flex flex-col z-10 glass">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <Music2 className="text-primary" size={24} />
          </div>
          <span className="hidden md:block font-extrabold text-xl tracking-tighter">AXEL</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary text-bg shadow-sm' 
                    : 'text-brand-muted hover:bg-secondary hover:text-text'
                }`}
              >
                <Icon size={22} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
                <span className="hidden md:block font-semibold">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden z-10">
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 md:p-10">
          <Outlet />
        </div>
        
        {/* Integrated Player Bar */}
        <div className="px-6 pb-6 pt-2">
          <MiniPlayer />
        </div>
      </main>
    </div>
  );
}
