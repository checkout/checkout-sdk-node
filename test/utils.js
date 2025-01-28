import Checkout from '../src/Checkout.js';
import { v4 as uuidv4 } from 'uuid';

const cko_platforms = new Checkout(process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_SECRET, {
  client: process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_ID,
  scope: ['accounts'],
  environment: 'sandbox',
});

/**
 * Generates a future ISO date string by adding days to the current date.
 * @param {number} days Number of days to add to the current date.
 * @returns {string} ISO string of the future date.
 */
export const generateFutureDate = (days = 1) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days); // Add days
  return futureDate.toISOString(); // Convert to ISO format
};

/**
 * Creates a sub-entity and returns its ID.
 * @returns {Promise<string>} The ID of the created sub-entity.
 */
export const createEntity = async () => {
  const randomReference = `ref_${uuidv4().slice(0, 8)}`;
  const randomEmail = `user_${uuidv4().slice(0, 8)}@example.com`;

  const response = await cko_platforms.platforms.onboardSubEntity({
    reference: randomReference,
    is_draft: true,
    contact_details: {
      invitee: {
        email: randomEmail
      }
    }
  });

  if (!response || !response.id) {
    throw new Error('Failed to create entity');
  }

  return response.id;
};
