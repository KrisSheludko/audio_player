import type { AuthData, User } from '../types/index';

export class AuthService {
  private users: Map<string, { password: string; email: string }> = new Map();

  async register(userData: AuthData): Promise<{ message: string; user: User }> {
    await this.delay(500);

    if (this.users.has(userData.username)) {
      throw new Error('пользователь уже существует');
    }

    if (!userData.email) {
      throw new Error('Email обязателен для регистрации');
    }

    this.users.set(userData.username, {
      password: userData.password,
      email: userData.email
    });

    const user: User = {
      username: userData.username,
      email: userData.email
    };

    localStorage.setItem('user', JSON.stringify(user));

    return {
      message: "пользователь успешно добавлен",
      user: user
    };
  }

  async login(userData: AuthData): Promise<{ message: string; token: string; user: User }> {
    await this.delay(500);

    const savedUser = this.users.get(userData.username);
    if (!savedUser || savedUser.password !== userData.password) {
      throw new Error('произошла ошибка при авторизации — неверные данные');
    }

    const token = `mock-token-${userData.username}-${Date.now()}`;

    const user: User = {
      username: userData.username,
      email: savedUser.email
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      message: "авторизация прошла успешно",
      token: token,
      user: user
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}