import { el } from 'redom';
import { Track } from '../../types/index.js';

export class Player {
  private element: HTMLElement;
  private audioElement: HTMLAudioElement;
  private playButton: HTMLButtonElement;
  private progressBar: HTMLElement;
  private progressContainer: HTMLElement;
  private currentTimeEl: HTMLElement;
  private durationEl: HTMLElement;
  private isPlaying: boolean = false;
  private currentTrack: Track | null = null;
  private currentTracks: Track[] = [];
  private currentTrackIndex: number = -1;

  constructor(
    private onPlay: () => void,
    private onPause: () => void,
    private onNext: () => void,
    private onPrevious: () => void,
    private onSeek: (time: number) => void
  ) {
    this.audioElement = new Audio();

    this.playButton = el('button.player-btn.player-btn--play', {
      onclick: () => this.togglePlay()
    }, '▶') as HTMLButtonElement;

    this.progressContainer = el('.progress-container', {
      onclick: (e: MouseEvent) => this.setProgress(e)
    });

    this.progressBar = el('.progress-bar');
    this.currentTimeEl = el('.current-time', '0:00');
    this.durationEl = el('.duration', '0:00');

    this.progressContainer.appendChild(this.progressBar);

    this.element = el('.player',
      el('.player-track-info',
        el('h3.player-title', 'Выберите трек'),
        el('p.player-artist', 'Нажмите play для воспроизведения')
      ),
      el('.player-progress',
        this.currentTimeEl,
        el('.progress-wrapper',
          this.progressContainer
        ),
        this.durationEl
      ),
      el('.player-controls',
        this.createControlButton('⏮', () => this.previousTrack(), 'player-btn player-btn--nav', 'Предыдущий трек'),
        this.createControlButton('◀◀', () => this.seek(-10), 'player-btn player-btn--seek', 'Перемотка назад 10сек'),
        this.playButton,
        this.createControlButton('▶▶', () => this.seek(10), 'player-btn player-btn--seek', 'Перемотка вперед 10сек'),
        this.createControlButton('⏭', () => this.nextTrack(), 'player-btn player-btn--nav', 'Следующий трек')
      ),
      this.audioElement
    );

    this.setupAudioEvents();
    this.setupKeyboardEvents();
  }

  private createControlButton(text: string, onClick: () => void, className: string, title: string): HTMLElement {
    return el(`button.${className}`, {
      onclick: onClick,
      title: title
    }, text);
  }

  private setupAudioEvents(): void {
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.updateDuration();
      this.updateProgress();
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.updatePlayButton();
      this.onPlay();
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updatePlayButton();
      this.onPause();
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.updatePlayButton();
      this.nextTrack();
    });

    this.audioElement.addEventListener('error', (e) => {
      this.isPlaying = false;
      this.updatePlayButton();
    });
  }

  private setupKeyboardEvents(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          this.togglePlay();
          break;
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.seek(10);
          } else if (e.shiftKey) {
            e.preventDefault();
            this.nextTrack();
          }
          break;
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.seek(-10);
          } else if (e.shiftKey) {
            e.preventDefault();
            this.previousTrack();
          }
          break;
        case 'KeyN':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.nextTrack();
          }
          break;
        case 'KeyP':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.previousTrack();
          }
          break;
      }
    });
  }

  setTracks(tracks: Track[]): void {
    this.currentTracks = tracks;
  }

  loadTrack(track: Track): void {
    this.currentTrack = track;
    this.currentTrackIndex = this.currentTracks.findIndex(t => t.id === track.id);

    const audioUrls = [
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    ];

    let audioIndex: number;

    if (track.id.startsWith('podcast-')) {
      const podcastNum = parseInt(track.id.replace('podcast-', ''));
      audioIndex = (podcastNum - 1) % audioUrls.length;
    } else {
      audioIndex = (parseInt(track.id) - 1) % audioUrls.length;
    }

    const audioUrl = audioUrls[audioIndex];

    this.audioElement.src = audioUrl;
    this.audioElement.preload = 'metadata';

    const titleEl = this.element.querySelector('.player-title') as HTMLElement;
    const artistEl = this.element.querySelector('.player-artist') as HTMLElement;

    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;

    this.isPlaying = false;
    this.updatePlayButton();

    this.progressBar.style.width = '0%';
    this.currentTimeEl.textContent = '0:00';
    this.durationEl.textContent = '0:00';
  }

  play(): void {
    if (!this.currentTrack) {
      return;
    }

    if (!this.audioElement.src) {
      return;
    }

    this.audioElement.play().catch(error => {
      this.isPlaying = false;
      this.updatePlayButton();
    });
  }

  pause(): void {
    this.audioElement.pause();
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(seconds: number): void {
    if (!this.audioElement.src) return;

    const newTime = this.audioElement.currentTime + seconds;
    this.audioElement.currentTime = Math.max(0, Math.min(newTime, this.audioElement.duration));
    this.onSeek(this.audioElement.currentTime);
  }

  setProgress(e: MouseEvent): void {
    if (!this.audioElement.src) return;

    const progressContainer = this.progressContainer as HTMLElement;
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = this.audioElement.duration;

    this.audioElement.currentTime = (clickX / width) * duration;
    this.onSeek(this.audioElement.currentTime);
  }

  nextTrack(): void {
    if (this.currentTracks.length === 0) return;

    let nextIndex = this.currentTrackIndex + 1;
    if (nextIndex >= this.currentTracks.length) {
      nextIndex = 0;
    }

    const nextTrack = this.currentTracks[nextIndex];
    this.loadTrack(nextTrack);
    this.play();
    this.onNext();
  }

  previousTrack(): void {
    if (this.currentTracks.length === 0) return;

    let prevIndex = this.currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.currentTracks.length - 1;
    }

    const prevTrack = this.currentTracks[prevIndex];
    this.loadTrack(prevTrack);
    this.play();
    this.onPrevious();
  }

  private updateProgress(): void {
    if (!this.audioElement.src || !this.audioElement.duration) return;

    const progressPercent = (this.audioElement.currentTime / this.audioElement.duration) * 100;
    this.progressBar.style.width = `${progressPercent}%`;
    this.currentTimeEl.textContent = this.formatTime(this.audioElement.currentTime);
  }

  private updateDuration(): void {
    if (this.audioElement.duration) {
      this.durationEl.textContent = this.formatTime(this.audioElement.duration);
    }
  }

  private updatePlayButton(): void {
    if (this.isPlaying) {
      this.playButton.textContent = '⏸';
      this.playButton.setAttribute('title', 'Пауза');
    } else {
      this.playButton.textContent = '▶';
      this.playButton.setAttribute('title', 'Воспроизвести');
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  getCurrentTime(): number {
    return this.audioElement.currentTime;
  }

  getDuration(): number {
    return this.audioElement.duration;
  }

  setCurrentTime(time: number): void {
    if (this.audioElement.src) {
      this.audioElement.currentTime = time;
    }
  }
}