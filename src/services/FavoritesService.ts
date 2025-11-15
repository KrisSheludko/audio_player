import { TrackDataService } from './TrackDataService.js';
import type { Track } from '../types/index';

export class FavoritesService {
  private trackDataService: TrackDataService;

  constructor() {
    this.trackDataService = new TrackDataService();
  }

  async getFavorites(): Promise<Track[]> {
    await this.delay(200);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userFavorites = this.getUserFavorites(user.username) || [];
    const allTracks = this.trackDataService.generateMockTracks();
    const allPodcasts = this.trackDataService.generateMockPodcasts();
    const allItems = [...allTracks, ...allPodcasts];

    return allItems
      .filter(item => userFavorites.includes(item.id))
      .map(item => ({ ...item, isFavorite: true }));
  }

  async addToFavorites(trackId: string): Promise<{ message: string }> {
    await this.delay(200);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userFavorites = this.getUserFavorites(user.username) || [];

    if (!userFavorites.includes(trackId)) {
      userFavorites.push(trackId);
      this.saveUserFavorites(user.username, userFavorites);
    }

    return { message: "композиция добавлена в избранное" };
  }

  async removeFromFavorites(trackId: string): Promise<{ message: string }> {
    await this.delay(200);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userFavorites = this.getUserFavorites(user.username) || [];
    const index = userFavorites.indexOf(trackId);

    if (index > -1) {
      userFavorites.splice(index, 1);
      this.saveUserFavorites(user.username, userFavorites);
    }

    return { message: "композиция убрана из избранного" };
  }

  private getUserFavorites(username: string): string[] {
    try {
      const favoritesData = localStorage.getItem('user-favorites');
      if (favoritesData) {
        const allFavorites = JSON.parse(favoritesData);
        return allFavorites[username] || [];
      }
    } catch (error) {
    }
    return [];
  }

  private saveUserFavorites(username: string, favorites: string[]): void {
    try {
      const favoritesData = localStorage.getItem('user-favorites');
      const allFavorites = favoritesData ? JSON.parse(favoritesData) : {};
      allFavorites[username] = favorites;
      localStorage.setItem('user-favorites', JSON.stringify(allFavorites));
    } catch (error) {
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}