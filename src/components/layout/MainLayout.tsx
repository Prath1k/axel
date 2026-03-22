import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Home, Library, Settings, Disc } from 'lucide-react';
import MiniPlayer from '../player/MiniPlayer';
import AudioProvider from '../player/AudioProvider';

export default function MainLayout() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg">
        <div className="animate-pulse text-primary text-xl font-bold neon-glow px-6 py-2 rounded-full border border-primary">
          LOADING...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative h-screen w-full flex flex-col bg-bg text-text overflow-hidden">
      <AudioProvider />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar pb-32">
        <Outlet />
      </main>
      
      {/* Bottom Navigation & Mini Player */}
      <div className="absolute bottom-0 left-0 w-full glass z-50 flex flex-col">
        {/* Mini Player */}
        <div className="h-16 border-t border-white/10 px-4 flex items-center justify-between">
          <MiniPlayer />
        </div>
        
        {/* Navigation Bar */}
        <nav className="h-16 border-t border-white/5 flex justify-around items-center px-2 pb-safe bg-card/50">
          <Link to="/home" className="flex flex-col items-center p-2 text-text/70 hover:text-primary transition-colors">
            <Home size={24} />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          <Link to="/library" className="flex flex-col items-center p-2 text-text/70 hover:text-primary transition-colors">
            <Library size={24} />
            <span className="text-[10px] mt-1 font-medium">Library</span>
          </Link>
          <Link to="/player" className="flex flex-col items-center p-2 text-primary neon-glow rounded-full -mt-6 bg-card border border-primary/30 shadow-[0_0_15px_var(--primary)_inset]">
            <Disc size={40} className="p-2 animate-[spin_4s_linear_infinite]" />
          </Link>
          <Link to="/settings" className="flex flex-col items-center p-2 text-text/70 hover:text-primary transition-colors">
            <Settings size={24} />
            <span className="text-[10px] mt-1 font-medium">Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
