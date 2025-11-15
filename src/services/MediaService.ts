import { TrackDataService } from './TrackDataService.js';
import type { Track } from '../types/index';

export class MediaService {
  private trackDataService: TrackDataService;

  constructor() {
    this.trackDataService = new TrackDataService();
  }

  async getTracks(): Promise<Track[]> {
    await this.delay(300);
    return this.trackDataService.generateMockTracks();
  }

  async getPodcasts(): Promise<Track[]> {
    await this.delay(300);
    return this.trackDataService.generateMockPodcasts();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}