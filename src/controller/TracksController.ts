import { TracksPage } from '../view/pages/TracksPage';
import { TrackPage } from '../view/pages/TrackPage';
import { PlayerController } from './PlayerController';
import { apiService } from '../services/ApiService';
import type { Track, TrackDetails } from '../types/index';

export class TracksController {
  private tracksPage: TracksPage | null = null;
  private tracks: Track[] = [];
  private tracksLoaded: boolean = false;
  private isFavoritesPage: boolean = false;

  constructor(
    private playerController: PlayerController,
    private onShowTrackPage: (trackId: string) => void,
    private onBackToTracks: () => void
  ) {
    this.loadTracks();
  }

  private async loadTracks(): Promise<void> {
    try {
      this.tracks = await apiService.getTracks();
      this.tracksLoaded = true;
    } catch (error) {
      this.tracks = [];
      this.tracksLoaded = true;
    }
  }

  async getTracksPage(): Promise<TracksPage> {
    if (!this.tracksLoaded) {
      await this.waitForTracks();
    }

    this.isFavoritesPage = false;
    this.playerController.setTracks(this.tracks);

    this.tracksPage = new TracksPage(
      this.tracks,
      this.handlePlayTrack.bind(this),
      this.handleToggleFavorite.bind(this),
      'Все треки',
      this.handleTrackClick.bind(this)
    );

    return this.tracksPage;
  }

  async getTrackPage(trackId: string): Promise<TrackPage> {
    if (!this.tracksLoaded) {
      await this.waitForTracks();
    }

    const track = this.tracks.find(t => t.id === trackId);

    if (!track) {
      throw new Error('Трек не найден');
    }

    const trackDetails: TrackDetails = {
      ...track,
      album: this.getAlbumForTrack(track.id),
      genre: this.getGenreForTrack(track.id),
      year: this.getYearForTrack(track.id),
      bitrate: 320,
      file_format: 'mp3',
      plays_count: Math.floor(Math.random() * 1000) + 100
    };

    this.playerController.setTracks([track]);

    return new TrackPage(
      trackDetails,
      this.handlePlayTrack.bind(this),
      this.handleToggleFavorite.bind(this),
      this.onBackToTracks
    );
  }

  private getAlbumForTrack(trackId: string): string {
    const albums: { [key: string]: string } = {
      '1': 'Eternal Dreams',
      '2': 'City Vibes',
      '3': 'Ocean Waves',
      '4': 'Morning Sessions',
      '5': 'Cosmic Journey'
    };
    return albums[trackId] || 'Unknown Album';
  }

  private getGenreForTrack(trackId: string): string {
    const genres: { [key: string]: string } = {
      '1': 'Ambient',
      '2': 'Electronic',
      '3': 'Chillout',
      '4': 'Acoustic',
      '5': 'Synthwave'
    };
    return genres[trackId] || 'Electronic';
  }

  private getYearForTrack(trackId: string): number {
    const baseYear = 2020;
    return baseYear + (parseInt(trackId) % 4);
  }

  private waitForTracks(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.tracksLoaded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  async getFavoritesPage(): Promise<TracksPage> {
    try {
      const favorites = await apiService.getFavorites();

      this.isFavoritesPage = true;
      this.playerController.setTracks(favorites);

      this.tracksPage = new TracksPage(
        favorites,
        this.handlePlayTrack.bind(this),
        this.handleToggleFavorite.bind(this),
        'Избранное',
        this.handleTrackClick.bind(this)
      );
      return this.tracksPage;
    } catch (error) {
      this.isFavoritesPage = true;
      this.playerController.setTracks([]);

      this.tracksPage = new TracksPage(
        [],
        this.handlePlayTrack.bind(this),
        this.handleToggleFavorite.bind(this),
        'Избранное',
        this.handleTrackClick.bind(this)
      );
      return this.tracksPage;
    }
  }

  private handlePlayTrack(track: Track): void {
    this.playerController.playTrack(track);
  }

  private handleTrackClick(track: Track): void {
    this.onShowTrackPage(track.id);
  }

  private async handleToggleFavorite(trackId: string, isFavorite: boolean): Promise<void> {
    try {
      if (isFavorite) {
        await apiService.addToFavorites(trackId);
      } else {
        await apiService.removeFromFavorites(trackId);

        if (this.isFavoritesPage && this.tracksPage) {
          this.tracksPage.removeTrack(trackId);
        }
      }
    } catch (error: any) {
    }
  }

  async refreshTracks(): Promise<void> {
    await this.loadTracks();
  }
}