import { el } from 'redom';
import { Track } from '../../types/index.js';

export class PodcastCard {
  private element: HTMLElement;

  constructor(
    podcast: Track,
    onPlay: (track: Track) => void,
    onSubscribe: (podcastId: string) => void,
    onPodcastClick?: (podcast: Track) => void
  ) {
    const playIcon = this.createPlayIcon();

    this.element = el('.podcast-card',
      {
        onclick: onPodcastClick ? () => onPodcastClick(podcast) : null,
        style: onPodcastClick ? 'cursor: pointer;' : ''
      },
      el('.podcast-cover'),
      el('.podcast-info',
        el('h3.podcast-title', podcast.title),
        el('p.podcast-artist', podcast.artist),
        el('p.podcast-description', podcast.description || 'Интересный подкаст на различные темы')
      ),
      el('.podcast-actions',
        el('button.btn-play', {
          onclick: (e: Event) => {
            e.stopPropagation();
            onPlay(podcast);
          }
        }, playIcon),
        el('button.btn-subscribe', {
          onclick: (e: Event) => {
            e.stopPropagation();
            onSubscribe(podcast.id.toString());
          }
        }, 'Подписаться')
      )
    );
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

  getElement(): HTMLElement {
    return this.element;
  }
}