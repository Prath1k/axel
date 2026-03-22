import React from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MiniPlayer() {
  const { currentSong, isPlaying, setIsPlaying, playNext, playPrevious, progress, duration } = usePlayerStore();

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="glass rounded-3xl p-3 md:p-4 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-border/40 group overflow-hidden">
      <Link to="/player" className="flex items-center gap-4 flex-1 min-w-0 group/info">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0 group-hover/info:scale-105 transition-transform duration-500">
          <img src={currentSong.art_url} alt={currentSong.title} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-sm truncate tracking-tight">{currentSong.title}</h4>
          <p className="text-xs text-brand-muted truncate">{currentSong.artist}</p>
        </div>
      </Link>

      <div className="flex flex-col items-center gap-1 flex-1 px-4 lg:px-8">
        <div className="flex items-center gap-6">
          <button onClick={playPrevious} className="text-brand-muted hover:text-text transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 bg-primary text-bg rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={playNext} className="text-brand-muted hover:text-text transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
        
        {/* Progress Bar (Integrated) */}
        <div className="w-full max-w-[200px] h-1 bg-secondary rounded-full mt-1 overflow-hidden">
          <div 
            className="h-full bg-primary/40 rounded-full transition-all ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 flex-1 justify-end text-brand-muted pr-4">
        <Volume2 size={18} className="hover:text-text transition-colors" />
        <div className="w-20 lg:w-32 h-1 bg-secondary rounded-full overflow-hidden flex-shrink-0">
          <div className="w-2/3 h-full bg-primary/20 rounded-full"></div>
        </div>
        <Link to="/player">
          <Maximize2 size={16} className="hover:text-primary transition-colors ml-2" />
        </Link>
      </div>
    </div>
  );
}
