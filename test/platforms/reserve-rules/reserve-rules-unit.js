import { AuthenticationError, ValidationError } from '../../../src/services/errors.js';
import { Checkout } from '../../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const platforms_ack = 'ack_123456789ry3uhiczwxkutelffq';
const platforms_secret =
    'Tlc9Un7iHa8IJq-rM7yzZYP7Bmm2iCDKXBzFRhGGLTUsNIm0KVqyngyiF_zR9g-B47RDJhbTuPYqSi-KqApIhA';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Platforms - Reserve Rules', () => {
    it('should get reserve rule details', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        const entityId = 'ent_aneh5mtyobxzazriwuevngrz6y';
        const reserveRuleId = 'rsv_qn4nis4k3ykpzzu7cvtuvhqqga';

        nock('https://123456789.api.sandbox.checkout.com')
            .get(`/accounts/entities/${entityId}/reserve-rules/${reserveRuleId}`)
            .reply(200, {
                id: reserveRuleId,
                type: 'rolling',
                valid_from: '2001-01-01T13:33:00.000Z',
                rolling: {
                    percentage: 10,
                    holding_duration: {
                        weeks: 2
                    }
                }
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const response = await cko.platforms.getReserveRuleDetails(entityId, reserveRuleId);

        expect(response.id).to.equal(reserveRuleId);
        expect(response.rolling.percentage).to.equal(10);
    });

    it('should update a reserve rule', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        const entityId = 'ent_aneh5mtyobxzazriwuevngrz6y';
        const reserveRuleId = 'rsv_qn4nis4k3ykpzzu7cvtuvhqqga';

        nock('https://123456789.api.sandbox.checkout.com')
            .put(`/accounts/entities/${entityId}/reserve-rules/${reserveRuleId}`)
            .reply(200, {
                id: reserveRuleId,
                _links: {
                    self: { href: 'string' }
                }
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const response = await cko.platforms.updateReserveRule(entityId, reserveRuleId, {
            type: 'rolling',
            valid_from: '2001-01-01T13:33:00.000Z',
            rolling: {
                percentage: 15,
                holding_duration: {
                    weeks: 4
                }
            }
        }, 'Y3Y9MCZydj0w');

        expect(response.id).to.equal(reserveRuleId);
        expect(response._links.self.href).to.equal('string');
    });

    it('should add a reserve rule', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        const entityId = 'ent_aneh5mtyobxzazriwuevngrz6y';
        const reserveRuleId = 'rsv_qn4nis4k3ykpzzu7cvtuvhqqga';

        nock('https://123456789.api.sandbox.checkout.com')
            .post(`/accounts/entities/${entityId}/reserve-rules`)
            .reply(201, {
                id: reserveRuleId,
                _links: {
                    self: { href: 'string' }
                }
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const response = await cko.platforms.addReserveRule(entityId, {
            type: 'rolling',
            valid_from: '2001-01-01T13:33:00.000Z',
            rolling: {
                percentage: 10,
                holding_duration: {
                    weeks: 2
                }
            }
        });

        expect(response.id).to.equal(reserveRuleId);
        expect(response._links.self.href).to.equal('string');
    });

    it('should query reserve rules', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        const entityId = 'ent_aneh5mtyobxzazriwuevngrz6y';
        const reserveRuleId = 'rsv_qn4nis4k3ykpzzu7cvtuvhqqga';

        nock('https://123456789.api.sandbox.checkout.com')
            .get(`/accounts/entities/${entityId}/reserve-rules`)
            .reply(200, {
                data: [
                    {
                        id: reserveRuleId,
                        type: 'rolling',
                        valid_from: '2001-01-01T13:33:00.000Z',
                        rolling: {
                            percentage: 10,
                            holding_duration: {
                                weeks: 2
                            }
                        }
                    }
                ]
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const response = await cko.platforms.queryReserveRules(entityId);

        expect(response.data).to.be.an('array');
        expect(response.data[0].id).to.equal(reserveRuleId);
        expect(response.data[0].rolling.percentage).to.equal(10);
    });

    it('should throw AuthenticationError when updating a reserve rule', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        const entityId = 'ent_aneh5mtyobxzazriwuevngrz6y';
        const reserveRuleId = 'rsv_qn4nis4k3ykpzzu7cvtuvhqqga';

        nock('https://123456789.api.sandbox.checkout.com')
            .put(`/accounts/entities/${entityId}/reserve-rules/${reserveRuleId}`)
            .reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789'
            });

            await cko.platforms.updateReserveRule(entityId, reserveRuleId, {
                type: 'rolling',
                valid_from: '2001-01-01T13:33:00.000Z',
                rolling: {
                    percentage: 15,
                    holding_duration: {
                        weeks: 4
                    }
                }
            }, 'Y3Y9MCZydj0w');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw ValidationError when adding invalid reserve rule', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'accounts',
        });
        
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/accounts/entities/ent_test123/reserve-rules')
            .reply(422, {
                request_id: 'req_123',
                error_type: 'request_invalid',
                error_codes: ['percentage_invalid']
            });

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            await cko.platforms.addReserveRule('ent_test123', {
                type: 'rolling',
                percentage: -10  // Invalid negative percentage
            });
            expect.fail('Should have thrown ValidationError');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should get a reserve rule', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_123/reserve-rules/rsr_123')
            .reply(200, {
                id: "rsr_123",
                entity_id: "ent_123",
                reserve_amount: 1000
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.platforms.getReserveRuleDetails("ent_123", "rsr_123");

        expect(response).to.not.be.null;
        expect(response.id).to.equal("rsr_123");
    });

    it('should update a reserve rule', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/accounts/entities/ent_123/reserve-rules/rsr_123')
            .reply(200, {
                id: "rsr_123",
                reserve_amount: 2000
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.platforms.updateReserveRule("ent_123", "rsr_123", {
            reserve_amount: 2000
        });

        expect(response).to.not.be.null;
        expect(response.reserve_amount).to.equal(2000);
    });
});
