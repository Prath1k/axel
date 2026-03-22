import { createClient } from '@supabase/supabase-js';

// Fallbacks are empty strings to prevent hard crashes during dev setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
