import { el } from 'redom';

export class Input {
  private element: HTMLInputElement;

  constructor(
    placeholder: string,
    type: string = 'text',
    className: string = 'input'
  ) {
    this.element = el('input', {
      type: type,
      placeholder: placeholder,
      className: className
    }) as HTMLInputElement;
  }

  getValue(): string {
    return this.element.value;
  }

  setValue(value: string): void {
    this.element.value = value;
  }

  getElement(): HTMLInputElement {
    return this.element;
  }
}