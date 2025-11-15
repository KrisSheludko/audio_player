import { el } from 'redom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export class AuthPage {
  private element: HTMLElement;
  public isLoginMode: boolean = true;
  private formContainer: HTMLElement;
  private usernameInput: Input;
  private emailInput: Input;
  private passwordInput: Input;

  constructor(
    private onLogin: (username: string, password: string) => void,
    private onRegister: (username: string, email: string, password: string) => void
  ) {
    this.usernameInput = new Input('Введите логин', 'text', 'auth-input');
    this.emailInput = new Input('Введите email', 'email', 'auth-input');
    this.passwordInput = new Input('Введите пароль', 'password', 'auth-input');

    this.formContainer = this.createForm();

    this.element = el('.auth-page',
      el('.auth-container',
        el('.auth-card',
          el('.auth-header',
            el('h1.auth-title', 'Audio Player')
          ),
          this.formContainer
        )
      )
    );
  }

  private createForm(): HTMLElement {
    if (this.isLoginMode) {
      this.emailInput.setValue('');
    }

    const formElements = [
      this.usernameInput.getElement(),
      this.passwordInput.getElement()
    ];

    if (!this.isLoginMode) {
      formElements.splice(1, 0, this.emailInput.getElement());
    }

    return el('.auth-form',
      el('h2.auth-form-title', this.isLoginMode ? 'Вход' : 'Регистрация'),
      el('.auth-input-group', ...formElements),
      el('.auth-actions',
        new Button(
          this.isLoginMode ? 'Войти' : 'Зарегистрироваться',
          () => this.handleSubmit(),
          'auth-submit-btn'
        ).getElement(),
        el('button.auth-toggle-btn', {
          onclick: () => this.toggleMode()
        }, this.isLoginMode
          ? 'Нет аккаунта? Зарегистрироваться'
          : 'Уже есть аккаунт? Войти')
      )
    );
  }

  public setLoginMode(isLogin: boolean): void {
    this.isLoginMode = isLogin;

    const newForm = this.createForm();
    const oldForm = this.formContainer;

    if (oldForm.parentNode) {
      oldForm.parentNode.replaceChild(newForm, oldForm);
    }

    this.formContainer = newForm;
  }

  private handleSubmit(): void {
    const username = this.usernameInput.getValue();
    const email = this.emailInput.getValue();
    const password = this.passwordInput.getValue();

    if (!username || !password) {
      this.showError('Заполните все обязательные поля');
      return;
    }

    if (!this.isLoginMode && !email) {
      this.showError('Email обязателен для регистрации');
      return;
    }

    if (password.length < 6) {
      this.showError('Пароль должен быть не менее 6 символов');
      return;
    }

    if (!this.isLoginMode && !this.isValidEmail(email)) {
      this.showError('Введите корректный email');
      return;
    }

    if (this.isLoginMode) {
      this.onLogin(username, password);
    } else {
      this.onRegister(username, email, password);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private toggleMode(): void {
    this.usernameInput.setValue('');
    this.passwordInput.setValue('');
    this.emailInput.setValue('');

    this.setLoginMode(!this.isLoginMode);
  }

  private showError(message: string): void {
    const existingError = this.formContainer.querySelector('.auth-error');
    if (existingError) {
      existingError.remove();
    }

    const errorElement = el('.auth-error', message);
    this.formContainer.insertBefore(errorElement, this.formContainer.querySelector('.auth-actions'));

    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, 5000);
  }

  getElement(): HTMLElement {
    return this.element;
  }
}