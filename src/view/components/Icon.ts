import { el } from 'redom';

export class Icon {
  private element: HTMLElement;

  constructor(iconName: string, className: string = 'icon', size: number = 24) {
    this.element = el(`svg.${className}`, {
      width: size,
      height: size,
      fill: 'currentColor'
    },
      el('use', {
        'href': `#icon-${iconName}`
      })
    );

    this.element.style.color = 'currentColor';
    this.element.style.fill = 'currentColor';
  }

  getElement(): HTMLElement {
    return this.element;
  }
}