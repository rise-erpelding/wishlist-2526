import { fetchEntries } from './contentful.js';

/**
 * Fetch all wishlists from Contentful
 * @returns {Promise<Array>} Array of wishlist entries
 */
export async function fetchWishLists() {
  return await fetchEntries('wishList');
}

/**
 * Fetch all categories from Contentful
 * @returns {Promise<Array>} Array of category entries
 */
export async function fetchCategories() {
  return await fetchEntries('category');
}

/**
 * Fetch all items from Contentful
 * @returns {Promise<Array>} Array of item entries
 */
export async function fetchItems() {
  return await fetchEntries('item');
}

/**
 * Fetch all wishlist data (wishlists, categories, and items)
 * @returns {Promise<object>} Object containing wishlists, categories, and items arrays
 */
export async function fetchAllWishListData() {
  try {
    const [wishLists, categories, items] = await Promise.all([
      fetchWishLists(),
      fetchCategories(),
      fetchItems()
    ]);

    return {
      wishLists,
      categories,
      items
    };
  } catch (error) {
    console.error('Error fetching wishlist data:', error);
    return {
      wishLists: [],
      categories: [],
      items: []
    };
  }
}