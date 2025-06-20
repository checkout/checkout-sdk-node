import { expect } from 'chai';
import Checkout from '../../src/Checkout.js';
import { NotFoundError } from '../../src/services/errors.js';

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_SECRET, {
    client: process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_ID,
    scope: ['forward'],
    environment: 'sandbox',
});

describe('Integration::Forward', () => {
    it.skip('should forward an API request', async () => {
        const body = {
            source: {
                id: 'src_v5rgkf3gdtpuzjqesyxmyodnya',
                type: 'id'
            },
            reference: 'ORD-5023-4E89',
            processing_channel_id: 'pc_azsiyswl7bwe2ynjzujy7lcjca',
            network_token: {
                enabled: true,
                request_cryptogram: false
            },
            destination_request: {
                url: 'https://example.com/payments',
                method: 'POST',
                headers: {
                    encrypted: '<JWE encrypted JSON object with string values>',
                    raw: {
                        'Idempotency-Key': 'xe4fad12367dfgrds',
                        'Content-Type': 'application/json'
                    }
                },
                body: '{"amount": 1000, "currency": "USD", "reference": "some_reference", "source": {"type": "card", "number": "{{card_number}}", "expiry_month": "{{card_expiry_month}}", "expiry_year": "{{card_expiry_year_yyyy}}", "name": "Ali Farid"}, "payment_type": "Regular", "authorization_type": "Final", "capture": true, "processing_channel_id": "pc_xxxxxxxxxxx", "risk": {"enabled": false}, "merchant_initiated": true}',
                signature: {
                    type: 'dlocal',
                    dlocal_parameters: {
                        secret_key: '9f439fe1a9f96e67b047d3c1a28c33a2e'
                    }
                }
            }
        };
        const result = await cko.forward.forwardRequest(body);
        expect(result).to.have.property('request_id');
        expect(result).to.have.property('destination_response');
    });

    it.skip('should get a forward request', async () => {
        const requestId = 'fwd_01HK153X00VZ1K15Z3HYC0QGPN';
        const result = await cko.forward.get(requestId);
        expect(result).to.have.property('request_id');
        expect(result).to.have.property('reference');
        expect(result).to.have.property('entity_id');
        expect(result).to.have.property('destination_request');
        expect(result).to.have.property('destination_response');
        expect(result).to.have.property('created_on');
    });

    it('should throw an error for not found (404)', async () => {
        const invalidRequestId = 'fwd_invalid_id';
        try {
            await cko.forward.get(invalidRequestId);
            throw new Error('Should have thrown 404 error');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
            expect(err.http_code).to.equal(404);
        }
    });
});
