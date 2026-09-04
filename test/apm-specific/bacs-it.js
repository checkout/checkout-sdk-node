import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { ValidationError } from '../../src/services/errors.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
    environment: 'sandbox',
    // Matches test/instruments/instruments-it.js: the sandbox clients are not
    // provisioned for the merchant-specific subdomain.
    useLegacyDomain: true,
});

const bacsInstrumentRequest = {
    type: 'bacs',
    account: {
        processing_channel_id: process.env.CHECKOUT_PROCESSING_CHANNEL_ID,
    },
    instrument_data: {
        account_number: '86753246',
        bank_code: '040004',
        country: 'GB',
        currency: 'GBP',
        payment_type: 'Recurring',
        allow_partial_match: true,
    },
    account_holder: {
        first_name: 'John',
        last_name: 'Smith',
        billing_address: {
            address_line1: 'Cloverfield St.',
            address_line2: '23A',
            city: 'London',
            zip: 'SW1A 1AA',
            country: 'GB',
        },
    },
};

const notificationRequest = (sourceId) => ({
    source_id: sourceId,
    notification_type: 'advance_notice',
    collection_date: '2027-07-15',
    amount: 4999,
    currency: 'GBP',
    reference: 'INV-12345',
    customer_email: 'customer@example.com',
    billing_descriptor: 'CHECKOUT',
    support_email: 'support@test.com',
    support_phone: '+447700900123',
});

// Skipped: not verified against the live sandbox. `POST /apms/bacs/notifications`
// requires the merchant account to be provisioned for Bacs Direct Debit, which the
// shared sandbox merchant is not, and these calls could not be exercised from the
// authoring environment (no outbound network — every other `*-it.js` suite fails the
// same way there). Unskip and confirm the assertions once a Bacs-enabled sandbox
// account is available.
describe.skip('Bacs Direct Debit', () => {
    describe('Notifications', () => {
        it('Should send a pre-notification for a Bacs instrument', async () => {
            const instrument = await cko.instruments.create(bacsInstrumentRequest);
            const response = await cko.bacs.sendNotification(
                notificationRequest(instrument.id)
            );

            expect(response).to.not.be.null;
            expect(response.event_id).to.not.be.null;
        });
    });

    describe('Validation', () => {
        it('Should return a ValidationError with an empty notification request', async () => {
            try {
                await cko.bacs.sendNotification({});
                expect.fail('should have thrown ValidationError');
            } catch (error) {
                expect(error).to.be.instanceOf(ValidationError);
            }
        });

        it('Should return a ValidationError with an unknown source id', async () => {
            try {
                await cko.bacs.sendNotification(
                    notificationRequest('src_wmlfc3zyhqzehihu7giusaaawu')
                );
                expect.fail('should have thrown ValidationError');
            } catch (error) {
                expect(error).to.be.instanceOf(ValidationError);
            }
        });
    });
});
