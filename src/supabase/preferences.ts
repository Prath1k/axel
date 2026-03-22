import { supabase } from './client';

export type UserPreferences = {
  theme: string;
  visualizer: string;
};

export const fetchUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  const { data, error } = await supabase
    .from('preferences')
    .select('theme, visualizer')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
};

export const updateUserPreferences = async (userId: string, updates: Partial<UserPreferences>) => {
  const { error } = await supabase
    .from('preferences')
    .update(updates)
    .eq('user_id', userId);
  
  if (error) throw error;
};
