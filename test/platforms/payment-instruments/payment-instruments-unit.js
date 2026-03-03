import { AuthenticationError, NotFoundError } from '../../../src/services/errors.js';
import { Checkout } from '../../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const platforms_ack = 'ack_123456789ry3uhiczwxkutelffq';
const platforms_secret =
    'Tlc9Un7iHa8IJq-rM7yzZYP7Bmm2iCDKXBzFRhGGLTUsNIm0KVqyngyiF_zR9g-B47RDJhbTuPYqSi-KqApIhA';

describe('Platforms - Payment Instruments', () => {
    it('should get payment instrument details', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .get(
                '/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments/ppi_c475pnoq2hkojdimoutaszcasa'
            )
            .reply(200, {
                id: 'ppi_c475pnoq2hkojdimoutaszcasa',
                label: 'bank account **** 0604',
                type: 'bank_account',
                currency: 'GBP',
                country: 'GB',
                document: {
                    file_id: 'file_aj4q74e3d4v7zn2kps3v3bci5q',
                    type: 'bank_statement',
                },
                status: 'pending',
                default: true,
                _links: {
                    self: {
                        href: '/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments/ppi_c475pnoq2hkojdimoutaszcasa',
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });
        let instrument = await cko.platforms.getPaymentInstrumentDetails(
            'ent_aneh5mtyobxzazriwuevngrz6y',
            'ppi_c475pnoq2hkojdimoutaszcasa'
        );
        expect(instrument.id).to.equal('ppi_c475pnoq2hkojdimoutaszcasa');
    });

    it('should throw Auth errot geting payment instrument details', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .get(
                '/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments/ppi_c475pnoq2hkojdimoutaszcasa'
            )
            .reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });
            let instrument = await cko.platforms.getPaymentInstrumentDetails(
                'ent_aneh5mtyobxzazriwuevngrz6y',
                'ppi_c475pnoq2hkojdimoutaszcasa'
            );
            expect(instrument.id).to.equal('ppi_c475pnoq2hkojdimoutaszcasa');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should update a payment instrument details', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/accounts/entities/ent_wxglze3wwywujg4nna5fb7ldli/payment-instruments/ppi_qn4nis4k3ykpzzu7cvtuvhqqga')
            .reply(200, {
                id: 'ppi_qn4nis4k3ykpzzu7cvtuvhqqga',
                _links: {
                    self: {
                        href: 'https://123456789.api.checkout.com/accounts/entities/ent_wxglze3wwywujg4nna5fb7ldli',
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        let instrument = await cko.platforms.updatePaymentInstrumentDetails(
            'ent_wxglze3wwywujg4nna5fb7ldli',
            'ppi_qn4nis4k3ykpzzu7cvtuvhqqga',
            {
                label: "New Label",
                default: true,
            }
        );

        expect(instrument.id).to.equal('ppi_qn4nis4k3ykpzzu7cvtuvhqqga');
    });

    it('should throw AuthenticationError when updating a payment instrument details', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/accounts/entities/ent_wxglze3wwywujg4nna5fb7ldli/payment-instruments/ppi_qn4nis4k3ykpzzu7cvtuvhqqga')
            .reply(401);
        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            let instrument = cko.platforms.updatePaymentInstrumentDetails(
                'ent_wxglze3wwywujg4nna5fb7ldli',
                'ppi_qn4nis4k3ykpzzu7cvtuvhqqga',
                {
                    label: "New Label",
                    default: true,
                }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should create a payment instrument [deprecated]', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/instruments')
            .reply(202, {
                headers: {
                    'cko-request-id': 'f02e7328-b7fc-4993-b9f6-4c913421f57e',
                    'cko-version': '3.34.5',
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        let instrument = await cko.platforms.createPaymentInstrument(
            'ent_aneh5mtyobxzazriwuevngrz6y',
            {
                label: "Bob's Bank Account",
                type: 'bank_account',
                currency: 'GBP',
                country: 'GB',
                document: {
                    type: 'bank_statement',
                    file_id: 'file_b642nlp54js6nzzb3tz3txgsxu',
                },
                account_holder: {
                    first_name: 'John',
                    last_name: 'Doe',
                    billing_address: {
                        address_line1: '90 Tottenham Court Road',
                        city: 'London',
                        zip: 'W1T4TJ',
                        country: 'GB',
                    },
                },
            }
        );

        expect(Object.keys(instrument.headers).length).to.equal(2);
    });

    it('should add a payment instrument', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments')
            .reply(201, {
                id: 'ppi_goaxfhavh5ztwdf662mnii6zem',
                _links: {
                    self: {
                        href: '/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments/ppi_goaxfhavh5ztwdf662mnii6zem',
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        let instrument = await cko.platforms.addPaymentInstrument(
            'ent_aneh5mtyobxzazriwuevngrz6y',
            {
                label: "Bob's Bank Account",
                type: 'bank_account',
                currency: 'GBP',
                country: 'GB',
                default: true,
                instrument_details: {
                    account_number: '12345678',
                    bank_code: '050389',
                },
                document: {
                    type: 'bank_statement',
                    file_id: 'file_b642nlp54js6nzzb3tz3txgsxu',
                },
            }
        );

        expect(instrument.id).to.equal('ppi_goaxfhavh5ztwdf662mnii6zem');
    });

    it('should throw AuthenticationError when creating a payment instrument [deprecated]', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/instruments')
            .reply(401);
        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            let instrument = await cko.platforms.createPaymentInstrument(
                'ent_aneh5mtyobxzazriwuevngrz6y',
                {
                    label: "Bob's Bank Account",
                    type: 'bank_account',
                    currency: 'GBP',
                    country: 'GB',
                    document: {
                        type: 'bank_statement',
                        file_id: 'file_b642nlp54js6nzzb3tz3txgsxu',
                    },
                    account_holder: {
                        first_name: 'John',
                        last_name: 'Doe',
                        billing_address: {
                            address_line1: '90 Tottenham Court Road',
                            city: 'London',
                            zip: 'W1T4TJ',
                            country: 'GB',
                        },
                    },
                }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw AuthenticationError when adding a payment instrument', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments')
            .reply(401);
        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            let instrument = await cko.platforms.addPaymentInstrument(
                'ent_aneh5mtyobxzazriwuevngrz6y',
                {
                    label: "Bob's Bank Account",
                    type: 'bank_account',
                    currency: 'GBP',
                    country: 'GB',
                    default: true,
                    instrument_details: {
                        account_number: '12345678',
                        bank_code: '050389',
                    },
                    document: {
                        type: 'bank_statement',
                        file_id: 'file_b642nlp54js6nzzb3tz3txgsxu',
                    },
                }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should query payment instruments', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .get(
                '/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments?status=verified'
            )
            .reply(201, {
                data: [
                    {
                        id: 'ppi_goaxfhavh5ztwdf662mnii6zem',
                        label: "Bob's Bank Account",
                        country: 'GB',
                        status: 'verified',
                        entity_id: 'ent_aneh5mtyobxzazriwuevngrz6y',
                        default: true,
                        type: 'bank_account',
                        instrument_id: 'src_rqbacwtohm7uxmittmcuzwbp7u',
                        date_modified: '2022-12-13T15:32:27.7065863Z',
                        currency: 'GBP',
                        date_created: '2022-12-13T15:32:06.1027090Z',
                        _links: [Object],
                    },
                ],
                _links: {
                    self: {
                        href: '/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments?status=verified',
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        let instrument = await cko.platforms.queryPaymentInstruments(
            'ent_aneh5mtyobxzazriwuevngrz6y',
            'verified'
        );

        expect(instrument.data[0].entity_id).to.equal('ent_aneh5mtyobxzazriwuevngrz6y');
    });

    it('should throw auth error when you query payment instruments', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .get(
                '/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments?status=verified'
            )
            .reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            let instrument = await cko.platforms.queryPaymentInstruments(
                'ent_aneh5mtyobxzazriwuevngrz6y',
                'verified'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw NotFoundError when querying payment instruments for non-existent entity', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'accounts',
        });
        
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_nonexistent/payment-instruments')
            .reply(404, {
                request_id: 'req_123',
                error_type: 'resource_not_found'
            });

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            await cko.platforms.queryPaymentInstruments('ent_nonexistent');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
