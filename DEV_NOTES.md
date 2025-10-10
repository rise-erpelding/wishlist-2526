# Development Notes

## Project Overview
Wishlist application built with Lit web components. Migrating from Contentful to Strapi CMS, with added support for importing items from external sources.

## Recent Work (2025-10-10)

### External Wishlist Import Feature

Built a system to import wishlist items from external HTML sources (keeping the source discreet in code).

**Architecture:**

```
scripts/
├── external-source.html       # Paste external HTML here (gitignored)
├── parse-external-items.js    # Parser script
├── import-output.json         # Generated output (gitignored)
└── README.md                  # Usage instructions

src/data/
├── data-service.js            # Unified data fetcher
├── external-items.json        # Committed snapshot of imported items
└── strapi-config.js           # Strapi config (for future use)
```

**How it works:**

1. **Import external items:**
   ```bash
   # Get HTML from external source
   # Paste into scripts/external-source.html
   node scripts/parse-external-items.js
   cp scripts/import-output.json src/data/external-items.json
   ```

2. **Data service** (`src/data/data-service.js`):
   - Currently loads items from `external-items.json`
   - Ready to fetch from Strapi and merge both sources
   - Returns unified data structure: `{ wishlists, categories, items }`

3. **Main app** (`src/main.js`):
   - Now uses `fetchWishlistData()` instead of mock data
   - Components unchanged - just get data from new source

**What the parser extracts:**
- Title
- Description (author/brand/byline)
- Image URL
- Price
- External ID (ASIN)
- Clean product URL: `https://www.amazon.com/dp/{ASIN}`

**Current state:**
- ✅ Parser working (extracts 10 items successfully)
- ✅ Data service architecture in place
- ✅ App loading external items
- ✅ Ready for Strapi integration

## Open Questions

### Claim Handling for External Items

**The Problem:**
External items are in a static JSON file. When someone claims an item, where does that state get saved?

**Options discussed:**

1. **LocalStorage** - Simple, browser-only, not shareable
2. **Hybrid (recommended)** - Strapi stores just claim state, merges with external items on load
3. **Full import** - Copy all external items to Strapi, make it source of truth
4. **Read-only** - External items can't be claimed, only Strapi items support claiming

**Recommended approach: Hybrid**
- External items stay in JSON (easy to update)
- Strapi has a "Claims" table: `{ externalId, claimedBy, claimedAt }`
- Data service merges claims with items on fetch
- Benefit: Claims are persistent/shareable without duplicating all item data

**Implementation sketch:**
```javascript
// In data-service.js
const externalItems = [...];
const claims = await fetchClaimsFromStrapi();

const mergedItems = externalItems.map(item => ({
  ...item,
  fields: {
    ...item.fields,
    isClaimed: claims.some(c => c.externalId === item.fields.externalId),
    claimedBy: claims.find(c => c.externalId === item.fields.externalId)?.claimedBy
  }
}));
```

**Next steps:**
1. Decide on claim handling approach
2. Set up Strapi
3. Create Strapi content types (wishlists, categories, items, claims?)
4. Implement Strapi API integration in data service
5. Test merged data from both sources

## Important Notes

- External source details kept generic in code/docs (public repo, discretion)
- Parser uses multiple selector fallbacks (accounts for HTML changes)
- HTML entities properly decoded (quotes, ampersands, etc.)
- `src/data/external-items.json` is committed (snapshot), working files in `scripts/` are gitignored

## Data Structure

Items follow this format (compatible with previous Contentful structure):

```json
{
  "sys": { "id": "external-{ASIN}" },
  "fields": {
    "title": "Item Title",
    "description": "by Author (Format)",
    "url": "https://www.amazon.com/dp/{ASIN}",
    "imageUrl": "https://...",
    "price": "$X.XX",
    "isClaimed": false,
    "externalId": "{ASIN}",
    "source": "external",
    "category": [{ "sys": { "id": "category-id" } }],
    "wishList": [{ "sys": { "id": "wishlist-id" } }]
  }
}
```

## Files Changed/Added

**New:**
- `scripts/parse-external-items.js`
- `scripts/external-source.html`
- `scripts/README.md`
- `src/data/data-service.js`
- `src/data/strapi-config.js`
- `src/data/external-items.json`

**Modified:**
- `src/main.js` - Uses data service instead of mock data
- `.gitignore` - Added working files exclusions

**Kept for reference:**
- `src/mock-data.js` - Can remove once Strapi is set up
