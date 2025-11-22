import { createClient as createDeliveryClient } from 'contentful';

// Delivery client for fetching content (read-only)
const client = createDeliveryClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
});

/**
 * Fetch entries from Contentful
 * @param {string} content_type - The content type ID to fetch
 * @param {object} options - Additional query options
 * @returns {Promise<Array>} Array of entries
 */
export async function fetchEntries(content_type, options = {}) {
  try {
    const entries = await client.getEntries({
      content_type,
      ...options
    });
    return entries.items;
  } catch (error) {
    console.error('Error fetching entries:', error);
    return [];
  }
}

/**
 * Update an entry in Contentful via Netlify function
 * @param {string} entryId - The ID of the entry to update
 * @param {object} updatedFields - Object with field names and values to update
 * @returns {Promise<object>} The updated and published entry
 */
export async function patchEntry(entryId, updatedFields) {
  try {
    const response = await fetch('/.netlify/functions/claim-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entryId, updatedFields }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update entry');
    }

    return data.entry;
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
}
