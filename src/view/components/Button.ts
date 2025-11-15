import { el } from 'redom';

export class Button {
  private element: HTMLButtonElement;

  constructor(
    text: string,
    onClick: () => void,
    className: string = 'btn',
    type: 'button' | 'submit' = 'button'
  ) {
    this.element = el('button', {
      type: type,
      className: className,
      onclick: onClick
    }, text) as HTMLButtonElement;
  }

  getElement(): HTMLButtonElement {
    return this.element;
  }
}