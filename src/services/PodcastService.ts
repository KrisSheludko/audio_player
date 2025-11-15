import type { Track } from '../types/index';

export class PodcastService {
  private mockPodcasts: Track[] = [
    {
      id: 'podcast-1',
      title: 'Технологии будущего',
      artist: 'IT Подкаст',
      type: 'podcast',
      duration: 3600,
      description: 'Обсуждение новых технологий и их влияния на нашу жизнь'
    },
    {
      id: 'podcast-2',
      title: 'Истории успеха',
      artist: 'Бизнес Подкаст',
      type: 'podcast',
      duration: 2700,
      description: 'Интервью с успешными предпринимателями'
    }
  ];

  async getFeaturedPodcasts(): Promise<Track[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockPodcasts;
  }

  async getPodcastRecommendations(): Promise<Track[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mockPodcasts.slice(0, 3);
  }
}

export const podcastService = new PodcastService();