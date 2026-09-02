import {
    AuthenticationError,
    ValidationError,
} from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

const notificationRequest = {
    source_id: 'src_wmlfc3zyhqzehihu7giusaaawu',
    notification_type: 'advance_notice',
    collection_date: '2026-07-15',
    amount: 4999,
    currency: 'GBP',
    reference: 'INV-12345',
    customer_email: 'customer@example.com',
    billing_descriptor: 'CHECKOUT',
    support_email: 'support@test.com',
    support_phone: '+447700900123',
};

describe('Bacs', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should be registered on the Checkout instance', () => {
        const cko = new Checkout(SK, { subdomain: '123456789' });

        expect(cko.bacs).to.not.be.undefined;
        expect(cko.bacs.sendNotification).to.be.a('function');
    });

    it('should send a pre-notification', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/apms/bacs/notifications')
            .reply(201, {
                event_id: 'evt_lzr4csdtddwetactr6phd3kea4',
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.bacs.sendNotification(notificationRequest);

        expect(response.event_id).to.equal('evt_lzr4csdtddwetactr6phd3kea4');
    });

    it('should send a pre-notification with only the required fields', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/apms/bacs/notifications', (body) => {
                // reference and support_phone are the only optional fields
                expect(body).to.not.have.property('reference');
                expect(body).to.not.have.property('support_phone');
                return true;
            })
            .reply(201, {
                event_id: 'evt_lzr4csdtddwetactr6phd3kea4',
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.bacs.sendNotification({
            source_id: 'src_wmlfc3zyhqzehihu7giusaaawu',
            notification_type: 'advance_notice',
            collection_date: '2026-07-15',
            amount: 4999,
            currency: 'GBP',
            customer_email: 'customer@example.com',
            billing_descriptor: 'CHECKOUT',
            support_email: 'support@test.com',
        });

        expect(response.event_id).to.equal('evt_lzr4csdtddwetactr6phd3kea4');
    });

    it('should send every request field through to the API unaltered', async () => {
        let received;
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/apms/bacs/notifications', (body) => {
                received = body;
                return true;
            })
            .reply(201, { event_id: 'evt_lzr4csdtddwetactr6phd3kea4' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.bacs.sendNotification(notificationRequest);

        expect(received).to.deep.equal(notificationRequest);
    });

    it('should authorize the pre-notification with the secret key', async () => {
        nock('https://123456789.api.sandbox.checkout.com', {
            reqheaders: {
                Authorization: SK,
            },
        })
            .post('/apms/bacs/notifications')
            .reply(201, { event_id: 'evt_lzr4csdtddwetactr6phd3kea4' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.bacs.sendNotification(notificationRequest);

        // The endpoint is declared `ApiSecretKey` in swagger: the secret key must go
        // out verbatim as the Authorization header, not as an OAuth bearer token.
        expect(response.event_id).to.equal('evt_lzr4csdtddwetactr6phd3kea4');
    });

    it('should throw AuthenticationError on 401', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/apms/bacs/notifications')
            .reply(401);

        const cko = new Checkout(SK, { subdomain: '123456789' });

        try {
            await cko.bacs.sendNotification(notificationRequest);
            expect.fail('should have thrown AuthenticationError');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw ValidationError on 422', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/apms/bacs/notifications')
            .reply(422, {
                request_id: '0HL80RJLS76I7',
                error_type: 'request_invalid',
                error_codes: ['source_id_required'],
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });

        try {
            await cko.bacs.sendNotification({});
            expect.fail('should have thrown ValidationError');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
            expect(err.body.error_codes).to.deep.equal(['source_id_required']);
        }
    });
});
