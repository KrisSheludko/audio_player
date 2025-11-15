import { el } from 'redom';
import { Track } from '../../types/index.js';
import { TrackItem } from '../components/TrackItem.js';

export class TracksPage {
  private element: HTMLElement;
  private tracksList: HTMLElement;
  private currentPage: number = 1;
  private itemsPerPage: number = 5;
  private trackItems: Map<string, TrackItem> = new Map();

  constructor(
    private tracks: Track[],
    private onPlayTrack: (track: Track) => void,
    private onToggleFavorite: (trackId: string, isFavorite: boolean) => void,
    private pageTitle: string = 'Все треки',
    private onTrackClick?: (track: Track) => void
  ) {
    this.tracksList = el('ul.tracks-list');

    this.element = el('.tracks-page',
      el('h2', this.pageTitle),
      this.tracksList,
      this.createPagination()
    );

    this.renderTracks();
  }

  private renderTracks(): void {
    this.tracksList.innerHTML = '';
    this.trackItems.clear();

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const tracksToShow = this.tracks.slice(startIndex, endIndex);

    tracksToShow.forEach(track => {
      const trackItem = new TrackItem(
        track,
        this.onPlayTrack,
        this.onToggleFavorite,
        this.onTrackClick
      );
      this.trackItems.set(track.id, trackItem);
      this.tracksList.appendChild(trackItem.getElement());
    });

    if (tracksToShow.length === 0) {
      this.tracksList.appendChild(this.createEmptyMessage());
    }
  }

  private createEmptyMessage(): HTMLElement {
    return el('li.empty-message',
      el('p', 'Треков не найдено')
    );
  }

  private createPagination(): HTMLElement {
    const totalPages = Math.ceil(this.tracks.length / this.itemsPerPage);

    if (totalPages <= 1) {
      return el('div');
    }

    return el('.pagination',
      el('button.pagination-btn', {
        onclick: () => this.previousPage(),
        disabled: this.currentPage === 1
      }, 'Назад'),
      el('span.page-info', `Страница ${this.currentPage} из ${totalPages}`),
      el('button.pagination-btn', {
        onclick: () => this.nextPage(),
        disabled: this.currentPage === totalPages
      }, 'Вперед')
    );
  }

  private nextPage(): void {
    const totalPages = Math.ceil(this.tracks.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.renderTracks();
      this.updatePagination();
    }
  }

  private previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderTracks();
      this.updatePagination();
    }
  }

  private updatePagination(): void {
    const pagination = this.element.querySelector('.pagination');
    if (pagination) {
      pagination.remove();
      this.element.appendChild(this.createPagination());
    }
  }

  removeTrack(trackId: string): void {
    const trackItem = this.trackItems.get(trackId);
    if (trackItem) {
      const element = trackItem.getElement();
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.trackItems.delete(trackId);
    }

    this.tracks = this.tracks.filter(track => track.id !== trackId);

    this.updatePagination();

    const tracksOnCurrentPage = this.tracks.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );

    if (tracksOnCurrentPage.length === 0 && this.currentPage > 1) {
      this.currentPage--;
      this.renderTracks();
      this.updatePagination();
    } else {
      this.renderTracks();
    }
  }

  updateTracks(tracks: Track[]): void {
    this.tracks = tracks;
    this.currentPage = 1;
    this.renderTracks();
    this.updatePagination();
  }

  getElement(): HTMLElement {
    return this.element;
  }
}