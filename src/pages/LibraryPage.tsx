import React, { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import { fetchSongs, type Song } from '../supabase/songs';
import { fetchPlaylists, type Playlist } from '../supabase/playlists';
import * as ReactWindow from 'react-window';
const FixedSizeList = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList;
import { Heart, Search, ListMusic, Mic2, Disc } from 'lucide-react';

export default function LibraryPage() {
  const { user } = useAuthStore();
  const { setCurrentSong, setQueue, setIsPlaying, currentSong } = usePlayerStore();
  const [activeTab, setActiveTab] = useState<'songs' | 'artists' | 'playlists'>('songs');
  const [search, setSearch] = useState('');
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const s = await fetchSongs();
        setSongs(s);
        if (user) {
          const p = await fetchPlaylists(user.id);
          setPlaylists(p);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const filteredSongs = useMemo(() => {
    return songs.filter(s => 
      s.title.toLowerCase().includes(search.toLowerCase()) || 
      s.artist.toLowerCase().includes(search.toLowerCase())
    );
  }, [songs, search]);

  const handlePlay = (song: Song) => {
    setQueue(filteredSongs);
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const SongRow = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const song = filteredSongs[index];
    const isActive = currentSong?.id === song.id;
    return (
      <div 
        style={style} 
        className={`flex items-center gap-5 px-6 py-3 border-b border-border/50 cursor-pointer hover:bg-secondary/50 transition-all ${isActive ? 'bg-primary/5' : ''}`}
        onClick={() => handlePlay(song)}
      >
        <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden shadow-sm relative border border-border">
          <img src={song.art_url} alt={song.title} className="w-full h-full object-cover" />
          {isActive && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold truncate tracking-tight ${isActive ? 'text-primary' : 'text-text'}`}>{song.title}</p>
          <p className="text-xs text-brand-muted font-medium truncate">{song.artist}</p>
        </div>
        <button className="text-brand-muted hover:text-red-500 transition-colors p-2" onClick={(e) => { e.stopPropagation(); }}>
          <Heart size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <header className="mb-10 space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tighter">Library</h1>
        
        <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
          <div className="flex gap-1 bg-secondary/80 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm self-start">
            {[
              { id: 'songs', label: 'Songs', icon: Disc },
              { id: 'artists', label: 'Artists', icon: Mic2 },
              { id: 'playlists', label: 'Playlists', icon: ListMusic },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-[14px] transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-bg shadow-md' 
                    : 'text-brand-muted hover:text-text'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in library..." 
              className="w-full bg-secondary/50 border border-border/60 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary font-medium text-sm transition-all"
            />
          </div>
        </div>
      </header>
      
      <div className="flex-1 bg-white dark:bg-black rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-brand-muted font-bold text-sm">
             <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping mr-3" />
             LOADING LIBRARY
          </div>
        ) : activeTab === 'songs' ? (
          filteredSongs.length > 0 ? (
            <div className="flex-1 w-full">
               {FixedSizeList ? (
                 <FixedSizeList
                    height={800}
                    width="100%"
                    itemCount={filteredSongs.length}
                    itemSize={76}
                    className="hide-scrollbar"
                 >
                   {SongRow}
                 </FixedSizeList>
               ) : (
                 <div className="overflow-auto hide-scrollbar">
                    {filteredSongs.map((_, i) => <SongRow key={i} index={i} style={{}} />)}
                 </div>
               )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-brand-muted p-10 space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                <Search size={32} className="opacity-20" />
              </div>
              <p className="font-bold">No tracks found</p>
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-brand-muted p-10 space-y-4">
             <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                <ListMusic size={32} className="opacity-20" />
              </div>
              <p className="font-bold">Module coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
