import { el } from 'redom';
import { UserProfile } from '../../types/index';
import { Button } from '../components/Button';

export class ProfilePage {
  private element: HTMLElement;

  constructor(
    private profile: UserProfile,
    private onLogout: () => void
  ) {
    this.element = this.createProfilePage();
  }

  private createProfilePage(): HTMLElement {
    const infoRows = [
      el('.info-row',
        el('.info-label', 'Пользователь'),
        el('.info-value.profile-username', this.profile.username)
      )
    ];

    if (this.profile.email) {
      infoRows.push(
        el('.info-row',
          el('.info-label', 'Email'),
          el('.info-value.profile-email', this.profile.email)
        )
      );
    }

    return el('.profile-page',
      el('.profile-page-container',
        el('.profile-content',
          el('.profile-header',
            el('.profile-avatar-container',
              this.createAvatar()
            ),
            el('.profile-info-container',
              el('.profile-info', ...infoRows)
            )
          ),
          el('.profile-actions',
            new Button(
              'Выйти',
              this.onLogout,
              'nav-btn'
            ).getElement()
          )
        )
      )
    );
  }

  private createAvatar(): HTMLElement {
    const avatarContainer = el('.profile-avatar');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '80');
    svg.setAttribute('height', '80');
    svg.setAttribute('viewBox', '0 0 80 80');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '40');
    circle.setAttribute('cy', '40');
    circle.setAttribute('r', '40');
    circle.setAttribute('fill', '#667eea');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '40');
    text.setAttribute('y', '48');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '24');
    text.setAttribute('font-weight', 'bold');
    text.textContent = this.getAvatarInitials();

    svg.appendChild(circle);
    svg.appendChild(text);
    avatarContainer.appendChild(svg);

    return avatarContainer;
  }

  private getAvatarInitials(): string {
    return this.profile.username
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }

  getElement(): HTMLElement {
    return this.element;
  }

  updateProfile(profile: UserProfile): void {
    this.profile = profile;
    const newElement = this.createProfilePage();
    if (this.element.parentNode) {
      this.element.parentNode.replaceChild(newElement, this.element);
    }
    this.element = newElement;
  }
}