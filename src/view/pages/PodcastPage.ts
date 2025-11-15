import { el } from 'redom';
import { Track } from '../../types/index.js';
import { PodcastCard } from '../components/PodcastCard.js';

export class PodcastPage {
  private element: HTMLElement;
  private podcastsList: HTMLElement;

  constructor(
    private podcasts: Track[],
    private onPlayPodcast: (podcast: Track) => void,
    private onSubscribe: (podcastId: string) => void,
    private onPodcastClick?: (podcast: Track) => void
  ) {
    this.podcastsList = el('.podcasts-list');

    this.element = el('.tracks-page',
      el('h2', 'Рекомендуемые подкасты'),
      this.podcastsList
    );

    this.renderPodcasts();
  }

  private renderPodcasts(): void {
    this.podcastsList.innerHTML = '';

    this.podcasts.forEach(podcast => {
      const podcastCard = new PodcastCard(
        podcast,
        this.onPlayPodcast,
        this.onSubscribe,
        this.onPodcastClick
      );
      this.podcastsList.appendChild(podcastCard.getElement());
    });
  }

  updatePodcasts(podcasts: Track[]): void {
    this.podcasts = podcasts;
    this.renderPodcasts();
  }

  getElement(): HTMLElement {
    return this.element;
  }
}