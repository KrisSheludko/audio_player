import { el } from 'redom';
import { storageService } from '../../services/StorageService.js';
import type { PlayerController } from '../PlayerController.js';
import type { AuthController } from '../AuthController.js';

export abstract class BaseRouter {
  protected mainContainer: HTMLElement;
  protected playerElement: HTMLElement;

  constructor(
    protected playerController: PlayerController,
    protected authController: AuthController
  ) {
    this.mainContainer = el('.main-container');
    this.playerElement = this.playerController.getPlayerElement();
  }

  protected setupNavigation(): void {
    const nav = this.createNavigation();
    document.body.appendChild(nav);
    document.body.appendChild(this.mainContainer);
    document.body.appendChild(this.playerElement);
    this.updateNavigation();
  }

  protected createNavigation(): HTMLElement {
    return el('nav.nav',
      el('.nav-container',
        el('.nav-left', ...this.createNavButtons()),
        el('.nav-right', ...this.createUserSection())
      )
    );
  }

  protected abstract createNavButtons(): HTMLElement[];
  protected abstract showTracksPage(): Promise<void>;
  protected abstract showPodcastsPage(): Promise<void>;
  protected abstract showFavoritesPage(): Promise<void>;

  protected createUserSection(): HTMLElement[] {
    return [
      el('.user-info', { id: 'user-info' },
        el('button.user-name-btn', {
          id: 'user-name',
          onclick: () => this.showProfilePage()
        }, ''),
        el('button.nav-btn', {
          onclick: () => this.handleLogout()
        }, 'Выход')
      ),
      el('.auth-buttons', { id: 'auth-buttons' },
        el('button.nav-btn.auth-btn', {
          onclick: () => this.showAuthPage()
        }, 'Войти')
      )
    ];
  }

  protected updateNavigation(): void {
    const isAuthenticated = storageService.isAuthenticated();
    const user = storageService.getUser();

    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');

    if (isAuthenticated && user) {
      if (authButtons) authButtons.style.display = 'none';
      if (userInfo) userInfo.style.display = 'flex';
      if (userName) userName.textContent = user.username;
    } else {
      if (authButtons) authButtons.style.display = 'flex';
      if (userInfo) userInfo.style.display = 'none';
    }
  }

  protected abstract showProfilePage(): Promise<void>;
  protected abstract showAuthPage(): void;
  protected abstract handleLogout(): void;
}