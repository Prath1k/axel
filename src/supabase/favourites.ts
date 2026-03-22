import { supabase } from './client';
import type { Song } from './songs';

export const fetchFavourites = async (userId: string): Promise<Song[]> => {
  const { data, error } = await supabase
    .from('favourites')
    .select('songs(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return data?.map((row: any) => row.songs as Song) || [];
};

export const addFavourite = async (userId: string, songId: string) => {
  const { error } = await supabase
    .from('favourites')
    .insert({ user_id: userId, song_id: songId });
  if (error) throw error;
};

export const removeFavourite = async (userId: string, songId: string) => {
  const { error } = await supabase
    .from('favourites')
    .delete()
    .eq('user_id', userId)
    .eq('song_id', songId);
  if (error) throw error;
};

export const checkIsFavourite = async (userId: string, songId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('favourites')
    .select('id')
    .eq('user_id', userId)
    .eq('song_id', songId)
    .single();
  
  if (error && error.code === 'PGRST116') return false;
  if (error) throw error;
  return !!data;
};
