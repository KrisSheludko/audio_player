import { el } from 'redom';
import { PodcastDetails } from '../../types/index.js';
import { Button } from '../components/Button.js';

export class PodcastDetailPage {
  private element: HTMLElement;
  private isFavorite: boolean;

  constructor(
    private podcast: PodcastDetails,
    private onPlay: (podcast: PodcastDetails) => void,
    private onToggleFavorite: (podcastId: string, isFavorite: boolean) => void,
    private onBack: () => void
  ) {
    this.isFavorite = podcast.isFavorite || false;
    this.element = this.createPodcastPage();
  }

  private createPodcastPage(): HTMLElement {
    return el('.podcast-page',
      el('.detail-page-container',
        el('.detail-page-header',
          new Button('← Назад к подкастам', this.onBack, 'btn-back').getElement()
        ),
        el('.track-detail',
          el('.track-cover-large', '🎙️'),
          el('.track-info-large',
            el('h1.track-title-large', this.podcast.title),
            el('h2.track-artist-large', this.podcast.artist),
            el('.track-meta',
              el('span.track-genre', this.podcast.category || 'Образование'),
              el('span.track-duration', this.formatDuration(this.podcast.duration || 0)),
              el('span.track-type', '🎙️ Подкаст')
            ),
            el('.track-actions',
              el('button.btn-play', {
                onclick: () => this.onPlay(this.podcast)
              }, this.createPlayIcon()),
              el('button.btn-favorite', {
                onclick: () => this.handleToggleFavorite(),
                title: this.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'
              }, this.createFavoriteIcon())
            ),
            el('.track-description', this.podcast.description || 'Интересный подкаст на различные темы')
          )
        ),
        this.createPodcastDetails()
      )
    );
  }

  private handleToggleFavorite(): void {
    const newFavoriteState = !this.isFavorite;
    this.isFavorite = newFavoriteState;
    this.updateFavoriteIcon();
    this.onToggleFavorite(this.podcast.id, newFavoriteState);
  }

  private updateFavoriteIcon(): void {
    const favoriteButton = this.element.querySelector('.btn-favorite') as HTMLButtonElement;
    if (favoriteButton) {
      const svg = favoriteButton.querySelector('svg') as SVGElement;
      if (svg) {
        if (this.isFavorite) {
          svg.setAttribute('fill', '#667eea');
          svg.setAttribute('stroke', '#667eea');
          favoriteButton.setAttribute('title', 'Убрать из избранного');
        } else {
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', '#667eea');
          favoriteButton.setAttribute('title', 'Добавить в избранное');
        }
      }
    }
  }

  private createPlayIcon(): HTMLElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('play-icon');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M8 5v14l11-7z');

    svg.appendChild(path);
    return svg as unknown as HTMLElement;
  }

  private createFavoriteIcon(): HTMLElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('favorite-icon');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', this.isFavorite ? '#667eea' : 'none');
    svg.setAttribute('stroke', '#667eea');
    svg.setAttribute('stroke-width', '2');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');

    svg.appendChild(path);
    return svg as unknown as HTMLElement;
  }

  private createPodcastDetails(): HTMLElement {
    const additionalInfo = [];

    if (this.podcast.host) {
      additionalInfo.push(el('.info-item',
        el('strong', 'Ведущий:'),
        el('span', this.podcast.host)
      ));
    }

    if (this.podcast.episodes_count) {
      additionalInfo.push(el('.info-item',
        el('strong', 'Количество эпизодов:'),
        el('span', `${this.podcast.episodes_count} эпизодов`)
      ));
    }

    if (this.podcast.total_duration) {
      additionalInfo.push(el('.info-item',
        el('strong', 'Общая длительность:'),
        el('span', this.formatTotalDuration(this.podcast.total_duration))
      ));
    }

    if (this.podcast.category) {
      additionalInfo.push(el('.info-item',
        el('strong', 'Категория:'),
        el('span', this.podcast.category)
      ));
    }

    if (this.podcast.language) {
      additionalInfo.push(el('.info-item',
        el('strong', 'Язык:'),
        el('span', this.podcast.language)
      ));
    }

    if (this.podcast.website) {
      additionalInfo.push(el('.info-item',
        el('strong', 'Веб-сайт:'),
        el('a', {
          href: this.podcast.website,
          target: '_blank',
          rel: 'noopener noreferrer'
        }, this.podcast.website)
      ));
    }

    additionalInfo.push(el('.info-item',
      el('strong', 'Тип контента:'),
      el('span', 'Подкаст')
    ));

    if (additionalInfo.length > 0) {
      return el('.track-additional-info',
        el('.info-grid', ...additionalInfo)
      );
    }

    return el('div');
  }

  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private formatTotalDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    } else {
      return `${minutes} минут`;
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }
}