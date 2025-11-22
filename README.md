# Wishlist 2025-26

A web-based wishlist application that displays and manages wishlists from Contentful CMS. Users can view wishlist items organized by category, claim items they plan to buy, and unclaim them if needed.

## Features

- Display multiple wishlists with items organized by category
- Claim/unclaim items by optionally providing an email address
- Filter to hide claimed items
- Collapsible wishlists and categories
- Item details including title, description, images, and links
- Real-time updates to Contentful

## Tech Stack

- **Lit** (v3.3.1) - Lightweight web component library
- **Contentful** - Headless CMS for content management
- **Vite** (v7.1.6) - Fast build tool and dev server
- **Netlify Functions** - Serverless functions for secure API calls
- **Node.js** v24+ - Runtime environment

## Prerequisites

- Node.js >= 24 < 25 (recommended: v24.11.0)
- npm package manager
- Contentful account with API credentials
- Netlify CLI (for local development with functions)

## Getting Started

### 1. Install Dependencies

```bash
# Use correct Node version (if using nvm)
nvm use

# Install packages
npm install
```

### 2. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Then edit `.env` with your Contentful credentials:

```env
# Client-side (bundled into JS)
VITE_CONTENTFUL_SPACE_ID=your_space_id_here
VITE_CONTENTFUL_ACCESS_TOKEN=your_delivery_token_here
VITE_CONTENTFUL_ENVIRONMENT=master

# Server-side (Netlify Functions only - never exposed to browser)
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here
CONTENTFUL_ENVIRONMENT=master
```

**Where to find these:**
1. Go to [Contentful](https://app.contentful.com)
2. Navigate to Settings → API keys
3. Copy the Space ID and Content Delivery API token (for client-side)
4. Create a Content Management API token (for server-side functions)

### 3. Run the Application

**Development (with Netlify Functions):**
```bash
netlify dev
```
Opens at `http://localhost:8888`

**Development (Vite only, no functions):**
```bash
npm run dev
```
Opens at `http://localhost:5173`

**Production build:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## Project Structure

```
wishlist-2526/
├── src/
│   ├── main.js              # Application entry point
│   ├── lib/                 # Contentful API client & services
│   ├── components/          # Lit web components
│   │   ├── list/           # Wishlist component
│   │   ├── category/       # Category component
│   │   ├── item/           # Item component
│   │   ├── claim-item/     # Claim button component
│   │   └── claim-item-form/ # Claim form component
│   ├── icons/              # SVG icon components
│   └── styles/             # Global CSS
├── netlify/
│   └── functions/          # Netlify serverless functions
│       └── claim-item.js   # Handles claiming items (secure)
├── tools/
│   └── add-item.js        # CLI tool to add items to Contentful
├── public/                 # Static assets
└── index.html             # Main HTML entry point
```

## Component Architecture

The app uses Lit web components with Shadow DOM:

```
<wish-list>                    # Wishlist container
  └─ <wish-category>          # Categories within list
      └─ <wish-item>          # Individual items
          └─ <wish-claim-item>  # Claim button/form
              └─ <wish-claim-item-form>  # Form for claiming
```

## Adding Items

Use the CLI tool to add items interactively:

```bash
npm run add-item
```

The tool will prompt for URL, title, description, wishlist, and category. It automatically extracts product images from the URL when possible.

## Contentful Content Model

The application expects these content types in Contentful:

- **wishList** - Top-level wishlist container
- **category** - Groups of items
- **item** - Individual wishlist items with fields:
  - `title`, `description`, `imageUrl`, `url`
  - `isClaimed` (boolean)
  - `claimedBy` (string)
  - `isStale` (boolean)

## License

Private project
