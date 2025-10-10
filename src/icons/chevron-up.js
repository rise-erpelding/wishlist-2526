import { LitElement, svg, css } from 'lit';

export class ChevronUp extends LitElement {
  static properties = {
    size: { type: Number }
  };

  constructor() {
    super();
    this.size = 10;
  }

  static styles = css`
    :host {
      display: inline-block;
      margin: 0 0.25rem;
    }
  `;

  render() {
    return svg`
      <svg
        width="${this.size}"
        height="${this.size}"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 9.95a.875.875 0 0 1-.615-1.498L5.88 5 2.385 1.547A.875.875 0 0 1 3.615.302L7.74 4.377a.876.876 0 0 1 0 1.246L3.615 9.698A.87.87 0 0 1 3 9.95"
          transform="rotate(-90, 5, 5)"
        />
      </svg>
    `;
  }
}

customElements.define('chevron-up', ChevronUp);
