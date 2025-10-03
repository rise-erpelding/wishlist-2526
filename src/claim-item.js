import { LitElement, html, css } from 'lit';
// import { patchEntry } from '../lib/contentful.js';
import './claim-item-form.js';

export class ClaimItem extends LitElement {
  static properties = {
    currentItem: { type: Object },
    showForm: { type: Boolean },
    showClaimed: { type: Boolean },
    existingClaimedStatus: { type: Boolean },
    itemId: { type: String },
  };

  constructor() {
    super();
    this.showForm = false;
    this.showClaimed = false;
    this.existingClaimedStatus = false;
    this.itemId = '';
    this.currentItem = null;
  }

  static styles = css`
    .button {
      border-radius: 0.5rem;
      padding: 0.5rem;
    }
    .button-claim {
      background: #2563eb;
      color: white;
      border: none;
    }
    .button-undo {
      border: 1px solid black;
      background: transparent;
    }
    .flex {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .justify-between {
      justify-content: space-between;
    }
    .justify-end {
      justify-content: flex-end;
    }
    .claim-prompt {
      display: none; /* Hidden on mobile */
    }
    .claimed-text {
      font-size: 1.25rem;
      font-weight: bold;
      padding-top: 1.5rem;
    }
    .subtext {
      color: #404040;
      margin-bottom: 0.5rem;
    }

    @media screen and (min-width: 768px) {
      .button {
        font-size: 0.875rem; /* md:text-sm */
      }
      .claim-prompt {
        display: block; /* Show on desktop */
      }
    }
  `;

  firstUpdated() {
    if (this.currentItem) {
      this.existingClaimedStatus = this.currentItem.fields.isClaimed;
      this.itemId = this.currentItem.sys.id;
      this.showClaimed = this.existingClaimedStatus;
    }
  }

  handleClaim() {
    this.showForm = true;
  }

  handleCloseForm = () => {
    this.showForm = false;
  };

  handleShowClaimed = () => {
    this.showClaimed = true;
    this.showForm = false;
  };

  async handleUnclaim(e) {
    e.preventDefault();
    try {
      // await patchEntry(this.itemId, { isClaimed: false, claimedBy: '' });
      console.log("handling unclaim for item:", this.itemId);
      this.showClaimed = false;
    } catch (error) {
      console.error('Failed to unclaim the item:', error);
    }
  }

  render() {
    return html`
      ${this.existingClaimedStatus && !this.showForm
        ? html`<div><h5>Already claimed</h5></div>`
        : null}

      ${!this.showForm && !this.showClaimed
        ? html`
            <div class="flex justify-between justify-end">
              <h5 class="claim-prompt">Planning to buy this? Claim it!</h5>
              <button class="button button-claim" @click=${this.handleClaim}>
                Claim
              </button>
            </div>
          `
        : null}

      ${this.showForm
        ? html`
            <wish-claim-item-form
              .itemId=${this.itemId}
              .handleShowClaimed=${this.handleShowClaimed}
              .handleCloseForm=${this.handleCloseForm}
            ></wish-claim-item-form>
          `
        : null}

      ${!this.existingClaimedStatus && this.showClaimed && !this.showForm
        ? html`
            <div class="flex justify-between">
              <p class="claimed-text">Claimed!</p>
              <div style="text-align: right;">
                <p class="subtext">Need to undo?</p>
                <button
                  class="button button-undo"
                  @click=${this.handleUnclaim}
                >
                  Undo?
                </button>
              </div>
            </div>
          `
        : null}
    `;
  }
}

customElements.define('wish-claim-item', ClaimItem);
