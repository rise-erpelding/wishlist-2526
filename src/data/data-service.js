/**
 * Data Service
 *
 * Unified data layer that fetches wishlist data from multiple sources:
 * - External items (from imported JSON)
 * - Strapi CMS (future integration)
 */

import externalItems from './external-items.json';

/**
 * Fetch all wishlist data from available sources
 * @returns {Promise<Object>} Combined data with wishlists, categories, and items
 */
export async function fetchWishlistData() {
  // For now, just return external items
  // Later, this will also fetch from Strapi and merge the data

  const items = externalItems;

  // Group external items into a default wishlist and category
  const wishlists = [
    {
      sys: { id: 'external-wishlist' },
      fields: { title: 'Imported Wishlist' }
    }
  ];

  const categories = [
    {
      sys: { id: 'external-category' },
      fields: {
        title: 'External Items',
        wishList: [{ sys: { id: 'external-wishlist' } }]
      }
    }
  ];

  // Add category reference to each item
  const itemsWithCategory = items.map(item => ({
    ...item,
    fields: {
      ...item.fields,
      category: [{ sys: { id: 'external-category' } }],
      wishList: [{ sys: { id: 'external-wishlist' } }]
    }
  }));

  return {
    wishlists,
    categories,
    items: itemsWithCategory
  };
}

/**
 * Future: Fetch data from Strapi CMS
 */
async function fetchStrapiData() {
  // TODO: Implement Strapi API integration
  // const response = await fetch('http://localhost:1337/api/wishlists?populate=*');
  // const data = await response.json();
  // return transformStrapiData(data);

  return {
    wishlists: [],
    categories: [],
    items: []
  };
}

/**
 * Future: Merge data from multiple sources
 */
function mergeDataSources(external, strapi) {
  return {
    wishlists: [...external.wishlists, ...strapi.wishlists],
    categories: [...external.categories, ...strapi.categories],
    items: [...external.items, ...strapi.items]
  };
}
