/**
 * Strapi CMS Configuration
 *
 * Configuration for connecting to Strapi backend
 */

export const strapiConfig = {
  // Update these when Strapi is set up
  baseUrl: process.env.STRAPI_URL || 'http://localhost:1337',
  apiPath: '/api',

  // API endpoints
  endpoints: {
    wishlists: '/wishlists',
    categories: '/categories',
    items: '/items'
  }
};

/**
 * Helper to construct full API URL
 */
export function getStrapiUrl(endpoint) {
  return `${strapiConfig.baseUrl}${strapiConfig.apiPath}${endpoint}`;
}
