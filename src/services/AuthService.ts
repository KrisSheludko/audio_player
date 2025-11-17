import type { AuthData, User } from '../types/index';

export class AuthService {
  private readonly USERS_KEY = 'auth-users';

  async register(userData: AuthData): Promise<{ message: string; user: User }> {
    await this.delay(500);

    const users = this.getUsersFromStorage();

    if (users && users[userData.username]) {
      throw new Error('Пользователь уже существует');
    }

    if (!userData.email) {
      throw new Error('Email обязателен для регистрации');
    }

    const newUsers = {
      ...users,
      [userData.username]: {
        password: userData.password,
        email: userData.email
      }
    };

    this.saveUsersToStorage(newUsers);

    const user: User = {
      username: userData.username,
      email: userData.email
    };

    return {
      message: "Пользователь успешно добавлен",
      user: user
    };
  }

  async login(userData: AuthData): Promise<{ message: string; token: string; user: User }> {
    await this.delay(500);

    const users = this.getUsersFromStorage();
    const savedUser = users[userData.username];

    if (!savedUser) {
      throw new Error('Пользователь не найден');
    }

    if (savedUser.password !== userData.password) {
      throw new Error('Неверный пароль');
    }

    const token = `mock-token-${userData.username}-${Date.now()}`;

    const user: User = {
      username: userData.username,
      email: savedUser.email
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      message: "Авторизация прошла успешно",
      token: token,
      user: user
    };
  }

  private getUsersFromStorage(): { [username: string]: { password: string; email: string } } {
    try {
      const usersData = localStorage.getItem(this.USERS_KEY);
      if (!usersData) {
        return {};
      }
      return JSON.parse(usersData);
    } catch (error) {
      return {};
    }
  }

  private saveUsersToStorage(users: { [username: string]: { password: string; email: string } }): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}