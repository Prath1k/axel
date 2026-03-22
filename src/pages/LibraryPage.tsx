import React, { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import { fetchSongs, type Song } from '../supabase/songs';
import { fetchPlaylists, type Playlist } from '../supabase/playlists';
import * as ReactWindow from 'react-window';
const FixedSizeList = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList;
import { Heart, Disc3 } from 'lucide-react';

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
        className={`flex items-center gap-4 px-4 py-2 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${isActive ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
        onClick={() => handlePlay(song)}
      >
        <div className="w-10 h-10 shrink-0 rounded overflow-hidden relative border border-white/10">
          <img src={song.art_url} alt={song.title} className="w-full h-full object-cover" />
          {isActive && <div className="absolute inset-0 bg-primary/30 animate-pulse"></div>}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold truncate ${isActive ? 'text-primary' : 'text-text'}`}>{song.title}</p>
          <p className="text-xs text-text/50 font-mono truncate tracking-wide">{song.artist}</p>
        </div>
        <button className="text-text/30 hover:text-primary transition-colors p-2" onClick={(e) => { e.stopPropagation(); }}>
          <Heart size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-neon-glow text-primary font-mono tracking-widest">// DATA_BANK</h1>
      
      <div className="flex gap-1 bg-black/30 p-1 rounded-lg mb-6 border border-white/10 shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
        {['songs', 'artists', 'playlists'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 text-[10px] md:text-xs font-mono tracking-widest uppercase rounded-md transition-all ${
              activeTab === tab 
                ? 'bg-primary text-white shadow-[0_0_10px_var(--primary)]' 
                : 'text-text/70 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="mb-4 shrink-0">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH_INDEX..." 
          className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-primary font-mono text-sm text-white transition-colors placeholder:text-text/30 shadow-inner"
        />
      </div>
      
      {/* 
        Using a fixed height Container for FixedSizeList since AutoSizer isn't available. 
        In a real app with flex layout we'd dynamically measure the parent. 
      */}
      <div className="flex-1 border border-white/5 rounded-xl glass bg-black/40 overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
        {loading ? (
          <div className="h-full flex items-center justify-center font-mono text-primary text-sm animate-pulse">
            LOADING_DATA...
          </div>
        ) : activeTab === 'songs' ? (
          filteredSongs.length > 0 ? (
            <div className="h-full w-full">
               {FixedSizeList ? (
                 <FixedSizeList
                    height={600}
                    width="100%"
                    itemCount={filteredSongs.length}
                    itemSize={64}
                    className="hide-scrollbar"
                 >
                   {SongRow}
                 </FixedSizeList>
               ) : (
                 <div className="h-[600px] overflow-auto hide-scrollbar">
                   {filteredSongs.map((_, i) => <SongRow key={i} index={i} style={{}} />)}
                 </div>
               )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-text/50 font-mono text-sm p-10">
              <span className="block mb-4"><Disc3 size={40} className="mx-auto opacity-20" /></span>
              NO_RECORDS_FOUND
            </div>
          )
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-text/50 font-mono text-sm p-10">
            MODULE_OFFLINE
          </div>
        )}
      </div>
    </div>
  );
}
