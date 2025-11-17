import { storageService } from '../../services/StorageService.js';
import { apiService } from '../../services/ApiService.js';
import type { TracksController } from '../TracksController.js';
import type { PodcastController } from '../PodcastController.js';
import type { AuthController } from '../AuthController.js';
import { ProfileController } from '../ProfileController.js';

export class PageRouter {
  constructor(
    private tracksController: TracksController,
    private podcastController: PodcastController,
    private profileControllerClass: typeof ProfileController,
    private authController: AuthController
  ) { }

  async showPodcastPage(podcastId: string, mainContainer: HTMLElement): Promise<void> {
    if (!storageService.isAuthenticated()) {
      this.showAuthPage(mainContainer);
      return;
    }

    mainContainer.innerHTML = '';

    try {
      const podcastDetailPage = await this.podcastController.getPodcastDetailPage(podcastId);
      mainContainer.appendChild(podcastDetailPage.getElement());
    } catch (error: any) {
      await this.showPodcastsList(mainContainer);
    }
  }

  private async showPodcastsList(mainContainer: HTMLElement): Promise<void> {
    mainContainer.innerHTML = '';
    const podcastsPage = this.podcastController.getPodcastPage();
    mainContainer.appendChild(podcastsPage.getElement());
  }

  async showProfilePage(mainContainer: HTMLElement): Promise<void> {
    if (!storageService.isAuthenticated()) {
      this.showAuthPage(mainContainer);
      return;
    }

    mainContainer.innerHTML = '';

    try {
      const profileController = new this.profileControllerClass(() => this.handleLogout());
      const profilePage = await profileController.getProfilePage();
      mainContainer.appendChild(profilePage.getElement());
    } catch (error: any) {
      await this.showTracksList(mainContainer);
    }
  }

  private async showTracksList(mainContainer: HTMLElement): Promise<void> {
    mainContainer.innerHTML = '';
    try {
      const tracksPage = await this.tracksController.getTracksPage();
      mainContainer.appendChild(tracksPage.getElement());
    } catch (error: any) {
      mainContainer.appendChild(this.createErrorPage('Не удалось загрузить страницу'));
    }
  }

  async showTrackPage(trackId: string, mainContainer: HTMLElement): Promise<void> {
    if (!storageService.isAuthenticated()) {
      this.showAuthPage(mainContainer);
      return;
    }

    mainContainer.innerHTML = '';

    try {
      const trackPage = await this.tracksController.getTrackPage(trackId);
      mainContainer.appendChild(trackPage.getElement());
    } catch (error: any) {
      await this.showTracksList(mainContainer);
    }
  }

  showAuthPage(mainContainer: HTMLElement): void {
    mainContainer.innerHTML = '';
    const authPage = this.authController.getAuthPage();
    mainContainer.appendChild(authPage.getElement());
  }

  async subscribeToPodcast(podcastId: string): Promise<void> {
    try {
      await apiService.addToFavorites(podcastId);
    } catch (error: any) {
      console.error('Subscribe error:', error);
    }
  }

  handleLogout(): void {
    this.authController.logout();
  }

  private createErrorPage(message: string): HTMLElement {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-page';
    errorDiv.innerHTML = `
      <div class="error-content">
        <h2>Ошибка</h2>
        <p>${message}</p>
        <button onclick="location.reload()">Обновить страницу</button>
      </div>
    `;
    return errorDiv;
  }
}