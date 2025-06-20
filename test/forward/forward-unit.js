import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { AuthenticationError, NotFoundError, ValidationError } from '../../src/services/errors.js';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Unit::Forward', () => {
    it('should forward an API request', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/forward', {
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
            })
            .reply(200, {
                request_id: 'fwd_01HK153X00VZ1K15Z3HYC0QGPN',
                destination_response: {
                    status: 201,
                    headers: {
                        'Cko-Request-Id': [
                            '5fa7ee8c-f82d-4440-a6dc-e8c859b03235'
                        ],
                        'Content-Type': [
                            'application/json'
                        ]
                    },
                    body: '{"id": "pay_mbabizu24mvu3mela5njyhpit4", "action_id": "act_mbabizu24mvu3mela5njyhpit4", "amount": 6540, "currency": "USD", "approved": true, "status": "Authorized", "auth_code": "770687", "response_code": "10000", "response_summary": "Approved", "_links": {"self": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4"}, "action": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/actions"}, "void": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/voids"}, "capture": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/captures"}}}'
                }
            });

        const cko = new Checkout(SK);
        const result = await cko.forward.forwardRequest({
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
        });
        expect(result).to.deep.equal({
            request_id: 'fwd_01HK153X00VZ1K15Z3HYC0QGPN',
            destination_response: {
                status: 201,
                headers: {
                    'Cko-Request-Id': [
                        '5fa7ee8c-f82d-4440-a6dc-e8c859b03235'
                    ],
                    'Content-Type': [
                        'application/json'
                    ]
                },
                body: '{"id": "pay_mbabizu24mvu3mela5njyhpit4", "action_id": "act_mbabizu24mvu3mela5njyhpit4", "amount": 6540, "currency": "USD", "approved": true, "status": "Authorized", "auth_code": "770687", "response_code": "10000", "response_summary": "Approved", "_links": {"self": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4"}, "action": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/actions"}, "void": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/voids"}, "capture": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/captures"}}}'
            }
        });
    });

    it('should get a forward request', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/forward/fwd_01HK153X00VZ1K15Z3HYC0QGPN')
            .reply(200, {
                request_id: 'fwd_01HK153X00VZ1K15Z3HYC0QGPN',
                reference: 'ORD-5023-4E89',
                entity_id: 'ent_lp6h57qskk6ubewfk3pq4f2c2y',
                destination_request: {
                    url: 'https://example.com/payments',
                    method: 'POST',
                    headers: {
                        Authorization: '***redacted***',
                        'Idempotency-Key': 'xe4fad12367dfgrds',
                        'Content-Type': 'application/json'
                    },
                    body: '{"amount": 1000, "currency": "USD", "reference": "some_reference", "source": {"type": "card", "number": "{{card_number}}", "expiry_month": "{{card_expiry_month}}", "expiry_year": "{{card_expiry_year_yyyy}}", "name": "Ali Farid"}, "payment_type": "Regular", "authorization_type": "Final", "capture": true, "processing_channel_id": "pc_xxxxxxxxxxx", "risk": {"enabled": false}, "merchant_initiated": true}'
                },
                destination_response: {
                    status: 201,
                    headers: {
                        'Cko-Request-Id': [
                            '5fa7ee8c-f82d-4440-a6dc-e8c859b03235'
                        ],
                        'Content-Type': [
                            'application/json'
                        ]
                    },
                    body: '{"id": "pay_mbabizu24mvu3mela5njyhpit4", "action_id": "act_mbabizu24mvu3mela5njyhpit4", "amount": 6540, "currency": "USD", "approved": true, "status": "Authorized", "auth_code": "770687", "response_code": "10000", "response_summary": "Approved", "_links": {"self": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4"}, "action": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/actions"}, "void": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/voids"}, "capture": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/captures"}}}'
                },
                created_on: '2024-01-02T15:04:05+00:00'
            });

        const cko = new Checkout(SK);
        const result = await cko.forward.get('fwd_01HK153X00VZ1K15Z3HYC0QGPN');
        expect(result).to.deep.equal({
            request_id: 'fwd_01HK153X00VZ1K15Z3HYC0QGPN',
            reference: 'ORD-5023-4E89',
            entity_id: 'ent_lp6h57qskk6ubewfk3pq4f2c2y',
            destination_request: {
                url: 'https://example.com/payments',
                method: 'POST',
                headers: {
                    Authorization: '***redacted***',
                    'Idempotency-Key': 'xe4fad12367dfgrds',
                    'Content-Type': 'application/json'
                },
                body: '{"amount": 1000, "currency": "USD", "reference": "some_reference", "source": {"type": "card", "number": "{{card_number}}", "expiry_month": "{{card_expiry_month}}", "expiry_year": "{{card_expiry_year_yyyy}}", "name": "Ali Farid"}, "payment_type": "Regular", "authorization_type": "Final", "capture": true, "processing_channel_id": "pc_xxxxxxxxxxx", "risk": {"enabled": false}, "merchant_initiated": true}'
            },
            destination_response: {
                status: 201,
                headers: {
                    'Cko-Request-Id': [
                        '5fa7ee8c-f82d-4440-a6dc-e8c859b03235'
                    ],
                    'Content-Type': [
                        'application/json'
                    ]
                },
                body: '{"id": "pay_mbabizu24mvu3mela5njyhpit4", "action_id": "act_mbabizu24mvu3mela5njyhpit4", "amount": 6540, "currency": "USD", "approved": true, "status": "Authorized", "auth_code": "770687", "response_code": "10000", "response_summary": "Approved", "_links": {"self": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4"}, "action": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/actions"}, "void": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/voids"}, "capture": {"href": "https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/captures"}}}'
            },
            created_on: '2024-01-02T15:04:05+00:00'
        });
    });

    it('should throw an error for unauthorized (401)', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/forward')
            .reply(401, {});

        const cko = new Checkout('sk_test_invalid');
        try {
            await cko.forward.forwardRequest({
                source: { id: 'src_v5rgkf3gdtpuzjqesyxmyodnya', type: 'id' },
                reference: 'ORD-5023-4E89',
                processing_channel_id: 'pc_azsiyswl7bwe2ynjzujy7lcjca',
                network_token: { enabled: true, request_cryptogram: false },
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
                    body: '{"amount": 1000, "currency": "USD"}',
                    signature: { type: 'dlocal', dlocal_parameters: { secret_key: 'invalid' } }
                }
            });
            throw new Error('Should have thrown 401 error');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
            expect(err.http_code).to.equal(401);
        }
    });

    it('should throw an error for validation error (422)', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/forward')
            .reply(422, {
                request_id: 'fwd_01HK153X00VZ1K15Z3HYC0QGPN:00000001',
                error_type: 'request_invalid',
                error_codes: ['processing_channel_id_required'],
                errors: {
                    processing_channel_id: [
                        'The processing_channel_id field is required'
                    ]
                }
            });

        const cko = new Checkout(SK);
        try {
            await cko.forward.forwardRequest({
                source: { id: 'src_v5rgkf3gdtpuzjqesyxmyodnya', type: 'id' },
                reference: 'ORD-5023-4E89',
                processing_channel_id: 'pc_azsiyswl7bwe2ynjzujy7lcjca',
                network_token: { enabled: true, request_cryptogram: false },
                destination_request: {
                    url: 'invalid-url',
                    method: 'POST',
                    headers: {
                        encrypted: '<JWE encrypted JSON object with string values>',
                        raw: {
                            'Idempotency-Key': 'xe4fad12367dfgrds',
                            'Content-Type': 'application/json'
                        }
                    },
                    body: '{"amount": 1000, "currency": "USD"}',
                    signature: { type: 'dlocal', dlocal_parameters: { secret_key: 'invalid' } }
                }
            });
            throw new Error('Should have thrown 422 error');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
            expect(err.http_code).to.equal(422);
        }
    });

    it('should throw an error for not found (404)', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/forward/fwd_invalid_id')
            .reply(404, {
                error_type: 'not_found',
                error_codes: ['forward_request_not_found'],
                message: 'The forward request was not found.'
            });

        const cko = new Checkout(SK);
        try {
            await cko.forward.get('fwd_invalid_id');
            throw new Error('Should have thrown 404 error');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
            expect(err.http_code).to.equal(404);
        }
    });
});
