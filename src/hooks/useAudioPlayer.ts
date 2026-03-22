import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { usePlayerStore } from '../store/playerStore';

export const audioAnalyser = {
  analyser: null as AnalyserNode | null,
  dataArray: null as Uint8Array | null,
};

export const initAnalyser = () => {
  if (!audioAnalyser.analyser && Howler.ctx) {
    const analyser = Howler.ctx.createAnalyser();
    analyser.fftSize = 128;
    // MasterGain is the final output of Howler
    Howler.masterGain.connect(analyser);
    audioAnalyser.analyser = analyser;
    audioAnalyser.dataArray = new Uint8Array(analyser.frequencyBinCount);
  }
};

export function useAudioPlayer() {
  const { 
    currentSong, 
    isPlaying, 
    volume,
    setIsPlaying, 
    setProgress, 
    setDuration, 
    playNext 
  } = usePlayerStore();
  
  const soundRef = useRef<Howl | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }

    if (!currentSong) {
      setIsPlaying(false);
      return;
    }

    const sound = new Howl({
      src: [currentSong.audio_url],
      format: ['mp3', 'wav', 'ogg'],
      volume,
      html5: false, // Required false for Web Audio API visualizers via Howler.masterGain
      onplay: () => {
        initAnalyser();
        setIsPlaying(true);
        setDuration(sound.duration());
        const updateProgress = () => {
          setProgress(sound.seek() as number);
          rafRef.current = requestAnimationFrame(updateProgress);
        };
        rafRef.current = requestAnimationFrame(updateProgress);
      },
      onpause: () => {
        setIsPlaying(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      },
      onend: () => {
        setIsPlaying(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        playNext();
      },
      onloaderror: () => setIsPlaying(false),
      onplayerror: () => {
        sound.once('unlock', () => sound.play());
      }
    });

    soundRef.current = sound;
    
    if (isPlaying) {
      sound.play();
    }

    return () => {
      sound.unload();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentSong?.id]);

  useEffect(() => {
    if (!soundRef.current) return;
    
    if (isPlaying && !soundRef.current.playing()) {
      soundRef.current.play();
    } else if (!isPlaying && soundRef.current.playing()) {
      soundRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const seekTo = (seconds: number) => {
    if (soundRef.current) {
      soundRef.current.seek(seconds);
      setProgress(seconds);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return { seekTo, togglePlay, sound: soundRef.current };
}
