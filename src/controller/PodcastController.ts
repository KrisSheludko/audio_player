import { PodcastPage } from '../view/pages/PodcastPage.js';
import { PodcastDetailPage } from '../view/pages/PodcastDetailPage.js';
import { PlayerController } from './PlayerController.js';
import { apiService } from '../services/ApiService.js';
import type { PodcastDetails, Track } from '../types/index.js';

export class PodcastController {
  private podcastPage: PodcastPage | null = null;
  private podcasts: Track[] = [];

  constructor(
    private playerController: PlayerController,
    private onShowPodcastPage: (podcastId: string) => void,
    private onBackToPodcasts: () => void
  ) {
    this.loadPodcasts();
  }

  private async loadPodcasts(): Promise<void> {
    try {
      this.podcasts = await apiService.getPodcasts();
    } catch (error) {
      this.podcasts = [];
    }
  }

  getPodcastPage(): PodcastPage {
    this.playerController.setTracks(this.podcasts);

    this.podcastPage = new PodcastPage(
      this.podcasts,
      (podcast: Track) => this.playerController.playTrack(podcast),
      (podcastId: string) => this.subscribe(podcastId),
      (podcast: Track) => this.onShowPodcastPage(podcast.id)
    );

    return this.podcastPage;
  }

  async getPodcastDetailPage(podcastId: string): Promise<PodcastDetailPage> {
    const podcast = this.podcasts.find(p => p.id === podcastId);

    if (!podcast) {
      throw new Error('Подкаст не найден');
    }

    const podcastDetails: PodcastDetails = {
      ...podcast,
      episodes_count: this.getEpisodesCount(podcast.id),
      category: this.getCategoryForPodcast(podcast.id),
      host: this.getHostForPodcast(podcast.id),
      total_duration: this.getTotalDuration(podcast.id),
      language: 'Русский',
      explicit: false,
      website: this.getWebsiteForPodcast(podcast.id)
    };

    this.playerController.setTracks([podcast]);

    return new PodcastDetailPage(
      podcastDetails,
      (podcast: PodcastDetails) => this.playerController.playTrack(podcast),
      (podcastId: string, isFavorite: boolean) => this.handleToggleFavorite(podcastId, isFavorite),
      this.onBackToPodcasts
    );
  }

  private getEpisodesCount(podcastId: string): number {
    const episodes: { [key: string]: number } = {
      'podcast-1': 24,
      'podcast-2': 18,
      'podcast-3': 32
    };
    return episodes[podcastId] || 12;
  }

  private getCategoryForPodcast(podcastId: string): string {
    const categories: { [key: string]: string } = {
      'podcast-1': 'Технологии',
      'podcast-2': 'Бизнес',
      'podcast-3': 'Наука'
    };
    return categories[podcastId] || 'Образование';
  }

  private getHostForPodcast(podcastId: string): string {
    const hosts: { [key: string]: string } = {
      'podcast-1': 'Алексей Иванов',
      'podcast-2': 'Мария Петрова',
      'podcast-3': 'Дмитрий Сидоров'
    };
    return hosts[podcastId] || 'Команда подкаста';
  }

  private getTotalDuration(podcastId: string): number {
    const durations: { [key: string]: number } = {
      'podcast-1': 86400,
      'podcast-2': 64800,
      'podcast-3': 115200
    };
    return durations[podcastId] || 43200;
  }

  private getWebsiteForPodcast(podcastId: string): string {
    const websites: { [key: string]: string } = {
      'podcast-1': 'https://tech-podcast.example.com',
      'podcast-2': 'https://business-podcast.example.com',
      'podcast-3': 'https://science-podcast.example.com'
    };
    return websites[podcastId] || 'https://podcast.example.com';
  }

  private async subscribe(podcastId: string): Promise<void> {
    try {
      await apiService.addToFavorites(podcastId);
    } catch (error: any) {
    }
  }

  private async handleToggleFavorite(podcastId: string, isFavorite: boolean): Promise<void> {
    try {
      if (isFavorite) {
        await apiService.addToFavorites(podcastId);
      } else {
        await apiService.removeFromFavorites(podcastId);
      }
    } catch (error: any) {
    }
  }
}