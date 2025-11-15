import { el } from 'redom';
import { TrackDetails } from '../../types/index.js';
import { Button } from '../components/Button.js';

export class TrackPage {
  private element: HTMLElement;
  private isFavorite: boolean;

  constructor(
    private track: TrackDetails,
    private onPlay: (track: TrackDetails) => void,
    private onToggleFavorite: (trackId: string, isFavorite: boolean) => void,
    private onBack: () => void
  ) {
    this.isFavorite = track.isFavorite || false;
    this.element = this.createTrackPage();
  }

  private createTrackPage(): HTMLElement {
    return el('.track-page',
      el('.detail-page-container',
        el('.detail-page-header',
          new Button('← Назад к музыке', this.onBack, 'btn-back').getElement()
        ),
        el('.track-detail',
          el('.track-cover-large', this.getCoverIcon()),
          el('.track-info-large',
            el('h1.track-title-large', this.track.title),
            el('h2.track-artist-large', this.track.artist),
            el('.track-meta',
              this.track.genre ? el('span.track-genre', this.track.genre) : el('span.track-type', '🎵 Трек'),
              el('span.track-duration', this.formatDuration(this.track.duration || 0))
            ),
            el('.track-actions',
              el('button.btn-play', {
                onclick: () => this.onPlay(this.track)
              }, this.createPlayIcon()),
              el('button.btn-favorite', {
                onclick: () => this.handleToggleFavorite(),
                title: this.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'
              }, this.createFavoriteIcon())
            ),
            this.track.description ? el('.track-description', this.track.description) : ''
          )
        ),
        this.createAdditionalInfo()
      )
    );
  }

  private handleToggleFavorite(): void {
    const newFavoriteState = !this.isFavorite;
    this.isFavorite = newFavoriteState;
    this.updateFavoriteIcon();
    this.onToggleFavorite(this.track.id, newFavoriteState);
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

  private getCoverIcon(): string {
    if (this.track.type === 'podcast') {
      return '🎙️';
    }
    return '🎵';
  }

  private createAdditionalInfo(): HTMLElement {
    const additionalInfo = [];

    if (this.track.album) {
      additionalInfo.push(el('.info-item',
        el('strong', 'Альбом:'),
        el('span', this.track.album)
      ));
    }

    if (this.track.year) {
      additionalInfo.push(el('.info-item',
        el('strong', 'Год выпуска:'),
        el('span', this.track.year.toString())
      ));
    }

    if (this.track.bitrate) {
      additionalInfo.push(el('.info-item',
        el('strong', 'Битрейт:'),
        el('span', `${this.track.bitrate} kbps`)
      ));
    }

    if (this.track.plays_count) {
      additionalInfo.push(el('.info-item',
        el('strong', 'Прослушиваний:'),
        el('span', this.track.plays_count.toString())
      ));
    }

    additionalInfo.push(el('.info-item',
      el('strong', 'Тип:'),
      el('span', this.track.type === 'podcast' ? 'Подкаст' : 'Музыка')
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

  getElement(): HTMLElement {
    return this.element;
  }
}