import React, { useEffect } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useThemeStore } from '../store/themeStore';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat } from 'lucide-react';
import VinylRenderer from '../components/visualizers/VinylRenderer';
import HeadphonesRenderer from '../components/visualizers/HeadphonesRenderer';
import Mp3Renderer from '../components/visualizers/Mp3Renderer';

export default function PlayerPage() {
  const { 
    currentSong, 
    isPlaying, 
    setIsPlaying, 
    progress, 
    duration, 
    playNext, 
    playPrevious,
    isShuffle,
    isRepeat,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();
  
  const { visualizer } = useThemeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, setIsPlaying]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderVisualizer = () => {
    switch (visualizer) {
      case 'headphones': return <HeadphonesRenderer />;
      case 'mp3': return <Mp3Renderer />;
      case 'vinyl':
      default: return <VinylRenderer />;
    }
  };

  if (!currentSong) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center p-6 relative">
        <h1 className="text-2xl font-bold font-mono tracking-widest text-primary mb-10 text-neon-glow uppercase">
          NO_SIGNAL
        </h1>
        <div className="w-64 h-64 border-4 border-primary/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(233,69,96,0.1)]">
          <span className="text-4xl animate-pulse grayscale">📡</span>
        </div>
        <p className="mt-8 text-text/50 font-mono tracking-widest text-sm">AWAITING_INPUT_STREAM...</p>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4 relative pt-10 overflow-hidden">
      {/* Dynamic blurred background taking primary color hints */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none opacity-50" />
      
      <h1 className="text-xl font-bold font-mono tracking-widest text-primary mb-8 text-neon-glow uppercase">
        ACTIVE_STREAM
      </h1>
      
      <div className="w-64 h-64 md:w-80 md:h-80 mb-8 flex items-center justify-center relative z-10">
        {renderVisualizer()}
      </div>
      
      <div className="text-center mb-6 w-full max-w-md px-4 z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-1 truncate text-neon-glow leading-tight">{currentSong.title}</h2>
        <p className="text-text/70 text-base font-mono truncate uppercase tracking-wider">{currentSong.artist}</p>
      </div>
      
      <div className="w-full max-w-md glass p-6 rounded-2xl border border-white/10 mt-auto mb-6 shadow-2xl relative z-10 backdrop-blur-xl bg-card/60">
        <div className="flex justify-between items-center mb-4 text-xs font-mono text-text/70">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <div className="w-full h-2 bg-black/60 rounded-full mb-8 relative border border-white/5 overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full bg-black"></div>
          <div className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_var(--primary)] transition-all ease-linear" style={{ width: `${progressPercent}%` }}></div>
        </div>
        
        <div className="flex justify-between items-center px-4 md:px-6">
          <button onClick={toggleShuffle} className={`transition-all ${isShuffle ? 'text-primary drop-shadow-[0_0_5px_var(--primary)]' : 'text-text/50 hover:text-white hover:scale-110'}`}>
            <Shuffle size={20} />
          </button>
          
          <div className="flex items-center gap-6 md:gap-8">
            <button onClick={playPrevious} className="text-text hover:text-primary transition-all hover:-translate-x-1 outline-none">
              <SkipBack size={28} className="fill-current" />
            </button>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_0_20px_var(--primary)] hover:scale-105 transition-all outline-none group"
            >
              {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
            </button>
            
            <button onClick={playNext} className="text-text hover:text-primary transition-all hover:translate-x-1 outline-none">
              <SkipForward size={28} className="fill-current" />
            </button>
          </div>

          <button onClick={toggleRepeat} className={`transition-all ${isRepeat ? 'text-primary drop-shadow-[0_0_5px_var(--primary)]' : 'text-text/50 hover:text-white hover:scale-110'}`}>
            <Repeat size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
