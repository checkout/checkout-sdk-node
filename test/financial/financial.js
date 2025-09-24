import { AuthenticationError } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Financial', () => {
    it('should get financial actions', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/financial-actions?payment_id=pay_l5rvkbinxztepjskr7vwlovzsq&limit=5')
            .reply(200, {
                count: 1,
                limit: 5,
                data: [
                    {
                        payment_id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
                        action_id: 'act_wsnyzbzmr2huxcekoj7qqhxwuy',
                        action_type: 'Capture',
                        entity_id: 'ent_xozz5q2yvxsetbslrvjxugbsyy',
                        sub_entity_id: 'ent_6akzb5simnkejihbnw6udjpecq',
                        currency_account_id: 'ca_oo5z564in66ujcsxlbhjsar3p4',
                        payment_method: 'MASTERCARD',
                        processing_channel_id: 'pc_y7hikmc5flhuvav47blunjsdui',
                        reference: 'SAMPLE6V6OR',
                        mid: 'mid-12345',
                        response_code: 10000,
                        response_description: 'Approved',
                        region: 'International',
                        card_type: 'Debit',
                        card_category: 'Consumer',
                        issuer_country: 'US',
                        merchant_category_code: 5311,
                        fx_trade_id: 'trd_intsaxljgi6uzkxnv6lex3xayu',
                        processed_on: '2022-02-18T13:00:12.357Z',
                        requested_on: '2022-02-18T13:00:11.724Z',
                        breakdown: [
                            {
                                breakdown_type: 'Scheme Fixed Fee',
                                fx_rate_applied: 1.24,
                                holding_currency: 'USD',
                                holding_currency_amount: 0.19526938,
                                processing_currency: 'GBP',
                                processing_currency_amount: 0.1581682,
                                transaction_currency: 'EUR',
                                transaction_currency_account: 0.18031175,
                                processing_to_transaction_currency_fx_rate: 1.14,
                                transaction_to_holding_currency_fx_rate: 1.08,
                                fee_detail: 'Visa Fixed Acquirer Network Fee',
                                reserve_rate: '5%',
                                reserve_release_date: '2023-06-21T09:15:34.782Z',
                                reserve_deducted_date: '2022-02-18T13:00:12.357Z',
                                tax_fx_rate: 1.45,
                                entity_country_tax_currency: 'AUD',
                                tax_currency_amount: 'AUD'
                            }
                        ]
                    },
                ],
                _links: {
                    self: {
                        href: 'https://api.checkout.com/financial-actions?payment_id=pay_l5rvkbinxztepjskr7vwlovzsq&limit=5',
                    },
                    next: {
                        href: 'https://api.checkout.com/financial-actions?payment_id=pay_l5rvkbinxztepjskr7vwlovzsq&limit=5',
                    },
                },
            });

        const cko = new Checkout(SK);

        const actions = await cko.financial.query({
            limit: 5,
            payment_id: 'pay_l5rvkbinxztepjskr7vwlovzsq',
        });

        expect(actions.limit).to.equal(5);
        expect(actions.data).to.not.be.empty;
    });

    it('should throw auth error getting financial actions', async () => {
        nock('https://api.sandbox.checkout.com').get('/financial-actions').reply(401);

        try {
            const cko = new Checkout();

            const reports = await cko.financial.query();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});