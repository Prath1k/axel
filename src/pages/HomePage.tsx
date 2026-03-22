import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import { fetchSongs, fetchFeaturedSong, type Song } from '../supabase/songs';
import { Play, TrendingUp, Clock, Hash } from 'lucide-react';

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
      <div className="h-full flex flex-col items-center justify-center text-brand-muted">
         <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping mb-4" />
         <p className="font-bold text-sm tracking-widest">LOADING CONTENT</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-12">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-6xl font-[900] tracking-tighter mb-2">Welcome</h1>
          <p className="text-brand-muted text-xl font-medium">Hello, {user?.email?.split('@')[0]}. Here's what's new.</p>
        </div>
        <div className="hidden md:block w-16 h-16 bg-secondary rounded-[1.5rem] border border-border"></div>
      </header>
      
      <section className="space-y-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <TrendingUp className="text-primary" size={24} /> Featured Today
        </h2>
        {featured ? (
          <div className="relative h-80 rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl border border-white/10" onClick={() => handlePlay(featured)}>
            <img src={featured.art_url} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <div className="flex items-end justify-between w-full">
                <div className="space-y-2">
                  <span className="px-4 py-1 bg-white/10 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-widest rounded-full border border-white/20">
                    {featured.genre || 'TRENDING'}
                  </span>
                  <h3 className="text-5xl font-extrabold text-white tracking-tighter">{featured.title}</h3>
                  <p className="text-white/70 text-lg font-medium">{featured.artist}</p>
                </div>
                <button 
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${currentSong?.id === featured.id ? 'bg-white text-primary' : 'bg-primary text-bg hover:scale-110 active:scale-95'}`}
                >
                  <Play size={28} fill="currentColor" className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 rounded-3xl bg-secondary border border-border flex items-center justify-center">
            <span className="text-brand-muted font-bold">New tracks incoming</span>
          </div>
        )}
      </section>
      
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Clock className="text-primary" size={24} /> Recently Played
          </h2>
          <button className="text-primary font-bold text-sm hover:underline">See all</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {recent.map((song) => (
            <div key={song.id} className="space-y-4 group cursor-pointer" onClick={() => handlePlay(song)}>
              <div className="aspect-square bg-secondary rounded-[1.8rem] overflow-hidden shadow-sm border border-border relative group-hover:shadow-xl transition-all duration-500">
                <img src={song.art_url} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="text-white w-12 h-12 fill-current" />
                </div>
              </div>
              <div className="px-1">
                <h4 className="font-extrabold text-sm truncate tracking-tight group-hover:text-primary transition-colors">{song.title}</h4>
                <p className="text-xs text-brand-muted font-bold mt-0.5">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="space-y-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Hash className="text-primary" size={24} /> Explore Tags
        </h2>
        <div className="flex flex-wrap gap-3">
          {['Pop', 'Synthwave', 'Alternative', 'Focus', 'Electronic', 'Chill', 'Lo-Fi', 'Night', 'Classical'].map(tag => (
            <button key={tag} className="px-6 py-3 bg-secondary rounded-2xl border border-border font-bold text-sm text-brand-muted hover:bg-primary hover:text-bg hover:border-primary transition-all shadow-sm">
              {tag}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
