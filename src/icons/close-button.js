import { LitElement, svg } from 'lit';

export class CloseButton extends LitElement {
  static properties = {
    size: { type: Number }
  };

  constructor() {
    super();
    this.size = 10;
  }

  render() {
    return svg`
      <svg
        width="${this.size}"
        height="${this.size}"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="10" y1="10" x2="90" y2="90" stroke="black" stroke-width="10" />
        <line x1="90" y1="10" x2="10" y2="90" stroke="black" stroke-width="10" />
      </svg>
    `;
  }
}

customElements.define('close-button', CloseButton);
