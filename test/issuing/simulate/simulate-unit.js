import nock from "nock";
import { expect } from "chai";
import Checkout from "../../../src/Checkout.js";
import { AuthenticationError, NotFoundError, ValidationError } from "../../../src/services/errors.js";

describe('Unit::Issuing::Simulate', () => {
    it('should simulate an authorization', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:simulate'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/simulate/authorizations')
            .reply(200, {
                id: "trx_aaqc4uaaybigcaaqc4uaayfiga",
                status: "Authorized"
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:simulate'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });

        const authorizationResponse = await cko.issuing.simulateAuthorization({
            card: {
                id: "crd_fa6psq242dcd6fdn5gifcq1491",
                expiry_month: 5,
                expiry_year: 2025
            },
            transaction: {
                type: "purchase",
                amount: 6540,
                currency: "GBP"
            }
        });

        expect(authorizationResponse).to.not.be.null
        expect(authorizationResponse.id).to.equal("trx_aaqc4uaaybigcaaqc4uaayfiga")
        expect(authorizationResponse.status).to.equal("Authorized")
    });

    it('should throw when simulating an authorization with invalid card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:simulate'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/simulate/authorizations')
            .reply(422);

        try {
            const cko = new Checkout('test_client_secret', {
                client: 'ack_testclie123456',
                scope: ['issuing:simulate'],
                environment: 'sandbox',
                subdomain: '123456789'
            });

            await cko.issuing.simulateAuthorization({
                card: {
                    id: "not_found",
                    expiry_month: 5,
                    expiry_year: 2025
                },
                transaction: {
                    type: "purchase",
                    amount: 6540,
                    currency: "GBP"
                }
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should simulate an increment authorization', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:simulate'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/simulate/authorizations/transaction_id/authorizations')
            .reply(200, {
                status: "Authorized"
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:simulate'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });

        const authorizationResponse = await cko.issuing.simulateIncrement('transaction_id', {
            amount: 1000,
        });

        expect(authorizationResponse).to.not.be.null
        expect(authorizationResponse.status).to.equal("Authorized")
    });

    it('should throw when simulating an authorization with invalid transaction', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:simulate'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/simulate/authorizations/not_found/authorizations')
            .reply(422);

        try {
            const cko = new Checkout('test_client_secret', {
                client: 'ack_testclie123456',
                scope: ['issuing:simulate'],
                environment: 'sandbox',
                subdomain: '123456789'
            });

            await cko.issuing.simulateIncrement('not_found', {
                amount: 1000,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should simulate a clearing for a transaction', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:simulate'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/simulate/authorizations/transaction_id/presentments')
            .reply(202);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:simulate'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });

        const authorizationResponse = await cko.issuing.simulateClearing('transaction_id', {
            amount: 1000,
        });

        expect(authorizationResponse).to.not.be.null
    });

    it('should throw when simulating a clearing with invalid transaction', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:simulate'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/simulate/authorizations/not_found/presentments')
            .reply(422);

        try {
            const cko = new Checkout('test_client_secret', {
                client: 'ack_testclie123456',
                scope: ['issuing:simulate'],
                environment: 'sandbox',
                subdomain: '123456789'
            });

            await cko.issuing.simulateClearing('not_found', {
                amount: 1000,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should simulate a refund for a transaction', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:simulate'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/simulate/authorizations/transaction_id/refunds')
            .reply(200, {
                id: "trx_refund123",
                status: "Refunded"
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:simulate'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });

        const refundResponse = await cko.issuing.simulateRefund('transaction_id', {
            amount: 1000,
        });

        expect(refundResponse).to.not.be.null;
        expect(refundResponse.status).to.equal("Refunded");
    });

    it('should throw when simulating a refund with invalid transaction', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:simulate'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/simulate/authorizations/not_found/refunds')
            .reply(422);

        try {
            const cko = new Checkout('test_client_secret', {
                client: 'ack_testclie123456',
                scope: ['issuing:simulate'],
                environment: 'sandbox',
                subdomain: '123456789'
            });

            await cko.issuing.simulateRefund('not_found', {
                amount: 1000,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should simulate a reversal for a transaction', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:simulate'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/simulate/authorizations/transaction_id/reversals')
            .reply(201);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:simulate'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });

        const authorizationResponse = await cko.issuing.simulateReversal('transaction_id', {
            amount: 1000,
        });

        expect(authorizationResponse).to.not.be.null
    });

    it('should throw when simulating a reversal with invalid transaction', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:simulate'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/simulate/authorizations/not_found/reversals')
            .reply(422);

        try {
            const cko = new Checkout('test_client_secret', {
                client: 'ack_testclie123456',
                scope: ['issuing:simulate'],
                environment: 'sandbox',
                subdomain: '123456789'
            });

            await cko.issuing.simulateReversal('not_found', {
                amount: 1000,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });
});
