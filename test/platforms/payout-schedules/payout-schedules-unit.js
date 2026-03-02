import { AuthenticationError } from '../../../src/services/errors.js';
import { Checkout } from '../../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const platforms_ack = 'ack_123456789ry3uhiczwxkutelffq';
const platforms_secret =
    'Tlc9Un7iHa8IJq-rM7yzZYP7Bmm2iCDKXBzFRhGGLTUsNIm0KVqyngyiF_zR9g-B47RDJhbTuPYqSi-KqApIhA';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Platforms - Payout Schedules', () => {
    it('should update a sub-entity payout schedule', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payout-schedules')
            .reply(201, {
                _links: {
                    self: {
                        href: 'https://123456789.api.checkout.com/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y',
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        let instrument = await cko.platforms.updateSubEntityPayoutSchedule(
            'ent_aneh5mtyobxzazriwuevngrz6y',
            {
                iso: {
                    enabled: true,
                    threshold: 100,
                    recurrence: {
                        frequency: 'weekly',
                        by_day: 'monday',
                    },
                },
            }
        );
    });

    it('should throw auth error updating a sub-entity payout schedule', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payout-schedules')
            .reply(401);

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        try {
            let instrument = await cko.platforms.updateSubEntityPayoutSchedule(
                'ent_aneh5mtyobxzazriwuevngrz6y',
                {
                    iso: {
                        enabled: true,
                        threshold: 100,
                        recurrence: {
                            frequency: 'weekly',
                            by_day: 'monday',
                        },
                    },
                }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should retrieve a sub-entity payout schedule', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payout-schedules')
            .reply(201, {
                GBP: {
                    recurrence: {
                        enabled: true,
                        threshold: 100,
                        schedule: {
                            frequency: 'weekly',
                            by_day: 'monday',
                        },
                    },
                    _links: {
                        self: {
                            href: 'https://123456789.api.checkout.com/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y',
                        },
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        let instrument = await cko.platforms.retrieveSubEntityPayoutSchedule(
            'ent_aneh5mtyobxzazriwuevngrz6y'
        );
    });

    it('should throw auth error when you retrieve a sub-entity payout schedule', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payout-schedules')
            .reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            let instrument = await cko.platforms.retrieveSubEntityPayoutSchedule(
                'ent_aneh5mtyobxzazriwuevngrz6y'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get payout schedule', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_123/payout-schedules')
            .reply(200, {
                entity_id: "ent_123",
                frequency: "daily"
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.platforms.retrieveSubEntityPayoutSchedule("ent_123");

        expect(response).to.not.be.null;
        expect(response.frequency).to.equal("daily");
    });

    it('should update payout schedule', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/accounts/entities/ent_123/payout-schedules')
            .reply(200, {
                entity_id: "ent_123",
                frequency: "weekly"
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.platforms.updateSubEntityPayoutSchedule("ent_123", {
            frequency: "weekly"
        });

        expect(response).to.not.be.null;
        expect(response.frequency).to.equal("weekly");
    });
});
