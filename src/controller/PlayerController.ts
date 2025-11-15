import { Track } from '../types/index';
import { Player } from '../view/components/Player';

export class PlayerController {
  private player: Player;
  private currentTracks: Track[] = [];
  private isPlaying: boolean = false;
  private currentTrack: Track | null = null;

  constructor(
    private onTrackChange: (track: Track) => void,
    private onPlayStateChange: (isPlaying: boolean) => void
  ) {
    this.player = new Player(
      () => {
        this.isPlaying = true;
        this.onPlayStateChange(true);
      },
      () => {
        this.isPlaying = false;
        this.onPlayStateChange(false);
      },
      this.handleNext.bind(this),
      this.handlePrevious.bind(this),
      (time: number) => this.handleSeek(time)
    );
  }

  setTracks(tracks: Track[]): void {
    this.currentTracks = tracks;
    this.player.setTracks(tracks);
  }

  playTrack(track: Track): void {
    const foundTrack = this.currentTracks.find(t => t.id === track.id);

    if (foundTrack) {
      this.currentTrack = foundTrack;
      this.player.loadTrack(foundTrack);
      this.player.play();
      this.onTrackChange(foundTrack);
    }
  }

  private handleNext(): void {
    const currentIndex = this.currentTracks.findIndex(t => t.id === this.currentTrack?.id);
    const nextIndex = (currentIndex + 1) % this.currentTracks.length;
    const nextTrack = this.currentTracks[nextIndex];

    if (nextTrack) {
      this.currentTrack = nextTrack;
      this.onTrackChange(nextTrack);
    }
  }

  private handlePrevious(): void {
    const currentIndex = this.currentTracks.findIndex(t => t.id === this.currentTrack?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.currentTracks.length - 1;
    const prevTrack = this.currentTracks[prevIndex];

    if (prevTrack) {
      this.currentTrack = prevTrack;
      this.onTrackChange(prevTrack);
    }
  }

  private handleSeek(time: number): void {
  }

  play(): void {
    this.player.play();
  }

  pause(): void {
    this.player.pause();
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  next(): void {
    this.player.nextTrack();
  }

  previous(): void {
    this.player.previousTrack();
  }

  seek(seconds: number): void {
    this.player.seek(seconds);
  }

  getPlayerElement(): HTMLElement {
    return this.player.getElement();
  }

  clearTracks(): void {
    this.currentTracks = [];
    this.player.setTracks([]);
  }

  getCurrentState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      currentTime: this.player.getCurrentTime(),
      duration: this.player.getDuration()
    };
  }
}