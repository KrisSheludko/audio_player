export interface UserProfile {
  username: string;
  email?: string;
  joinDate?: string;
  favoritesCount?: number;
  tracksCount?: number;
  playlistsCount?: number;
}

export interface User {
  username: string;
  email?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  size_mb?: number;
  type?: 'music' | 'podcast';
  description?: string;
  cover?: string;
  isFavorite?: boolean;
  encoded_audio?: string;
}

export interface TrackDetails extends Track {
  album?: string;
  genre?: string;
  year?: number;
  bitrate?: number;
  file_format?: string;
  lyrics?: string;
  plays_count?: number;
  upload_date?: string;
}

export interface PodcastDetails extends Track {
  episodes_count?: number;
  category?: string;
  host?: string;
  total_duration?: number;
  language?: string;
  explicit?: boolean;
  website?: string;
}

export interface AuthData {
  username: string;
  email?: string;
  password: string;
}

export interface AppState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
}