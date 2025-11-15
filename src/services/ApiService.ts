import { AuthService } from './AuthService.js';
import { MediaService } from './MediaService.js';
import { FavoritesService } from './FavoritesService.js';
import type { AuthData, User, Track } from '../types/index.js';

class ApiService {
  private authService: AuthService;
  private mediaService: MediaService;
  private favoritesService: FavoritesService;

  constructor() {
    this.authService = new AuthService();
    this.mediaService = new MediaService();
    this.favoritesService = new FavoritesService();
  }

  async register(userData: AuthData): Promise<{ message: string; user: User }> {
    return this.authService.register(userData);
  }

  async login(userData: AuthData): Promise<{ message: string; token: string; user: User }> {
    return this.authService.login(userData);
  }

  async getTracks(): Promise<Track[]> {
    return this.mediaService.getTracks();
  }

  async getPodcasts(): Promise<Track[]> {
    return this.mediaService.getPodcasts();
  }

  async getFavorites(): Promise<Track[]> {
    return this.favoritesService.getFavorites();
  }

  async addToFavorites(trackId: string): Promise<{ message: string }> {
    return this.favoritesService.addToFavorites(trackId);
  }

  async removeFromFavorites(trackId: string): Promise<{ message: string }> {
    return this.favoritesService.removeFromFavorites(trackId);
  }
}

export const apiService = new ApiService();