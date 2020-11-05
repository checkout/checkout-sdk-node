import { ValidationError, AuthenticationError } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Disputes', () => {
    it('should retrieve all disputes', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/disputes?limit=5&id=dsp_bc94ebda8d275i461229')
            .reply(200, {
                limit: 5,
                skip: 0,
                id: 'dsp_bc94ebda8d275i461229',
                total_count: 1,
                data: [
                    {
                        id: 'dsp_bc94ebda8d275i461229',
                        category: 'fraudulent',
                        status: 'expired',
                        amount: 1040,
                        currency: 'GBP',
                        payment_id: 'pay_vsynch7rpc2uvaiqsuzeoxpszu',
                        payment_method: 'Visa',
                        payment_arn: '465760598106',
                        received_on: '2020-04-14T14:33:44Z',
                        last_update: '2020-04-24T18:01:20Z',
                        _links: [Object],
                    },
                ],
            });
        const cko = new Checkout(SK);

        const disputes = await cko.disputes.get({
            limit: 5,
            id: 'dsp_bc94ebda8d275i461229',
        });

        expect(disputes.limit).to.equal(5);
    });

    it('should throw AuthenticationError', async () => {
        nock('https://api.sandbox.checkout.com').get('/disputes').reply(401);
        const cko = new Checkout(SK);

        try {
            const disputes = await cko.disputes.get();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw ValidationError', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/disputes?limit=-1')
            .reply(422, {
                request_id: '0HLUQS5FNKDTF:00000001',
                error_type: 'request_invalid',
                error_codes: ['paging_limit_invalid'],
            });
        const cko = new Checkout(SK);

        try {
            const disputes = await cko.disputes.get({
                limit: -1,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should get dispute details', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/disputes/dsp_bc94ebda8d275i461229')
            .reply(200, {
                id: 'dsp_bc94ebda8d275i461229',
                category: 'fraudulent',
                amount: 1040,
                currency: 'GBP',
                reason_code: '10.4',
                status: 'expired',
                received_on: '2020-04-14T14:33:44Z',
                payment: {
                    id: 'pay_vsynch7rpc2uvaiqsuzeoxpszu',
                    amount: 1040,
                    currency: 'GBP',
                    method: 'Visa',
                    arn: '465760598106',
                    processed_on: '2020-04-14T14:32:57Z',
                },
                last_update: '2020-04-24T18:01:20Z',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/disputes/dsp_bc94ebda8d275i461229',
                    },
                    evidence: {
                        href:
                            'https://api.sandbox.checkout.com/disputes/dsp_bc94ebda8d275i461229/evidence',
                    },
                },
            });
        const cko = new Checkout(SK);

        const disputeDetails = await cko.disputes.getDetails('dsp_bc94ebda8d275i461229');
        expect(disputeDetails.id).to.equal('dsp_bc94ebda8d275i461229');
    });

    it('should throw AuthenticationError error when getting dispute details', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/disputes/dsp_bc94ebda8d275i461229')
            .reply(401);
        const cko = new Checkout(SK);

        try {
            const disputeDetails = await cko.disputes.getDetails('dsp_bc94ebda8d275i461229');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should accept dispute', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                action_id: 'act_l5rvkbinxztepjskr7vwlovzsq',
                amount: 1040,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '015107',
                eci: '05',
                scheme_id: '457027721465486',
                response_code: '10000',
                response_summary: 'Approved',
                risk: { flagged: false },
                source: {
                    id: 'src_sum4kuu2fb3edbn6lws7s6ilsm',
                    type: 'card',
                    expiry_month: 8,
                    expiry_year: 2025,
                    name: 'Sarah Mitchell',
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '5CD3B9CB15338683110959D165562D23084E1FF564F420FE9A990DF0BCD093FC',
                    bin: '424242',
                    card_type: 'Credit',
                    card_category: 'Consumer',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                    avs_check: 'S',
                    cvv_check: 'Y',
                    payouts: true,
                    fast_funds: 'd',
                },
                customer: { id: 'cus_wwgz2l2ywsiujj25l4tx2xscqy', name: 'Sarah Mitchell' },
                processed_on: '2020-04-26T20:47:30Z',
                reference: 'CB',
                processing: {
                    acquirer_transaction_id: '9576266789',
                    retrieval_reference_number: '989885937118',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq',
                    },
                    actions: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/actions',
                    },
                    capture: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/captures',
                    },
                    void: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/voids',
                    },
                },
                requiresRedirect: false,
                redirectLink: undefined,
            });

        nock('https://api.sandbox.checkout.com')
            .get('/disputes?payment_id=pay_l5rvkbinxztepjskr7vwlovzsq')
            .reply(200, {
                limit: 50,
                skip: 0,
                payment_id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                total_count: 1,
                data: [
                    {
                        id: 'dsp_3dc29c89ce075g46136d',
                        category: 'fraudulent',
                        status: 'evidence_required',
                        amount: 1040,
                        currency: 'USD',
                        payment_id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                        payment_reference: 'CB',
                        payment_method: 'Visa',
                        payment_arn: '127502332018',
                        received_on: '2020-04-26T20:47:44Z',
                        last_update: '2020-04-26T20:47:44Z',
                        evidence_required_by: '2020-05-06T18:00:00Z',
                        _links: [Object],
                    },
                ],
            });

        nock('https://api.sandbox.checkout.com')
            .post('/disputes/dsp_3dc29c89ce075g46136d/accept')
            .reply(200);

        const cko = new Checkout(SK);

        const disputedPayment = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 8,
                expiry_year: 2025,
                name: 'Sarah Mitchell',
                cvv: '100',
            },
            amount: 1040,
            currency: 'USD',
            reference: 'CB',
        });

        return new Promise(async (resolve, reject) => {
            const timeValue = setInterval(async () => {
                const dispute = await cko.disputes.get({
                    payment_id: disputedPayment.id,
                });
                if (dispute.total_count === 1) {
                    const accept = await cko.disputes.accept(dispute.data[0].id);
                    expect(Object.keys(accept).length).to.equal(0);
                    clearInterval(timeValue);
                    resolve();
                }
            }, 3000);
        });
    }).timeout(120000);

    it('should throw ValidationError when trying to accept dispute', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/disputes/dsp_3dc29c89ce075g46136d/accept')
            .reply(422, {
                request_id: '0HM412MFDPPV8:00000004',
                error_type: 'request_invalid',
                error_codes: ['dispute_already_expired'],
            });
        const cko = new Checkout(SK);

        try {
            const accept = await cko.disputes.accept('dsp_3dc29c89ce075g46136d');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should provide dispute evidence', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                action_id: 'act_l5rvkbinxztepjskr7vwlovzsq',
                amount: 1040,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '015107',
                eci: '05',
                scheme_id: '457027721465486',
                response_code: '10000',
                response_summary: 'Approved',
                risk: { flagged: false },
                source: {
                    id: 'src_sum4kuu2fb3edbn6lws7s6ilsm',
                    type: 'card',
                    expiry_month: 8,
                    expiry_year: 2025,
                    name: 'Sarah Mitchell',
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '5CD3B9CB15338683110959D165562D23084E1FF564F420FE9A990DF0BCD093FC',
                    bin: '424242',
                    card_type: 'Credit',
                    card_category: 'Consumer',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                    avs_check: 'S',
                    cvv_check: 'Y',
                    payouts: true,
                    fast_funds: 'd',
                },
                customer: { id: 'cus_wwgz2l2ywsiujj25l4tx2xscqy', name: 'Sarah Mitchell' },
                processed_on: '2020-04-26T20:47:30Z',
                reference: 'CB',
                processing: {
                    acquirer_transaction_id: '9576266789',
                    retrieval_reference_number: '989885937118',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq',
                    },
                    actions: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/actions',
                    },
                    capture: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/captures',
                    },
                    void: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/voids',
                    },
                },
                requiresRedirect: false,
                redirectLink: undefined,
            });

        nock('https://api.sandbox.checkout.com')
            .get('/disputes?payment_id=pay_l5rvkbinxztepjskr7vwlovzsq')
            .reply(200, {
                limit: 50,
                skip: 0,
                payment_id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                total_count: 1,
                data: [
                    {
                        id: 'dsp_3dc29c89ce075g46136d',
                        category: 'fraudulent',
                        status: 'evidence_required',
                        amount: 1040,
                        currency: 'USD',
                        payment_id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                        payment_reference: 'CB',
                        payment_method: 'Visa',
                        payment_arn: '127502332018',
                        received_on: '2020-04-26T20:47:44Z',
                        last_update: '2020-04-26T20:47:44Z',
                        evidence_required_by: '2020-05-06T18:00:00Z',
                        _links: [Object],
                    },
                ],
            });

        nock('https://api.sandbox.checkout.com')
            .put('/disputes/dsp_3dc29c89ce075g46136d/evidence')
            .reply(204);

        const cko = new Checkout(SK);

        const disputedPayment = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 8,
                expiry_year: 2025,
                name: 'Sarah Mitchell',
                cvv: '100',
            },
            amount: 1040,
            currency: 'USD',
            reference: 'CB',
        });

        return new Promise(async (resolve, reject) => {
            const timeValue = setInterval(async () => {
                const dispute = await cko.disputes.get({
                    payment_id: disputedPayment.id,
                });
                if (dispute.total_count === 1) {
                    const evidence = await cko.disputes.provideEvidence(dispute.data[0].id, {
                        proof_of_delivery_or_service_text: 'http://checkout.com/document.pdf',
                    });
                    expect(Object.keys(evidence).length).to.equal(0);
                    clearInterval(timeValue);
                    resolve();
                }
            }, 3000);
        });
    }).timeout(120000);

    it('should throw ValidationError when trying to provide dispute evidence', async () => {
        nock('https://api.sandbox.checkout.com')
            .put('/disputes/dsp_3dc29c89ce075g46136d/evidence')
            .reply(422, {
                request_id: '0HM412MFDPQ1U:00000001',
                error_type: 'request_invalid',
                error_codes: ['dispute_already_accepted'],
            });
        const cko = new Checkout(SK);

        try {
            const evidence = await cko.disputes.provideEvidence('dsp_3dc29c89ce075g46136d', {
                proof_of_delivery_or_service_text: 'http://checkout.com/document.pdf',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should get dispute evidence', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                action_id: 'act_l5rvkbinxztepjskr7vwlovzsq',
                amount: 1040,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '015107',
                eci: '05',
                scheme_id: '457027721465486',
                response_code: '10000',
                response_summary: 'Approved',
                risk: { flagged: false },
                source: {
                    id: 'src_sum4kuu2fb3edbn6lws7s6ilsm',
                    type: 'card',
                    expiry_month: 8,
                    expiry_year: 2025,
                    name: 'Sarah Mitchell',
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '5CD3B9CB15338683110959D165562D23084E1FF564F420FE9A990DF0BCD093FC',
                    bin: '424242',
                    card_type: 'Credit',
                    card_category: 'Consumer',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                    avs_check: 'S',
                    cvv_check: 'Y',
                    payouts: true,
                    fast_funds: 'd',
                },
                customer: { id: 'cus_wwgz2l2ywsiujj25l4tx2xscqy', name: 'Sarah Mitchell' },
                processed_on: '2020-04-26T20:47:30Z',
                reference: 'CB',
                processing: {
                    acquirer_transaction_id: '9576266789',
                    retrieval_reference_number: '989885937118',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq',
                    },
                    actions: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/actions',
                    },
                    capture: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/captures',
                    },
                    void: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/voids',
                    },
                },
                requiresRedirect: false,
                redirectLink: undefined,
            });

        nock('https://api.sandbox.checkout.com')
            .get('/disputes?payment_id=pay_l5rvkbinxztepjskr7vwlovzsq')
            .reply(200, {
                limit: 50,
                skip: 0,
                payment_id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                total_count: 1,
                data: [
                    {
                        id: 'dsp_3dc29c89ce075g46136d',
                        category: 'fraudulent',
                        status: 'evidence_required',
                        amount: 1040,
                        currency: 'USD',
                        payment_id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                        payment_reference: 'CB',
                        payment_method: 'Visa',
                        payment_arn: '127502332018',
                        received_on: '2020-04-26T20:47:44Z',
                        last_update: '2020-04-26T20:47:44Z',
                        evidence_required_by: '2020-05-06T18:00:00Z',
                        _links: [Object],
                    },
                ],
            });

        nock('https://api.sandbox.checkout.com')
            .put('/disputes/dsp_3dc29c89ce075g46136d/evidence')
            .reply(204);

        nock('https://api.sandbox.checkout.com')
            .get('/disputes/dsp_3dc29c89ce075g46136d/evidence')
            .reply(200, {
                proof_of_delivery_or_service_text: 'http://checkout.com/document.pdf',
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/disputes/dsp_8a81da79fe075k4613b9/evidence',
                    },
                    parent: {
                        href: 'https://api.sandbox.checkout.com/disputes/dsp_8a81da79fe075k4613b9',
                    },
                },
            });

        const cko = new Checkout(SK);

        const disputedPayment = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 8,
                expiry_year: 2025,
                name: 'Sarah Mitchell',
                cvv: '100',
            },
            amount: 1040,
            currency: 'USD',
            reference: 'CB',
        });

        return new Promise(async (resolve, reject) => {
            const timeValue = setInterval(async () => {
                const dispute = await cko.disputes.get({
                    payment_id: disputedPayment.id,
                });
                if (dispute.total_count === 1) {
                    const evidence = await cko.disputes.provideEvidence(dispute.data[0].id, {
                        proof_of_delivery_or_service_text: 'http://checkout.com/document.pdf',
                    });
                    const getEvidence = await cko.disputes.getEvidence(dispute.data[0].id);
                    expect(getEvidence.proof_of_delivery_or_service_text).to.equal(
                        'http://checkout.com/document.pdf'
                    );
                    clearInterval(timeValue);
                    resolve();
                }
            }, 3000);
        });
    }).timeout(120000);

    it('should throw ValidationError when trying to get dispute evidence', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/disputes/dsp_3dc29c89ce075g46136d/evidence')
            .reply(422, {
                request_id: '0HM412MFDPQ1U:00000001',
                error_type: 'request_invalid',
                error_codes: ['dispute_already_accepted'],
            });
        const cko = new Checkout(SK);

        try {
            const getEvidence = await cko.disputes.getEvidence('dsp_3dc29c89ce075g46136d');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should submit dispute evidence', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                action_id: 'act_l5rvkbinxztepjskr7vwlovzsq',
                amount: 1040,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '015107',
                eci: '05',
                scheme_id: '457027721465486',
                response_code: '10000',
                response_summary: 'Approved',
                risk: { flagged: false },
                source: {
                    id: 'src_sum4kuu2fb3edbn6lws7s6ilsm',
                    type: 'card',
                    expiry_month: 8,
                    expiry_year: 2025,
                    name: 'Sarah Mitchell',
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '5CD3B9CB15338683110959D165562D23084E1FF564F420FE9A990DF0BCD093FC',
                    bin: '424242',
                    card_type: 'Credit',
                    card_category: 'Consumer',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                    avs_check: 'S',
                    cvv_check: 'Y',
                    payouts: true,
                    fast_funds: 'd',
                },
                customer: { id: 'cus_wwgz2l2ywsiujj25l4tx2xscqy', name: 'Sarah Mitchell' },
                processed_on: '2020-04-26T20:47:30Z',
                reference: 'CB',
                processing: {
                    acquirer_transaction_id: '9576266789',
                    retrieval_reference_number: '989885937118',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq',
                    },
                    actions: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/actions',
                    },
                    capture: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/captures',
                    },
                    void: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/voids',
                    },
                },
                requiresRedirect: false,
                redirectLink: undefined,
            });

        nock('https://api.sandbox.checkout.com')
            .get('/disputes?payment_id=pay_l5rvkbinxztepjskr7vwlovzsq')
            .reply(200, {
                limit: 50,
                skip: 0,
                payment_id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                total_count: 1,
                data: [
                    {
                        id: 'dsp_3dc29c89ce075g46136d',
                        category: 'fraudulent',
                        status: 'evidence_required',
                        amount: 1040,
                        currency: 'USD',
                        payment_id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                        payment_reference: 'CB',
                        payment_method: 'Visa',
                        payment_arn: '127502332018',
                        received_on: '2020-04-26T20:47:44Z',
                        last_update: '2020-04-26T20:47:44Z',
                        evidence_required_by: '2020-05-06T18:00:00Z',
                        _links: [Object],
                    },
                ],
            });

        nock('https://api.sandbox.checkout.com')
            .put('/disputes/dsp_3dc29c89ce075g46136d/evidence')
            .reply(204);

        nock('https://api.sandbox.checkout.com')
            .post('/disputes/dsp_3dc29c89ce075g46136d/evidence')
            .reply(204);

        const cko = new Checkout(SK);

        const disputedPayment = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 8,
                expiry_year: 2025,
                name: 'Sarah Mitchell',
                cvv: '100',
            },
            amount: 1040,
            currency: 'USD',
            reference: 'CB',
        });

        return new Promise(async (resolve, reject) => {
            const timeValue = setInterval(async () => {
                const dispute = await cko.disputes.get({
                    payment_id: disputedPayment.id,
                });
                if (dispute.total_count === 1) {
                    const evidence = await cko.disputes.provideEvidence(dispute.data[0].id, {
                        proof_of_delivery_or_service_text: 'http://checkout.com/document.pdf',
                    });
                    const submitEvidence = await cko.disputes.submit(dispute.data[0].id);
                    expect(Object.keys(submitEvidence).length).to.equal(0);
                    clearInterval(timeValue);
                    resolve();
                }
            }, 3000);
        });
    }).timeout(120000);

    it('should throw ValidationError when trying to submit dispute evidence', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/disputes/dsp_3dc29c89ce075g46136d/evidence')
            .reply(422, {
                request_id: '0HM412MFDPQ1U:00000001',
                error_type: 'request_invalid',
                error_codes: ['dispute_already_accepted'],
            });
        const cko = new Checkout(SK);

        try {
            const submitEvidence = await cko.disputes.submit('dsp_3dc29c89ce075g46136d');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });
});
