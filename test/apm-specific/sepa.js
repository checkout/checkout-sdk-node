import { ValidationError, NotFoundError } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Sepa', () => {
    it('should get mandate', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7jcm')
            .reply(200, {
                mandate_reference: 'Z10001205026454',
                customer_id: 'cus_w3kii25gnzmuphtb3ublwt52au',
                first_name: 'Sophie',
                last_name: 'Bonneville',
                address_line1: '101 Avenue de Gaulle',
                city: 'Paris',
                zip: '75013',
                country: 'FR',
                masked_account_iban: '******************7893',
                account_currency_code: 'EUR',
                account_country_code: 'DE',
                mandate_state: 'Active',
                billing_descriptor: 'Thanks for shopping! - Mandate: Z10001205026454',
                mandate_type: 'Single',
                _links: {
                    self: {
                        href:
                            'https://nginxtest.ckotech.co/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7jcm',
                    },
                    'sepa:mandate-cancel': {
                        href:
                            'https://nginxtest.ckotech.co/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7jcm/cancel',
                    },
                },
            });

        const cko = new Checkout(SK);

        const sepa = await cko.sepa.getMandate('src_juu42y3bte2ezfkymi7vmc7jcm');
        expect(sepa.mandate_reference).to.equal('Z10001205026454');
    });

    it('should get live mandate', async () => {
        nock('https://api.checkout.com')
            .get('/sepa/mandates/src_juu42y3bte2ezfkymi7vmc7jcm')
            .reply(200, {
                mandate_reference: 'Z10001205026454',
                customer_id: 'cus_w3kii25gnzmuphtb3ublwt52au',
                first_name: 'Sophie',
                last_name: 'Bonneville',
                address_line1: '101 Avenue de Gaulle',
                city: 'Paris',
                zip: '75013',
                country: 'FR',
                masked_account_iban: '******************7893',
                account_currency_code: 'EUR',
                account_country_code: 'DE',
                mandate_state: 'Active',
                billing_descriptor: 'Thanks for shopping! - Mandate: Z10001205026454',
                mandate_type: 'Single',
                _links: {
                    self: {
                        href:
                            'https://nginxtest.ckotech.co/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7jcm',
                    },
                    'sepa:mandate-cancel': {
                        href:
                            'https://nginxtest.ckotech.co/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7jcm/cancel',
                    },
                },
            });

        const cko = new Checkout('sk_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        const sepa = await cko.sepa.getMandate('src_juu42y3bte2ezfkymi7vmc7jcm');
        expect(sepa.mandate_reference).to.equal('Z10001205026454');
    });

    it('should throw NotFFound error when trying to get mandate', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7111')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const sepa = await cko.sepa.getMandate('src_juu42y3bte2ezfkymi7vmc7111');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should cancel mandate', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/sepa-external/mandates/src_htc2tova4cauldk7r47czuudji/cancel')
            .reply(200, {
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/sepa-external/mandates/src_htc2tova4cauldk7r47czuudji/cancel',
                    },
                    'sepa:mandate-get': {
                        href:
                            'https://api.sandbox.checkout.com/sepa-external/mandates/src_htc2tova4cauldk7r47czuudji',
                    },
                },
            });

        const cko = new Checkout(SK);

        const sepa = await cko.sepa.cancelMandate('src_htc2tova4cauldk7r47czuudji');
    });

    it('should cancel live mandate', async () => {
        nock('https://api.checkout.com')
            .post('/sepa/mandates/src_htc2tova4cauldk7r47czuudji/cancel')
            .reply(200, {
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/sepa-external/mandates/src_htc2tova4cauldk7r47czuudji/cancel',
                    },
                    'sepa:mandate-get': {
                        href:
                            'https://api.sandbox.checkout.com/sepa-external/mandates/src_htc2tova4cauldk7r47czuudji',
                    },
                },
            });

        const cko = new Checkout('sk_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        const sepa = await cko.sepa.cancelMandate('src_htc2tova4cauldk7r47czuudji');
    });

    it('should throw NotFound error when trying to cancel mandate', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/sepa-external/mandates/src_htc2tova4cauldk7r47czuu111/cancel')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const sepa = await cko.sepa.cancelMandate('src_htc2tova4cauldk7r47czuu111');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get mandate via PPRO', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/ppro/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7jcm')
            .reply(200, {
                mandate_reference: 'Z10001205026454',
                customer_id: 'cus_w3kii25gnzmuphtb3ublwt52au',
                first_name: 'Sophie',
                last_name: 'Bonneville',
                address_line1: '101 Avenue de Gaulle',
                city: 'Paris',
                zip: '75013',
                country: 'FR',
                masked_account_iban: '******************7893',
                account_currency_code: 'EUR',
                account_country_code: 'DE',
                mandate_state: 'Active',
                billing_descriptor: 'Thanks for shopping! - Mandate: Z10001205026454',
                mandate_type: 'Single',
                _links: {
                    self: {
                        href:
                            'https://nginxtest.ckotech.co/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7jcm',
                    },
                    'sepa:mandate-cancel': {
                        href:
                            'https://nginxtest.ckotech.co/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7jcm/cancel',
                    },
                },
            });

        const cko = new Checkout(SK);

        const sepa = await cko.sepa.getPPROMandate('src_juu42y3bte2ezfkymi7vmc7jcm');
        expect(sepa.mandate_reference).to.equal('Z10001205026454');
    });

    it('should get live mandate via PPRO', async () => {
        nock('https://api.checkout.com')
            .get('/ppro/sepa/mandates/src_juu42y3bte2ezfkymi7vmc7jcm')
            .reply(200, {
                mandate_reference: 'Z10001205026454',
                customer_id: 'cus_w3kii25gnzmuphtb3ublwt52au',
                first_name: 'Sophie',
                last_name: 'Bonneville',
                address_line1: '101 Avenue de Gaulle',
                city: 'Paris',
                zip: '75013',
                country: 'FR',
                masked_account_iban: '******************7893',
                account_currency_code: 'EUR',
                account_country_code: 'DE',
                mandate_state: 'Active',
                billing_descriptor: 'Thanks for shopping! - Mandate: Z10001205026454',
                mandate_type: 'Single',
                _links: {
                    self: {
                        href:
                            'https://nginxtest.ckotech.co/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7jcm',
                    },
                    'sepa:mandate-cancel': {
                        href:
                            'https://nginxtest.ckotech.co/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7jcm/cancel',
                    },
                },
            });

        const cko = new Checkout('sk_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        const sepa = await cko.sepa.getPPROMandate('src_juu42y3bte2ezfkymi7vmc7jcm');
        expect(sepa.mandate_reference).to.equal('Z10001205026454');
    });

    it('should throw NotFound error when trying to get mandate via PPRO', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/ppro/sepa-external/mandates/src_juu42y3bte2ezfkymi7vmc7111')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const sepa = await cko.sepa.getPPROMandate('src_juu42y3bte2ezfkymi7vmc7111');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should cancel mandate via PPRO', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/ppro/sepa-external/mandates/src_htc2tova4cauldk7r47czuudji/cancel')
            .reply(200, {
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/sepa-external/mandates/src_htc2tova4cauldk7r47czuudji/cancel',
                    },
                    'sepa:mandate-get': {
                        href:
                            'https://api.sandbox.checkout.com/sepa-external/mandates/src_htc2tova4cauldk7r47czuudji',
                    },
                },
            });

        const cko = new Checkout(SK);

        const sepa = await cko.sepa.cancelPPROMandate('src_htc2tova4cauldk7r47czuudji');
    });

    it('should cancel live mandate via PPRO', async () => {
        nock('https://api.checkout.com')
            .post('/ppro/sepa/mandates/src_htc2tova4cauldk7r47czuudji/cancel')
            .reply(200, {
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/sepa-external/mandates/src_htc2tova4cauldk7r47czuudji/cancel',
                    },
                    'sepa:mandate-get': {
                        href:
                            'https://api.sandbox.checkout.com/sepa-external/mandates/src_htc2tova4cauldk7r47czuudji',
                    },
                },
            });

        const cko = new Checkout('sk_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        const sepa = await cko.sepa.cancelPPROMandate('src_htc2tova4cauldk7r47czuudji');
    });

    it('should throw NotFound error when trying to cancel mandate via PPRO', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/ppro/sepa-external/mandates/src_htc2tova4cauldk7r47czuu111/cancel')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const sepa = await cko.sepa.cancelPPROMandate('src_htc2tova4cauldk7r47czuu111');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
