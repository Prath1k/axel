import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';
import { Headphones } from 'lucide-react';

export default function HeadphonesRenderer() {
  const { isPlaying } = usePlayerStore();
  const [pulses, setPulses] = useState<number[]>([]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setPulses(prev => [...prev.slice(-3), Date.now()]);
    }, 600);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Expanding rings */}
      {pulses.map((pulse) => (
        <motion.div
          key={pulse}
          initial={{ width: 60, height: 60, opacity: 0.8, borderWidth: 4 }}
          animate={{ width: 300, height: 300, opacity: 0, borderWidth: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute rounded-full border-primary shadow-[0_0_20px_var(--primary)_inset] pointer-events-none"
        />
      ))}
      {pulses.map((pulse) => (
        <motion.div
          key={`${pulse}-secondary`}
          initial={{ width: 60, height: 60, opacity: 0.5, borderWidth: 2 }}
          animate={{ width: 400, height: 400, opacity: 0, borderWidth: 0 }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
          className="absolute rounded-full border-secondary shadow-[0_0_30px_var(--secondary)_inset] pointer-events-none"
        />
      ))}

      {/* Center Icon */}
      <div className="z-10 w-24 h-24 rounded-full glass border border-white/20 flex items-center justify-center shadow-[0_0_30px_var(--bg)] bg-bg/80 relative">
        <Headphones size={48} className={isPlaying ? "text-primary neon-glow" : "text-text/50"} />
        {isPlaying && (
          <div className="absolute inset-0 rounded-full border border-primary animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50 pointer-events-none"></div>
        )}
      </div>
    </div>
  );
}
