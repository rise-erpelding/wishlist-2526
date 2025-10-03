import { LitElement, html, css } from 'lit';
// import { patchEntry } from '../lib/contentful.js';

export class ClaimItemForm extends LitElement {
  static properties = {
    itemId: { type: String },          // maps `itemId` attribute
    handleShowClaimed: { type: Function }, 
    handleCloseForm: { type: Function }
  };

  constructor() {
    super();
    this.itemId = '';
    this.handleShowClaimed = () => {};
    this.handleCloseForm = () => {};
  }

  static styles = css`
    .claim-item-form {
      background: white;
      padding-top: 1.5rem;
      margin-top: 1.5rem;
      border-top: 1px solid #a3a3a3;
    }
    .email-input {
      display: block;
      border: 1px solid #737373;
      width: 100%;
      height: 2.5rem;
      border-radius: 0.5rem;
      padding: 0 0.5rem;
    }
    .button {
      border-radius: 0.5rem;
      padding: 0.5rem;
      font-size: 0.875rem;
    }
    .button-claim {
      background: #2563eb;
      color: white;
      border: none;
    }
    .button-no-email {
      border: 1px solid black;
      background: transparent;
    }
  `;

  handleInputChange(e) {
    this.emailAddress = e.target.value;
  }

  handleClaimWithoutEmail(e) {
    e.preventDefault();
    console.log("handling claim without email");
    if (this.handleShowClaimed) this.handleShowClaimed();
    // patchEntry(this.itemId, { isClaimed: true });
  }

  handleClaimWithEmail(e) {
    e.preventDefault();
    console.log("handling claim with email:", this.emailAddress);
    // patchEntry(this.itemId, { isClaimed: true, claimedBy: this.emailAddress });
    if (this.handleShowClaimed) this.handleShowClaimed();
  }

  render() {
    return html`
      <div class="claim-item-form">
        <div style="display: flex; flex-direction: row-reverse;">
          <button @click=${this.handleCloseForm}>
            <close-button size="16"></close-button>
          </button>
        </div>
        <form>
          <label for="email">Email</label>
          <input
            id="email"
            class="email-input"
            type="email"
            .value=${this.emailAddress}
            @input=${this.handleInputChange}
          />
          <p>Only visible to list owner</p>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button
              class="button button-no-email"
              @click=${this.handleClaimWithoutEmail}
            >
              Claim without email
            </button>
            <button
              class="button button-claim"
              @click=${this.handleClaimWithEmail}
            >
              Claim item
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('wish-claim-item-form', ClaimItemForm);
