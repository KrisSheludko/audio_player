import type { Track } from '../types/index';

export class TrackDataService {
  generateMockTracks(): Track[] {
    return [
      { id: "1", title: "Eternal Sunset", artist: "Skyline Sounds", duration: 336, type: 'music', isFavorite: false },
      { id: "2", title: "City Nights", artist: "Urban Beats", duration: 264, type: 'music', isFavorite: false },
      { id: "3", title: "Ocean Breeze", artist: "Deep Wave", duration: 235, type: 'music', isFavorite: false },
      { id: "4", title: "Morning Dew", artist: "Fresh Air", duration: 507, type: 'music', isFavorite: false },
      { id: "5", title: "Starlit Road", artist: "Cosmic Rhythms", duration: 132, type: 'music', isFavorite: false },
      { id: "6", title: "Midnight Escape", artist: "Nightfall", duration: 313, type: 'music', isFavorite: false },
      { id: "7", title: "Electric Heart", artist: "Volt Sparks", duration: 411, type: 'music', isFavorite: false },
      { id: "8", title: "Sunrise Over The City", artist: "Dawn Architects", duration: 297, type: 'music', isFavorite: false },
      { id: "9", title: "Lost in the Echo", artist: "Wave Form", duration: 456, type: 'music', isFavorite: false },
      { id: "10", title: "Neon Pulse", artist: "Urban Vibes", duration: 232, type: 'music', isFavorite: false }
    ];
  }

  generateMockPodcasts(): Track[] {
    return [
      {
        id: "podcast-1",
        title: "Технологии будущего",
        artist: "IT Подкаст",
        type: 'podcast',
        duration: 3600,
        description: 'Обсуждение новых технологий',
        isFavorite: false
      },
      {
        id: "podcast-2",
        title: "Истории успеха",
        artist: "Бизнес Подкаст",
        type: 'podcast',
        duration: 2700,
        description: 'Интервью с предпринимателями',
        isFavorite: false
      },
      {
        id: "podcast-3",
        title: "Наука и технологии",
        artist: "Science Talk",
        type: 'podcast',
        duration: 3200,
        description: 'Научные открытия',
        isFavorite: false
      }
    ];
  }
}