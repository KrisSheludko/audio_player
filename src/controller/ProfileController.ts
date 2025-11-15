import { ProfilePage } from '../view/pages/ProfilePage';
import { storageService } from '../services/StorageService';
import { apiService } from '../services/ApiService';
import type { UserProfile } from '../types/index';

export class ProfileController {
  private profilePage: ProfilePage | null = null;

  constructor(
    private onLogout: () => void
  ) { }

  async getProfilePage(): Promise<ProfilePage> {
    const user = storageService.getUser();

    if (!user) {
      throw new Error('Пользователь не авторизован');
    }

    const profile = await this.loadUserProfile(user);

    this.profilePage = new ProfilePage(
      profile,
      this.onLogout
    );

    return this.profilePage;
  }

  private async loadUserProfile(user: any): Promise<UserProfile> {
    try {
      const favorites = await apiService.getFavorites();

      return {
        username: user.username,
        email: user.email,
        joinDate: new Date().toISOString(),
        favoritesCount: favorites.length
      };
    } catch (error) {
      return {
        username: user.username,
        email: user.email
      };
    }
  }

  async refreshProfile(): Promise<void> {
    if (this.profilePage) {
      const user = storageService.getUser();
      if (user) {
        const profile = await this.loadUserProfile(user);
        this.profilePage.updateProfile(profile);
      }
    }
  }
}