import {
    BadGateway,
    TooManyRequestsError,
    ValidationError,
    ValueError,
    AuthenticationError,
    NotFoundError,
    ActionNotAllowed
} from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Sessions', () => {
    it('should create session', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/sessions')
            .reply(202, {
                id: 'sid_llraltf4jlwu5dxdtprcv7ba5i',
                transaction_id: 'cc05e25a-4abc-4eed-8ee3-9be22afc20ea',
                amount: 6540,
                currency: 'USD',
                completed: false,
                authentication_type: 'regular',
                authentication_category: 'payment',
                status: 'pending',
                approved: false,
                protocol_version: '2.1.0',
                reference: 'ORD-5023-4E89',
                next_actions: ['collect_channel_data', 'issuer_fingerprint'],
                transaction_type: 'goods_service',
                _links: {
                    self: {
                        href: 'https://3ds2.ckotech.co/sessions/sid_llraltf4jlwu5dxdtprcv7ba5i'
                    },
                    issuer_fingerprint: {
                        href: 'http://3ds2.cko.lon/3ds2simulator/acs/3ds-method'
                    }
                }
            });

        const cko = new Checkout(SK);

        const session = await cko.sessions.request({
            source: {
                type: 'card',
                number: '4485040371536584',
                expiry_month: 1,
                expiry_year: 2030
            },
            amount: 100,
            currency: 'USD',
            authentication_type: 'regular',
            authentication_category: 'payment',
            challenge_indicator: 'no_preference',
            reference: 'ORD-5023-4E89',
            transaction_type: 'goods_service',
            shipping_address: {
                address_line1: 'Checkout.com',
                address_line2: '90 Tottenham Court Road',
                city: 'London',
                state: 'London',
                zip: 'W1T 4TJ',
                country: 'GB'
            },
            completion: {
                type: 'non-hosted',
                callback_url: 'https://example.com/sessions/callback'
            }
        });
        expect(session.id)
            .to.be.a('string')
            .and.satisfy(msg => msg.startsWith('sid_'));
    });

    it('should throw authentication error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/sessions')
            .reply(401);

        const cko = new Checkout();

        try {
            const session = await cko.sessions.request({
                source: {
                    type: 'card',
                    number: '4485040371536584',
                    expiry_month: 1,
                    expiry_year: 2030
                },
                amount: 100,
                currency: 'USD',
                authentication_type: 'regular',
                authentication_category: 'payment',
                challenge_indicator: 'no_preference',
                reference: 'ORD-5023-4E89',
                transaction_type: 'goods_service',
                shipping_address: {
                    address_line1: 'Checkout.com',
                    address_line2: '90 Tottenham Court Road',
                    city: 'London',
                    state: 'London',
                    zip: 'W1T 4TJ',
                    country: 'GB'
                },
                completion: {
                    type: 'non-hosted',
                    callback_url: 'https://example.com/sessions/callback'
                }
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get session', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/sessions/sid_llraltf4jlwu5dxdtprcv7ba5i')
            .reply(200, {
                id: 'sid_llraltf4jlwu5dxdtprcv7ba5i',
                status: 'pending',
                next_actions: ['collect_channel_data', 'issuer_fingerprint']
            });

        const cko = new Checkout(SK);

        const session = await cko.sessions.get('sid_llraltf4jlwu5dxdtprcv7ba5i');
        expect(session.id)
            .to.be.a('string')
            .and.satisfy(msg => msg.startsWith('sid_'));
    });

    it('should submit channel data', async () => {
        nock('https://api.sandbox.checkout.com')
            .put('/sessions/sid_llraltf4jlwu5dxdtprcv7ba5i/channel-data')
            .reply(200, {
                id: 'sid_llraltf4jlwu5dxdtprcv7ba5i',
                status: 'pending',
                next_actions: ['collect_channel_data', 'issuer_fingerprint']
            });

        const cko = new Checkout(SK);

        const session = await cko.sessions.submitChannelData('sid_llraltf4jlwu5dxdtprcv7ba5i', {
            channel: '',
            sdk_app_id: '',
            sdk_max_timeout: '',
            sdk_ephem_pub_key: '',
            sdk_encrypted_data: '',
            sdk_transaction_id: '',
            sdk_interface_type: '',
            sdk_ui_elements: ''
        });

        expect(session.id)
            .to.be.a('string')
            .and.satisfy(msg => msg.startsWith('sid_'));
    });

    it('should complete session', async () => {
        nock('https://api.sandbox.checkout.com')
            .put('/sessions/sid_llraltf4jlwu5dxdtprcv7ba5i/complete')
            .reply(204);

        const cko = new Checkout(SK);

        const session = await cko.sessions.complete('sid_llraltf4jlwu5dxdtprcv7ba5i');

        expect(Object.keys(session).length).to.equal(0);
    });
});
