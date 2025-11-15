import type { AuthData, User } from '../types/index';

export class MockAuthService {
  private users: Map<string, string> = new Map();

  async register(userData: AuthData): Promise<{ message: string; user: User }> {
    await this.delay(500);

    if (this.users.has(userData.username)) {
      throw new Error('пользователь уже существует');
    }

    this.users.set(userData.username, userData.password);

    return {
      message: "пользователь успешно добавлен",
      user: { username: userData.username }
    };
  }

  async login(userData: AuthData): Promise<{ message: string; token: string }> {
    await this.delay(500);

    const savedPassword = this.users.get(userData.username);
    if (!savedPassword || savedPassword !== userData.password) {
      throw new Error('произошла ошибка при авторизации — неверные данные');
    }

    const token = `mock-token-${userData.username}-${Date.now()}`;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ username: userData.username }));

    return {
      message: "авторизация прошла успешно",
      token: token
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockAuthService = new MockAuthService();