import { el } from 'redom';
import { Track } from '../../types/index.js';

export class TrackItem {
  private element: HTMLElement;
  private favoriteButton: HTMLButtonElement;
  private isFavorite: boolean;

  constructor(
    track: Track,
    onPlay: (track: Track) => void,
    onToggleFavorite: (trackId: string, isFavorite: boolean) => void,
    onTrackClick?: (track: Track) => void
  ) {
    this.isFavorite = track.isFavorite || false;

    this.favoriteButton = this.createFavoriteButton();
    this.updateFavoriteButton();

    const playIcon = this.createPlayIcon();

    this.element = el('li.track-item',
      {
        onclick: onTrackClick ? () => onTrackClick(track) : null,
        style: onTrackClick ? 'cursor: pointer;' : ''
      },
      el('.track-info',
        el('h3.track-title', track.title),
        el('p.track-artist', track.artist)
      ),
      el('.track-actions',
        el('button.btn-play', {
          onclick: (e: Event) => {
            e.stopPropagation();
            onPlay(track);
          }
        }, playIcon),
        this.favoriteButton
      )
    );

    this.favoriteButton.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      const newFavoriteState = !this.isFavorite;
      this.isFavorite = newFavoriteState;
      this.updateFavoriteButton();
      onToggleFavorite(track.id, newFavoriteState);
    });
  }

  private createFavoriteButton(): HTMLButtonElement {
    const button = el('button.btn-favorite', {
      type: 'button',
      title: this.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'
    }) as HTMLButtonElement;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('favorite-icon');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', this.isFavorite ? '#667eea' : 'none');
    svg.setAttribute('stroke', '#667eea');
    svg.setAttribute('stroke-width', '2');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');

    svg.appendChild(path);
    button.appendChild(svg);

    return button;
  }

  private createPlayIcon(): HTMLElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('play-icon');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M8 5v14l11-7z');

    svg.appendChild(path);
    return svg as unknown as HTMLElement;
  }

  getElement(): HTMLElement {
    return this.element;
  }

  updateFavoriteState(isFavorite: boolean): void {
    this.isFavorite = isFavorite;
    this.updateFavoriteButton();
  }

  private updateFavoriteButton(): void {
    const svg = this.favoriteButton.querySelector('svg') as SVGElement;
    if (svg) {
      if (this.isFavorite) {
        svg.setAttribute('fill', '#667eea');
        svg.setAttribute('stroke', '#667eea');
        this.favoriteButton.setAttribute('title', 'Убрать из избранного');
      } else {
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', '#667eea');
        this.favoriteButton.setAttribute('title', 'Добавить в избранное');
      }
    }
  }
}