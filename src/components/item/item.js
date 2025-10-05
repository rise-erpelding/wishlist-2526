import { LitElement, html } from 'lit';
import '../claim-item/claim-item.js';
import styles from './item.css?inline';

export class Item extends LitElement {
  static properties = {
    currentItem: { type: Object }
  };

  constructor() {
    super();
    this.currentItem = {};
  }

  static styles = new CSSStyleSheet();

  connectedCallback() {
    super.connectedCallback();
    if (!Item.styles.cssRules.length) {
      Item.styles.replaceSync(styles);
    }
    this.shadowRoot.adoptedStyleSheets = [Item.styles];
  }

  render() {
    if (!this.currentItem || !this.currentItem.fields) {
      return html``;
    }

    const { fields } = this.currentItem;
    const isClaimed = fields.isClaimed;

    return html`
      <div class="title-section">
        ${fields.url
          ? html`
              <a href=${fields.url} class="underline decoration-neutral-500">
                <h4 class=${isClaimed ? "line-through" : ""}>
                  ${fields.title}
                </h4>
              </a>
            `
          : html`
              <h4 class=${isClaimed ? "line-through" : ""}>
                ${fields.title}
              </h4>
            `}
      </div>

      <div class="description-section">
        ${fields.description
          ? html`
              <p class=${isClaimed ? "line-through" : ""}>
                ${fields.description}
              </p>
            `
          : ""}
      </div>

      <div class="image-section">
        ${fields.url
          ? html`
              <a href=${fields.url}>
                <img
                  alt=${fields.title}
                  src=${fields.imageUrl || "/present.jpg"}
                  class="image"
                  width="150"
                  height="150"
                />
              </a>
            `
          : html`
              <img
                alt=${fields.title}
                src=${fields.imageUrl || "/present.jpg"}
                class="image"
                width="150"
                height="150"
              />
            `}
      </div>

      <div class="claim-item-section">
        <wish-claim-item .currentItem=${this.currentItem}></wish-claim-item>
      </div>
    `;
  }
}

if (!customElements.get('wish-item')) {
  customElements.define('wish-item', Item);
}
