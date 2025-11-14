import { createClient as createDeliveryClient } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';

// Delivery client for fetching content (read-only)
const client = createDeliveryClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
});

// Management client for updating content (write operations)
const managementClient = createManagementClient({
  accessToken: import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN,
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
 * Update an entry in Contentful
 * @param {string} entryId - The ID of the entry to update
 * @param {object} updatedFields - Object with field names and values to update
 * @returns {Promise<object>} The updated and published entry
 */
export async function patchEntry(entryId, updatedFields) {
  try {
    const space = await managementClient.getSpace(import.meta.env.VITE_CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment(import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master');

    const entry = await environment.getEntry(entryId);

    // Update fields (assuming 'en-US' locale)
    Object.keys(updatedFields).forEach(field => {
      entry.fields[field] = { 'en-US': updatedFields[field] };
    });

    const updatedEntry = await entry.update();
    const publishedEntry = await updatedEntry.publish();

    return publishedEntry;
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
}
