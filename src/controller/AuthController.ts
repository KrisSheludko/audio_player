import { apiService } from '../services/ApiService';
import { storageService } from '../services/StorageService';
import { AuthPage } from '../view/pages/AuthPage';

export class AuthController {
  constructor(
    private onAuthSuccess: () => void
  ) { }

  getAuthPage(): AuthPage {
    return new AuthPage(
      (username: string, password: string) => this.handleLogin(username, password),
      (username: string, email: string, password: string) => this.handleRegister(username, email, password)
    );
  }

  private async handleLogin(username: string, password: string): Promise<void> {
    try {
      if (!username || !password) {
        return;
      }

      const response = await apiService.login({ username, password });

      storageService.setToken(response.token);
      if (response.user) {
        storageService.setUser(response.user);
      }

      this.onAuthSuccess();
    } catch (error: any) {
    }
  }

  private async handleRegister(username: string, email: string, password: string): Promise<void> {
    try {
      if (!username || !email || !password) {
        return;
      }

      if (password.length < 6) {
        return;
      }

      const response = await apiService.register({ username, email, password });

      if (response.user) {
        storageService.setUser(response.user);
      }

      await this.handleLogin(username, password);
    } catch (error: any) {
    }
  }

  logout(): void {
    storageService.clear();
  }

  isAuthenticated(): boolean {
    return storageService.isAuthenticated();
  }
}