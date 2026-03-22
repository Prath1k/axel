import { supabase } from './client';

export type Song = {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  art_url: string;
  genre: string | null;
  duration: number | null;
};

export const fetchSongs = async (): Promise<Song[]> => {
  const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const fetchFeaturedSong = async (): Promise<Song | null> => {
  const { data, error } = await supabase.from('songs').select('*').limit(1).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
};
