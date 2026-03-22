import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { audioAnalyser } from '../../hooks/useAudioPlayer';

export default function Mp3Renderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying } = usePlayerStore();
  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderFrame = () => {
      if (!ctx || !canvas) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      const barCount = 20;
      const barPadding = 4;
      const barWidth = (width - (barCount * barPadding)) / barCount;
      
      if (!audioAnalyser.analyser || !audioAnalyser.dataArray || !isPlaying) {
        // Draw resting state
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + barPadding);
          const barHeight = 4; 
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        }
        if (isPlaying) reqRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      // Read real-time frequency data
      audioAnalyser.analyser.getByteFrequencyData(audioAnalyser.dataArray as any);
      
      const step = Math.floor(audioAnalyser.dataArray.length / barCount);
      
      for (let i = 0; i < barCount; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += audioAnalyser.dataArray[i * step + j];
        }
        const avg = sum / step;
        
        const percent = avg / 255;
        const barHeight = Math.max(percent * height * 0.9, 4);
        
        const x = i * (barWidth + barPadding);
        
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00FF41';
        
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, '#ffffff');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, height - barHeight - 2, barWidth, 2);
      }
      
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      for(let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 2);
      }

      reqRef.current = requestAnimationFrame(renderFrame);
    };

    if (isPlaying) {
      renderFrame();
    } else {
      renderFrame();
    }

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full h-full max-w-sm max-h-48 border-[3px] border-white/10 hover:border-primary/50 rounded-lg p-2 bg-[#0a0a0a]/90 relative shadow-[0_0_20px_rgba(0,0,0,0.5)_inset] transition-colors duration-500">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={150} 
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_var(--primary)]"
        />
        <div className="absolute top-2 right-2 text-[8px] font-mono text-white/40 uppercase tracking-widest border border-white/10 px-1 rounded bg-black/50">
          SPCTR-ANLYZR
        </div>
      </div>
    </div>
  );
}
