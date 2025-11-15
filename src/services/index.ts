import { PodcastService } from './PodcastService';
import { StorageService } from './StorageService.js';
import { MockAuthService } from './MockAuthService.js';
import { MockFavoritesService } from './MockFavoritesService.js';

export const podcastService = new PodcastService();
export const storageService = new StorageService();
export const mockAuthService = new MockAuthService();
export const mockFavoritesService = new MockFavoritesService();

export { apiService } from './ApiService.js';
export { AuthService } from './AuthService.js';
export { MediaService } from './MediaService.js';
export { FavoritesService } from './FavoritesService.js';
export { PodcastService } from './PodcastService';
export { TrackDataService } from './TrackDataService.js';
export { StorageService } from './StorageService.js';
export { MockAuthService } from './MockAuthService.js';
export { MockFavoritesService } from './MockFavoritesService.js';