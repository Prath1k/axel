import { supabase } from './client';
import type { Song } from './songs';

export type Playlist = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export const fetchPlaylists = async (userId: string): Promise<Playlist[]> => {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createPlaylist = async (userId: string, name: string): Promise<Playlist> => {
  const { data, error } = await supabase
    .from('playlists')
    .insert({ user_id: userId, name })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const addSongToPlaylist = async (playlistId: string, songId: string) => {
  const { error } = await supabase
    .from('playlist_songs')
    .insert({ playlist_id: playlistId, song_id: songId });
  if (error) throw error;
};

export const fetchPlaylistSongs = async (playlistId: string): Promise<Song[]> => {
  const { data, error } = await supabase
    .from('playlist_songs')
    .select('songs(*)')
    .eq('playlist_id', playlistId);
  if (error) throw error;
  return data?.map((row: any) => row.songs as Song) || [];
};
