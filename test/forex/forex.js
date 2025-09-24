import { AuthenticationError, } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

describe('Forex', () => {
    it('should request a quote', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });

        nock('https://api.sandbox.checkout.com').post('/forex/quotes').reply(201, {
            id: 'qte_sdx7f7henoeetkqsdric7ehoum',
            expires_on: '2021-12-27T22:30:51.7771385Z',
            source_amount: 30000,
            source_currency: 'GBP',
            destination_amount: 40313,
            destination_currency: 'USD',
            rate: 1.34376561,
            is_single_use: false,
        });

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['fx'],
                environment: 'sandbox',
            }
        );
        let forex = await cko.forex.request({
            source_currency: 'GBP',
            source_amount: 30000,
            destination_currency: 'USD',
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
        });

        expect(forex.source_amount).to.equal(30000);
    });

    it('should throw AuthenticationError when requesting quote', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });
        nock('https://api.sandbox.checkout.com').post('/forex/quotes').reply(401);

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['fx'],
                environment: 'sandbox',
            }
        );

        try {
            let forex = await cko.forex.request({
                source_currency: 'GBP',
                source_amount: 30000,
                destination_currency: 'USD',
                processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get rates', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });

        nock('https://api.sandbox.checkout.com')
            .get('/forex/rates?product=card_payouts&source=visa&currency_pairs=GBPEUR,USDNOK,JPNCAD&processing_channel_id=pc_zs5fqhybzc2e3jmq3efvybybpq')
            .reply(201, {
                product: 'card_payouts',
                source: 'visa',
                rates: [
                    {
                        exchange_rate: 1.14208777,
                        currency_pair: 'GBPEUR'
                    },
                    {
                        exchange_rate: 0.83708142,
                        currency_pair: 'USDGBP',
                    }
                ],
                invalid_currency_pairs: 'JPNCAD',
            });

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['fx'],
                environment: 'sandbox',
            }
        );
        let rates = await cko.forex.getRates({
            product: 'card_payouts',
            source: 'visa',
            currency_pairs: 'GBPEUR,USDNOK,JPNCAD',
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
        });

        expect(rates.product).to.equal('card_payouts');
        expect(rates.source).to.equal('visa');
    });

    it('should throw AuthenticationError when getting rates', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/forex/rates?product=card_payouts&source=visa&currency_pairs=GBPEUR,USDNOK,JPNCAD&processing_channel_id=pc_zs5fqhybzc2e3jmq3efvybybpq')
            .reply(401);

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['fx'],
                environment: 'sandbox',
            }
        );

        try {
            let rates = await cko.forex.getRates({
                product: 'card_payouts',
                source: 'visa',
                currency_pairs: 'GBPEUR,USDNOK,JPNCAD',
                processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
