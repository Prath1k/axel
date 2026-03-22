import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import { fetchSongs, fetchFeaturedSong, type Song } from '../supabase/songs';
import { Play } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuthStore();
  const { setCurrentSong, setQueue, setIsPlaying, currentSong } = usePlayerStore();
  const [featured, setFeatured] = useState<Song | null>(null);
  const [recent, setRecent] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const feat = await fetchFeaturedSong();
        const all = await fetchSongs();
        setFeatured(feat);
        setRecent(all.slice(0, 5));
        setQueue(all);
      } catch (err) {
        console.error('Failed to load songs', err);
      } finally {
        setLoading(false);
      }
    };
    loadSongs();
  }, [setQueue]);

  const handlePlay = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  if (loading) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_var(--primary)] mb-4"></div>
        <p className="font-mono text-primary text-sm tracking-widest animate-pulse">SCANNING_DATA...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="mb-10">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary drop-shadow-[0_0_10px_var(--primary)] pb-2 tracking-tighter">
          AXEL_OS
        </h1>
        <p className="text-text/70 text-sm font-mono mt-1 border-l-2 border-primary pl-2 uppercase">
          USER: {user?.email?.split('@')[0]}
        </p>
      </header>
      
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 font-mono tracking-widest text-text">
          <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] inline-block"></span>
          FEATURED_STREAM
        </h2>
        {featured ? (
          <div className="glass h-64 rounded-2xl border border-primary/30 p-6 flex flex-col justify-end relative overflow-hidden group hover:border-primary/60 transition-all shadow-[0_5px_20px_rgba(0,0,0,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>
            <img src={featured.art_url} alt={featured.title} className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700 pointer-events-none opacity-80" />
            
            <div className="z-20 w-full flex justify-between items-end">
              <div className="max-w-[70%]">
                <span className="px-2 py-0.5 border border-primary/80 bg-black/50 text-[10px] text-primary font-mono uppercase rounded-full mb-2 inline-block backdrop-blur-sm shadow-[0_0_5px_var(--primary)_inset]">
                  {featured.genre || 'SYNTHWAVE'}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-white text-neon-glow mb-1 truncate">{featured.title}</h3>
                <p className="text-white/80 font-mono text-sm uppercase tracking-wide">{featured.artist}</p>
              </div>
              <button 
                onClick={() => handlePlay(featured)}
                className={`w-14 h-14 rounded-full text-white flex items-center justify-center transition-transform shadow-[0_0_20px_var(--primary)] ${currentSong?.id === featured.id ? 'bg-secondary' : 'bg-primary hover:scale-110'}`}
              >
                <Play size={24} className="fill-current ml-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="glass h-64 rounded-2xl border border-white/10 flex items-center justify-center">
            <span className="text-text/50 font-mono tracking-widest">NO_FEATURED_DATA</span>
          </div>
        )}
      </section>
      
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 font-mono tracking-widest text-text">
          <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_var(--secondary)] inline-block"></span>
          RECENT_ACCESS
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x pt-2 px-2 -mx-2">
          {recent.map((song) => (
            <div key={song.id} className="min-w-[140px] max-w-[140px] snap-center group cursor-pointer" onClick={() => handlePlay(song)}>
              <div className="w-[140px] h-[140px] glass rounded-xl mb-3 border border-white/10 group-hover:border-secondary transition-all relative overflow-hidden shadow-lg group-hover:shadow-[0_0_15px_var(--secondary)]">
                <img src={song.art_url} alt={song.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="text-white w-10 h-10 fill-current drop-shadow-[0_0_10px_white]" />
                </div>
              </div>
              <p className="text-sm font-bold truncate text-text group-hover:text-secondary transition-colors">{song.title}</p>
              <p className="text-xs text-text/50 truncate font-mono mt-0.5">{song.artist}</p>
            </div>
          ))}
          {recent.length === 0 && (
            <span className="text-sm font-mono text-text/50 pl-2">NO_DATA_FOUND</span>
          )}
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 font-mono tracking-widest text-text">
          <span className="w-2 h-2 rounded-full bg-white/50 shadow-[0_0_8px_white] inline-block"></span>
          SYSTEM_TAGS
        </h2>
        <div className="flex flex-wrap gap-2">
          {['SYNTHWAVE', 'CYBERPUNK', 'RETRO', 'VAPORWAVE', 'CHILL', 'DRIVE', 'OUTRUN', 'NEON'].map(tag => (
            <span key={tag} className="px-4 py-1.5 glass text-xs font-mono rounded-full border border-white/10 hover:border-text cursor-pointer transition-colors text-text/70 hover:text-bg hover:bg-text shadow-sm">
              #{tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
