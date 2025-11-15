import { el } from 'redom';
import { AuthController } from '../AuthController.js';
import { TracksController } from '../TracksController.js';
import { PodcastController } from '../PodcastController.js';
import { PlayerController } from '../PlayerController.js';
import { ProfileController } from '../ProfileController.js';
import { BaseRouter } from './BaseRouter.js';
import { PageRouter } from './PageRouter.js';
import { storageService } from '../../services/StorageService.js';
import type { Track } from '../../types/index.js';

export class Router extends BaseRouter {
  private tracksController: TracksController;
  private podcastController: PodcastController;
  private pageRouter: PageRouter;

  constructor() {
    const playerController = new PlayerController(
      (track: Track) => { },
      (isPlaying: boolean) => { }
    );

    const authController = new AuthController(() => this.handleAuthSuccess());

    super(playerController, authController);

    this.tracksController = new TracksController(
      this.playerController,
      (trackId: string) => this.showTrackPage(trackId),
      () => this.showTracksPage()
    );

    this.podcastController = new PodcastController(
      this.playerController,
      (podcastId: string) => this.showPodcastPage(podcastId),
      () => this.showPodcastsPage()
    );

    this.pageRouter = new PageRouter(
      this.tracksController,
      this.podcastController,
      ProfileController,
      authController
    );

    this.setupNavigation();
    this.showTracksPage();
  }

  protected createNavButtons(): HTMLElement[] {
    return [
      el('button.nav-btn', {
        onclick: () => this.showTracksPage()
      }, 'Музыка'),
      el('button.nav-btn', {
        onclick: () => this.showPodcastsPage()
      }, 'Подкасты'),
      el('button.nav-btn', {
        onclick: () => this.showFavoritesPage()
      }, 'Избранное')
    ];
  }

  async showTracksPage(): Promise<void> {
    this.mainContainer.innerHTML = '';
    const tracksPage = await this.tracksController.getTracksPage();
    this.mainContainer.appendChild(tracksPage.getElement());
    this.updateNavigation();
  }

  async showPodcastsPage(): Promise<void> {
    if (!storageService.isAuthenticated()) {
      this.showAuthPage();
      return;
    }

    this.mainContainer.innerHTML = '';
    const podcastsPage = this.podcastController.getPodcastPage();
    this.mainContainer.appendChild(podcastsPage.getElement());
    this.updateNavigation();
  }

  async showFavoritesPage(): Promise<void> {
    if (!storageService.isAuthenticated()) {
      this.showAuthPage();
      return;
    }

    this.mainContainer.innerHTML = '';
    const favoritesPage = await this.tracksController.getFavoritesPage();
    this.mainContainer.appendChild(favoritesPage.getElement());
    this.updateNavigation();
  }

  private async showPodcastPage(podcastId: string): Promise<void> {
    try {
      await this.pageRouter.showPodcastPage(podcastId, this.mainContainer);
      this.updateNavigation();
    } catch (error) {
      this.showPodcastsPage();
    }
  }

  private async showTrackPage(trackId: string): Promise<void> {
    try {
      await this.pageRouter.showTrackPage(trackId, this.mainContainer);
      this.updateNavigation();
    } catch (error) {
      this.showTracksPage();
    }
  }

  protected async showProfilePage(): Promise<void> {
    try {
      await this.pageRouter.showProfilePage(this.mainContainer);
      this.updateNavigation();
    } catch (error) {
      this.showTracksPage();
    }
  }

  protected showAuthPage(): void {
    this.pageRouter.showAuthPage(this.mainContainer);
  }

  protected handleLogout(): void {
    this.pageRouter.handleLogout();
    this.updateNavigation();
    this.showTracksPage();
  }

  private handleAuthSuccess(): void {
    this.updateNavigation();
    this.showTracksPage();
  }
}