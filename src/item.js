import { LitElement, html, css } from 'lit';
import './claim-item.js';

export class Item extends LitElement {
  static properties = {
    currentItem: { type: Object }
  };

  constructor() {
    super();
    this.currentItem = {};
  }

  static styles = css`
      .item {
        display: grid;
        grid-template-areas:
          "image"
          "title"
          "description"
          "claim";
        gap: 0.5rem;

        padding: 1.5rem;       /* p-6 */
        margin-bottom: 0.5rem; /* mb-2 */
        border-radius: 0.5rem; /* rounded-lg */
        background: white;     /* bg-white */
        box-shadow: 0 1px 3px rgba(0,0,0,0.1),
                    0 1px 2px rgba(0,0,0,0.06); /* shadow */
        max-width: 56rem;      /* max-w-4xl */
      }

      .item-title-section {
        grid-area: title;
      }

      .item-description-section {
        grid-area: description;
      }

      .item-image-section {
        grid-area: image;
      }

      .item-claim-item-section {
        grid-area: claim;
      }

      .item-image {
        max-width: 200px;
      }

      h4 {
        margin: 0;
        font-weight: 600;   /* font-semibold */
        margin-bottom: 0.25rem; /* mb-1 */
        font-size: 1.5rem;  /* text-2xl */
      }

      h4.line-through {
        color: #737373; /* neutral-500 */
        text-decoration: line-through;
      }

      p {
        font-size: 1.25rem; /* text-xl */
      }

      p.line-through {
        color: #737373; /* neutral-500 */
        text-decoration: line-through;
      }

      a {
        text-decoration: underline;
        text-decoration-color: #737373; /* decoration-neutral-500 */
      }

      @media screen and (min-width: 768px) {
        .item {
          grid-template-areas:
            "title  title       title"
            "image  description description"
            "image  description description"
            "image  claim       claim";
        }

        .item:has(.claim-item-form) {
          grid-template-areas:
            "title title       claim claim"
            "image description claim claim"
            "image description claim claim"
            "image description claim claim";
        }

        h4 {
          font-size: 1.25rem; /* md:text-xl */
        }

        p {
          font-size: 1rem; /* md:text-base */
        }
      }
    `;

  render() {
    if (!this.currentItem || !this.currentItem.fields) {
      return html``;
    }

    const { fields } = this.currentItem;
    const isClaimed = fields.isClaimed;

    return html`
      <li class="item">
        <div class="item-title-section">
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

        <div class="item-description-section">
          ${fields.description
            ? html`
                <p class=${isClaimed ? "line-through" : ""}>
                  ${fields.description}
                </p>
              `
            : ""}
        </div>

        <div class="item-image-section">
          ${fields.url
            ? html`
                <a href=${fields.url}>
                  <img
                    alt=${fields.title}
                    src=${fields.imageUrl || "/present.jpg"}
                    class="item-image"
                    width="150"
                    height="150"
                  />
                </a>
              `
            : html`
                <img
                  alt=${fields.title}
                  src=${fields.imageUrl || "/present.jpg"}
                  class="item-image"
                  width="150"
                  height="150"
                />
              `}
        </div>

        <div class="item-claim-item-section">
          <wish-claim-item .currentItem=${this.currentItem}></wish-claim-item>
        </div>
      </li>
    `;
  }
}

if (!customElements.get('wish-item')) {
  customElements.define('wish-item', Item);
}
