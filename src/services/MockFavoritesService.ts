import type { Track } from '../types/index';

export class MockFavoritesService {
  private favorites: Map<string, string[]> = new Map();

  async getFavorites(username: string): Promise<Track[]> {
    await this.delay(200);
    const userFavorites = this.favorites.get(username) || [];
    const allTracks = this.generateMockTracks();
    return allTracks.filter(track => userFavorites.includes(track.id));
  }

  async addToFavorites(username: string, trackId: string): Promise<{ message: string }> {
    await this.delay(200);
    const userFavorites = this.favorites.get(username) || [];
    if (!userFavorites.includes(trackId)) {
      userFavorites.push(trackId);
      this.favorites.set(username, userFavorites);
    }
    return { message: "композиция добавлена в избранное" };
  }

  async removeFromFavorites(username: string, trackId: string): Promise<{ message: string }> {
    await this.delay(200);
    const userFavorites = this.favorites.get(username) || [];
    const index = userFavorites.indexOf(trackId);
    if (index > -1) {
      userFavorites.splice(index, 1);
      this.favorites.set(username, userFavorites);
    }
    return { message: "композиция убрана из избранного" };
  }

  private generateMockTracks(): Track[] {
    return [
      { id: "1", title: "Eternal Sunset", artist: "Skyline Sounds", duration: 336, type: 'music', isFavorite: false },
      { id: "2", title: "City Nights", artist: "Urban Beats", duration: 264, type: 'music', isFavorite: false },
      { id: "3", title: "Ocean Breeze", artist: "Deep Wave", duration: 235, type: 'music', isFavorite: false },
      { id: "4", title: "Morning Dew", artist: "Fresh Air", duration: 507, type: 'music', isFavorite: false },
      { id: "5", title: "Starlit Road", artist: "Cosmic Rhythms", duration: 132, type: 'music', isFavorite: false },
      { id: "6", title: "Midnight Escape", artist: "Nightfall", duration: 313, type: 'music', isFavorite: false },
      { id: "7", title: "Electric Heart", artist: "Volt Sparks", duration: 411, type: 'music', isFavorite: false },
      { id: "8", title: "Sunrise Over The City", artist: "Dawn Architects", duration: 297, type: 'music', isFavorite: false }
    ];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockFavoritesService = new MockFavoritesService();