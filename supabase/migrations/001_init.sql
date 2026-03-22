-- Create songs table
CREATE TABLE songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  audio_url text NOT NULL,
  art_url text NOT NULL,
  genre text,
  duration integer,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Create preferences table
CREATE TABLE preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  theme text DEFAULT 'retro',
  visualizer text DEFAULT 'vinyl',
  updated_at timestamptz DEFAULT now()
);

-- Create playlists table
CREATE TABLE playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create playlist_songs table
CREATE TABLE playlist_songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE,
  song_id uuid REFERENCES songs(id) ON DELETE CASCADE
);

-- Create favourites table
CREATE TABLE favourites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  song_id uuid REFERENCES songs(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- PostgREST Policies

-- Songs: readable by authenticated users
CREATE POLICY "Songs are viewable by auth users" ON songs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Profiles: user can access their own rows
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Preferences: user can access their own rows
CREATE POLICY "Users can insert their own preferences" ON preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON preferences
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own preferences" ON preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Playlists
CREATE POLICY "Users can insert their own playlists" ON playlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own playlists" ON playlists
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own playlists" ON playlists
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own playlists" ON playlists
  FOR DELETE USING (auth.uid() = user_id);

-- Playlist Songs
CREATE POLICY "Users can manage playlist_songs" ON playlist_songs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

-- Favourites
CREATE POLICY "Users can insert their own favourites" ON favourites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own favourites" ON favourites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favourites" ON favourites
  FOR DELETE USING (auth.uid() = user_id);
