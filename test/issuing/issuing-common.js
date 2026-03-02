/**
 * Shared setup for Issuing integration tests.
 * Aligned with checkout-sdk-net IssuingCommon.cs
 *
 * Requires: CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_ID, CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_SECRET
 * Optional: CHECKOUT_MERCHANT_SUBDOMAIN, CHECKOUT_ISSUING_ENTITY_ID, CHECKOUT_ISSUING_CARD_PRODUCT_ID
 */
import Checkout from '../../src/Checkout.js';

export const cko_issuing = new Checkout(process.env.CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_SECRET, {
    client: process.env.CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_ID,
    scope: ['issuing:card-mgmt', 'issuing:client', 'issuing:controls-read', 'issuing:controls-write', 'issuing:transactions-read', 'vault'],
    environment: 'sandbox',
    subdomain: process.env.CHECKOUT_MERCHANT_SUBDOMAIN,
});

export const ISSUING_ENTITY_ID = process.env.CHECKOUT_ISSUING_ENTITY_ID || 'ent_mujh2nia2ypezmw5fo2fofk7ka';
export const ISSUING_CARD_PRODUCT_ID = process.env.CHECKOUT_ISSUING_CARD_PRODUCT_ID || 'pro_3fn6pv2ikshurn36dbd3iysyha';
export const ISSUING_CARD_PRODUCT_ID_BAD = 'pro_2ebzpnw3wvcefnu7fqglqmg56m';

export const cardholderRequestBody = () => ({
    type: 'individual',
    reference: 'X-123456-N11',
    entity_id: ISSUING_ENTITY_ID,
    first_name: 'John',
    middle_name: 'Fitzgerald',
    last_name: 'Kennedy',
    email: 'john.kennedy@myemaildomain.com',
    phone_number: { country_code: '+1', number: '415 555 2671' },
    date_of_birth: '1985-05-15',
    billing_address: {
        address_line1: 'Checkout.com',
        address_line2: '90 Tottenham Court Road',
        city: 'London',
        state: 'London',
        zip: 'W1T 4TJ',
        country: 'GB',
    },
    residency_address: {
        address_line1: 'Checkout.com',
        address_line2: '90 Tottenham Court Road',
        city: 'London',
        state: 'London',
        zip: 'W1T 4TJ',
        country: 'GB',
    },
    document: {
        type: 'passport',
        front_document_id: 'file_6lbss42ezvoufcb2beo76rvwly',
        back_document_id: 'file_aaz5pemp6326zbuvevp6qroqu4',
    },
});

export const createCardholder = async () => cko_issuing.issuing.createCardholder(cardholderRequestBody());

export const createCard = async (cardholder, active = false) =>
    cko_issuing.issuing.createCard({
        type: 'virtual',
        cardholder_id: cardholder.id,
        lifetime: { unit: 'Months', value: 6 },
        reference: "X-123456-N11'",
        card_product_id: ISSUING_CARD_PRODUCT_ID,
        display_name: 'JOHN KENNEDY',
        is_single_use: false,
        activate_card: active,
    });

export const createCardControl = async (card) =>
    cko_issuing.issuing.createCardControl({
        description: 'Max spend of 500€ per week for restaurants',
        control_type: 'velocity_limit',
        target_id: card.id,
        velocity_limit: { amount_limit: 5000, velocity_window: { type: 'weekly' } },
    });

export const createSimulatedTransaction = async (card, cardDetails) => {
    const details = cardDetails || card;
    return cko_issuing.issuing.simulateAuthorization({
        card: {
            id: card.id,
            expiry_month: details.expiry_month,
            expiry_year: details.expiry_year,
        },
        transaction: { type: 'purchase', amount: 2500, currency: 'GBP' },
    });
};
