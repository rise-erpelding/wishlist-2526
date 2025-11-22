import { createClient as createManagementClient } from 'contentful-management';

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { entryId, updatedFields } = JSON.parse(event.body);

    if (!entryId || !updatedFields) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing entryId or updatedFields' }),
      };
    }

    // Management client uses server-side env vars (no VITE_ prefix)
    const managementClient = createManagementClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });

    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');

    const entry = await environment.getEntry(entryId);

    // Update fields (assuming 'en-US' locale)
    Object.keys(updatedFields).forEach(field => {
      entry.fields[field] = { 'en-US': updatedFields[field] };
    });

    const updatedEntry = await entry.update();
    const publishedEntry = await updatedEntry.publish();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        entry: {
          sys: publishedEntry.sys,
          fields: publishedEntry.fields,
        },
      }),
    };
  } catch (error) {
    console.error('Error updating entry:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
