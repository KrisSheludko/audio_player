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
        alert('Заполните все поля');
        return;
      }

      const response = await apiService.login({ username, password });

      storageService.setToken(response.token);
      storageService.setUser(response.user);

      this.onAuthSuccess();
    } catch (error: any) {
      alert(error.message);
    }
  }

  private async handleRegister(username: string, email: string, password: string): Promise<void> {
    try {
      if (!username || !email || !password) {
        alert('Заполните все поля');
        return;
      }

      if (password.length < 6) {
        alert('Пароль должен быть не менее 6 символов');
        return;
      }

      await apiService.register({ username, email, password });

      await this.handleLogin(username, password);

    } catch (error: any) {
      alert(error.message);
    }
  }

  logout(): void {
    storageService.clear();
    window.location.reload();
  }

  isAuthenticated(): boolean {
    return storageService.isAuthenticated();
  }
}