import React from 'react';
import { usePlayerStore } from '../../store/playerStore';

export default function VinylRenderer() {
  const { currentSong, isPlaying } = usePlayerStore();
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className={`relative w-[80%] h-[80%] rounded-full bg-black flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
        {/* Grooves */}
        <div className="absolute inset-0 rounded-full border-[1px] border-white/10 m-2"></div>
        <div className="absolute inset-0 rounded-full border-[2px] border-white/5 m-4"></div>
        <div className="absolute inset-0 rounded-full border-[1px] border-white/10 m-6"></div>
        <div className="absolute inset-0 rounded-full border-[2px] border-white/5 m-8"></div>
        <div className="absolute inset-0 rounded-full border-[1px] border-white/10 m-10"></div>
        <div className="absolute inset-0 rounded-full border-[2px] border-white/5 m-12"></div>
        <div className="absolute inset-0 rounded-full border-[1px] border-white/10 m-16"></div>
        
        {/* Label and Album Art */}
        <div className="w-1/3 h-1/3 rounded-full bg-bg flex items-center justify-center z-10 overflow-hidden relative border-2 border-primary/80 shadow-[0_0_15px_var(--primary)]">
          {currentSong?.art_url ? (
            <img src={currentSong.art_url} alt="Album Art" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary"></div>
          )}
          {/* Spindle hole */}
          <div className="absolute w-3 h-3 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] z-20"></div>
        </div>
      </div>
    </div>
  );
}
