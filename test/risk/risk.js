import { AuthenticationError, } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Risk', () => {
    it('should request a pre-authentication risk scan', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/risk/assessments/pre-authentication')
            .reply(201, {
                assessment_id: 'ras_2r7jmh6r7urevgmouqtkjiw7ve',
                result: {
                    decision: 'try_exemptions',
                },
                _links: {
                    pre_capture: {
                        link: 'http://api.sandbox.checkout.com/risk/assessments/pre-capture',
                    },
                    self: {
                        link: 'http://api.sandbox.checkout.com/risk/assessments/ras_2r7jmh6r7urevgmouqtkjiw7ve',
                    },
                },
            });

        const cko = new Checkout(SK);

        const risk = await cko.risk.requestPreAuthentication({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
        });

        expect(risk.result.decision).to.equal('try_exemptions');
    });

    it('should request a pre-capture risk scan', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/risk/assessments/pre-capture')
            .reply(201, {
                assessment_id: 'ras_2r7jmh6r7urevgmouqtkjiw7ve',
                result: {
                    decision: 'capture',
                },
                _links: {
                    pre_capture: {
                        link: 'http://api.sandbox.checkout.com/risk/assessments/pre-capture',
                    },
                    self: {
                        link: 'http://api.sandbox.checkout.com/risk/assessments/ras_2r7jmh6r7urevgmouqtkjiw7ve',
                    },
                },
            });

        const cko = new Checkout(SK);

        const risk = await cko.risk.requestPreCapture({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
        });

        expect(risk.result.decision).to.equal('capture');
    });

    it('should throw AuthenticationError in pre-capture', async () => {
        nock('https://api.sandbox.checkout.com').post('/risk/assessments/pre-capture').reply(401);
        const cko = new Checkout();

        try {
            const risk = await cko.risk.requestPreCapture({
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw AuthenticationError in pre-auth', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/risk/assessments/pre-authentication')
            .reply(401);
        const cko = new Checkout();

        try {
            const risk = await cko.risk.requestPreAuthentication({
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
