import React from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MiniPlayer() {
  const { currentSong, isPlaying, setIsPlaying, playNext, playPrevious, progress, duration } = usePlayerStore();

  if (!currentSong) {
    return (
      <div className="h-full w-full flex justify-between items-center text-text/50 font-mono text-xs">
        <span>No active stream</span>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="h-full w-full flex items-center justify-between gap-4 relative">
      {/* Progress Bar (Top edge) */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-black/50">
        <div 
          className="h-full bg-primary shadow-[0_0_5px_var(--primary)] transition-all ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <Link to="/player" className="flex items-center gap-3 flex-1 overflow-hidden group">
        <div className="w-12 h-12 rounded bg-black/50 border border-white/10 shrink-0 overflow-hidden relative">
          <img src={currentSong.art_url} alt={currentSong.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          {isPlaying && (
            <div className="absolute inset-0 border-2 border-primary rounded animate-pulse shadow-[inset_0_0_10px_var(--primary)] pointer-events-none" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm truncate text-white">{currentSong.title}</span>
          <span className="text-xs text-text/70 truncate">{currentSong.artist}</span>
        </div>
      </Link>

      <div className="flex items-center gap-4 shrink-0 pr-2">
        <button 
          onClick={(e) => { e.preventDefault(); playPrevious(); }}
          className="text-text/70 hover:text-white transition-colors"
        >
          <SkipBack size={20} className="fill-current" />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); setIsPlaying(!isPlaying); }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isPlaying ? 'bg-primary/20 text-primary border border-primary neon-glow' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-1" />}
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); playNext(); }}
          className="text-text/70 hover:text-white transition-colors"
        >
          <SkipForward size={20} className="fill-current" />
        </button>
      </div>
    </div>
  );
}
