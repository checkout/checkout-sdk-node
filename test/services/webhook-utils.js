import { expect } from 'chai';
import { parseWebhookPayload, extractAuthenticationFailedData, webhookParsingMiddleware, isAuthenticationFailedWebhook } from '../../src/services/webhook-utils.js';

describe('Webhook Utils - Issue #408 Fix', () => {
    const validWebhook = {
        id: 'evt_test',
        type: 'authentication_failed',
        data: {
            payment_id: 'pay_test',
            session_id: 'sid_test',
            reason: 'Declined',
            challenged: true,
            acs_challenged_mandated: 'false',
            amount: '1000',
            currency: 'EUR',
            response_code: 'N'
        }
    };

    describe('parseWebhookPayload', () => {
        it('should parse valid JSON', () => {
            const result = parseWebhookPayload(JSON.stringify(validWebhook));
            expect(result.id).to.equal('evt_test');
        });

        it('should parse malformed JSON (issue #408)', () => {
            const malformed = `{
  "id": "evt_test",
  "type": "authentication_failed",
  "version": "2.1.0",
  "created_on": "2025-09-15T07:31:18.241Z",
�
{
    "reason": "Declined",
    "payment_id": "pay_test",
    "session_id": "sid_test",
    "amount": "1000",
    "currency": "EUR",
    "response_code": "N",
    "challenged": true,
    "acs_challenged_mandated": false
  }
}`;
            const result = parseWebhookPayload(malformed);
            expect(result.id).to.equal('evt_test');
            expect(result.data.payment_id).to.equal('pay_test');
        });

        it('should throw for invalid input', () => {
            expect(() => parseWebhookPayload(123)).to.throw('Webhook payload must be a string');
        });
    });

    describe('extractAuthenticationFailedData', () => {
        it('should extract data correctly', () => {
            const result = extractAuthenticationFailedData(validWebhook);
            expect(result.paymentId).to.equal('pay_test');
            expect(result.challenged).to.be.true;
            expect(result.acsChallengeMandated).to.be.false;
        });

        it('should handle boolean conversion', () => {
            const webhook = { ...validWebhook };
            // @ts-ignore - Testing string to boolean conversion
            webhook.data.challenged = 'true';
            // @ts-ignore - Testing string to boolean conversion
            webhook.data.acs_challenged_mandated = 'false';
            
            const result = extractAuthenticationFailedData(webhook);
            expect(result.challenged).to.be.true;
            expect(result.acsChallengeMandated).to.be.false;
        });
    });

    describe('webhookParsingMiddleware', () => {
        it('should parse string body', () => {
            const req = { body: JSON.stringify(validWebhook) };
            const res = {};
            const next = () => {};

            webhookParsingMiddleware(req, res, next);
            // @ts-ignore - req.body is parsed from string to object
            expect(req.body.id).to.equal('evt_test');
        });

        it('should skip object body', () => {
            const req = { body: validWebhook };
            const res = {};
            const next = () => {};

            webhookParsingMiddleware(req, res, next);
            expect(req.body.id).to.equal('evt_test');
        });
    });

    describe('Integration test - Full flow', () => {
        it('should handle real issue #408 payload', () => {
            const issuePayload = `{
  "id": "evt_ql5mtq624twrdnpkajbkyeqaai",
  "type": "authentication_failed",
  "version": "2.1.0",
  "created_on": "2025-09-15T07:31:18.241Z",
�
{
    "reason": "Declined",
    "reason_description": "Authentication Declined",
    "payment_id": "pay_xxx",
    "session_id": "sid_xxx",
    "amount": "13606",
    "currency": "EUR",
    "response_code": "N",
    "challenged": true,
    "acs_challenged_mandated": true
  }
}`;

            // Standard JSON.parse should fail
            expect(() => JSON.parse(issuePayload)).to.throw();

            // Our utils should succeed
            const webhook = parseWebhookPayload(issuePayload);
            const data = extractAuthenticationFailedData(webhook);

            expect(data.paymentId).to.equal('pay_xxx');
            expect(data.amount).to.equal('13606');
            expect(data.currency).to.equal('EUR');
            expect(data.challenged).to.be.true;
        });
    });

    describe('Security Tests', () => {
        it('should NOT process malformed non-authentication_failed webhooks', () => {
            const malformedPaymentWebhook = `{
                "id": "evt_test",
                "type": "payment_approved",
                "created_on": "2025-09-15T07:31:18.241Z",
                �
                {
                    "payment_id": "pay_test",
                    "amount": "1000"
                }
            }`;

            // Should fail and NOT attempt to clean
            expect(() => parseWebhookPayload(malformedPaymentWebhook))
                .to.throw('Unable to parse webhook payload');
        });

        it('should validate webhook type before extraction', () => {
            const wrongTypeWebhook = {
                id: 'evt_test',
                type: 'payment_approved', // Wrong type
                data: {
                    payment_id: 'pay_test',
                    reason: 'Declined'
                }
            };

            expect(() => extractAuthenticationFailedData(wrongTypeWebhook))
                .to.throw('Webhook is not of type authentication_failed');
        });

        it('should require payment_id field', () => {
            const missingPaymentIdWebhook = {
                id: 'evt_test',
                type: 'authentication_failed',
                data: {
                    session_id: 'sid_test',
                    reason: 'Declined'
                    // missing payment_id
                }
            };

            expect(() => extractAuthenticationFailedData(missingPaymentIdWebhook))
                .to.throw('Missing required field: payment_id');
        });

        it('should only clean authentication_failed webhooks', () => {
            const authFailedPayload = '{"type":"authentication_failed","data":{}}';
            const paymentPayload = '{"type":"payment_approved","data":{}}';
            
            expect(isAuthenticationFailedWebhook(authFailedPayload)).to.be.true;
            expect(isAuthenticationFailedWebhook(paymentPayload)).to.be.false;
        });
    });
});
