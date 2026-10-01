import { AuthenticationError, UrlAlreadyRegistered, NotFoundError } from '../../../src/services/errors.js';
import { Checkout } from '../../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const platforms_ack = 'ack_123456789ry3uhiczwxkutelffq';
const platforms_secret =
    'Tlc9Un7iHa8IJq-rM7yzZYP7Bmm2iCDKXBzFRhGGLTUsNIm0KVqyngyiF_zR9g-B47RDJhbTuPYqSi-KqApIhA';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Platforms - SubEntity', () => {
    it('should Onboard a sub-entity', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/accounts/entities')
            .reply(201, {
                id: 'ent_stuoyqyx4bsnsgfgair7hjdwna',
                reference: 'superhero123444',
                status: 'requirements_due',
                capabilities: {
                    payments: { available: true, enabled: false },
                    payouts: { available: true, enabled: false },
                },
                requirements_due: [
                    {
                        field: 'company.business_registration_number',
                        reason: 'required',
                    },
                ],
                _links: {
                    self: {
                        href: 'https://123456789.api.sandbox.checkout.com/accounts/entities/ent_stuoyqyx4bsnsgfgair7hjdwna',
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });
        let platform = await cko.platforms.onboardSubEntity({
            reference: 'superhero123444',
            contact_details: {
                phone: {
                    country_code: 'GB',
                    number: '2345678910',
                },
                email_addresses: {
                    primary: 'john.doe@example.com',
                },
            },
            profile: {
                urls: ['https://www.ljnkjnnjjknk.com'],
                mccs: ['0742'],
                default_holding_currency: 'USD',
                holding_currencies: ['USD'],
            },
            company: {
                legal_name: 'Super Hero Masks Inc.',
                trading_name: 'Super Hero Masks',
                business_registration_number: '01234567',
                business_type: 'limited_company',
                date_of_incorporation: {
                    day: 1,
                    month: 6,
                    year: 2010,
                },
                principal_address: {
                    address_line1: '90 Tottenham Court Road',
                    city: 'London',
                    zip: 'W1T4TJ',
                    country: 'GB',
                },
                registered_address: {
                    address_line1: '90 Tottenham Court Road',
                    city: 'London',
                    zip: 'W1T4TJ',
                    country: 'GB',
                },
                representatives: [
                    {
                        // v3.0: person details are nested under `individual`, plus `roles`.
                        individual: {
                            first_name: 'John',
                            last_name: 'Doe',
                            date_of_birth: {
                                day: 5,
                                month: 6,
                                year: 1995,
                            },
                            place_of_birth: {
                                country: 'GB',
                            },
                            address: {
                                address_line1: '90 Tottenham Court Road',
                                city: 'London',
                                zip: 'W1T4TJ',
                                country: 'GB',
                            },
                        },
                        roles: ['ubo', 'authorised_signatory', 'director', 'control_person'],
                    },
                ],
            },
            processing_details: {
                annual_processing_volume: 1000000,
                average_transaction_value: 5000,
                average_order_fulfillment_time: 3,
                highest_transaction_value: 25000,
                currency: 'GBP',
                settlement_country: 'GB',
                target_countries: ['GB'],
                payments: {
                    ach: {
                        annual_ach_volume: 1000000,
                        average_ach_transaction_size: 5000,
                        estimated_monthly_credit_volume: 100000,
                        average_credit_amount: 5000,
                    },
                },
            },
        });
        expect(platform.reference).to.equal('superhero123444');
    });

    it('should throw conflict error onboarding a sub-entity', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/accounts/entities')
            .reply(409, {
                id: 'ent_stuoyqyx4bsnsgfgair7hjdwna',
                _links: {
                    self: {
                        href: 'https://123456789.api.sandbox.checkout.com/accounts/entities/ent_stuoyqyx4bsnsgfgair7hjdwna',
                    },
                },
            });

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });
            let platform = await cko.platforms.onboardSubEntity({
                reference: 'superhero123444',
                contact_details: {
                    phone: {
                        country_code: 'GB',
                        number: '2345678910',
                    },
                    email_addresses: {
                        primary: 'john.doe@example.com',
                    },
                },
                profile: {
                    urls: ['https://www.ljnkjnnjjknk.com'],
                    mccs: ['0742'],
                    default_holding_currency: 'USD',
                    holding_currencies: ['USD'],
                },
                company: {
                    legal_name: 'Super Hero Masks Inc.',
                    trading_name: 'Super Hero Masks',
                    business_registration_number: '01234567',
                    business_type: 'limited_company',
                    date_of_incorporation: {
                        day: 1,
                        month: 6,
                        year: 2010,
                    },
                    principal_address: {
                        address_line1: '90 Tottenham Court Road',
                        city: 'London',
                        zip: 'W1T4TJ',
                        country: 'GB',
                    },
                    registered_address: {
                        address_line1: '90 Tottenham Court Road',
                        city: 'London',
                        zip: 'W1T4TJ',
                        country: 'GB',
                    },
                    representatives: [
                        {
                            individual: {
                                first_name: 'John',
                                last_name: 'Doe',
                                date_of_birth: {
                                    day: 5,
                                    month: 6,
                                    year: 1995,
                                },
                                place_of_birth: {
                                    country: 'GB',
                                },
                                address: {
                                    address_line1: '90 Tottenham Court Road',
                                    city: 'London',
                                    zip: 'W1T4TJ',
                                    country: 'GB',
                                },
                            },
                            roles: ['ubo', 'authorised_signatory', 'director', 'control_person'],
                        },
                    ],
                },
                processing_details: {
                    annual_processing_volume: 1000000,
                    average_transaction_value: 5000,
                    average_order_fulfillment_time: 3,
                    highest_transaction_value: 25000,
                    currency: 'GBP',
                    settlement_country: 'GB',
                    target_countries: ['GB'],
                    payments: {
                        ach: {
                            annual_ach_volume: 1000000,
                            average_ach_transaction_size: 5000,
                            estimated_monthly_credit_volume: 100000,
                            average_credit_amount: 5000,
                        },
                    },
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(UrlAlreadyRegistered);
            expect(err.body.id).to.equal('ent_stuoyqyx4bsnsgfgair7hjdwna');
        }
    });

    it('should throw AuthenticationError when onboarding sub-entity', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com').post('/accounts/entities').reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });
            let platform = await cko.platforms.onboardSubEntity({
                reference: 'superhero123444',
                contact_details: {
                    phone: {
                        country_code: 'GB',
                        number: '2345678910',
                    },
                    email_addresses: {
                        primary: 'john.doe@example.com',
                    },
                },
                profile: {
                    urls: ['https://www.ljnkjnnjjknk.com'],
                    mccs: ['0742'],
                    default_holding_currency: 'USD',
                    holding_currencies: ['USD'],
                },
                company: {
                    legal_name: 'Super Hero Masks Inc.',
                    trading_name: 'Super Hero Masks',
                    business_registration_number: '01234567',
                    business_type: 'limited_company',
                    date_of_incorporation: {
                        day: 1,
                        month: 6,
                        year: 2010,
                    },
                    principal_address: {
                        address_line1: '90 Tottenham Court Road',
                        city: 'London',
                        zip: 'W1T4TJ',
                        country: 'GB',
                    },
                    registered_address: {
                        address_line1: '90 Tottenham Court Road',
                        city: 'London',
                        zip: 'W1T4TJ',
                        country: 'GB',
                    },
                    representatives: [
                        {
                            individual: {
                                first_name: 'John',
                                last_name: 'Doe',
                                date_of_birth: {
                                    day: 5,
                                    month: 6,
                                    year: 1995,
                                },
                                place_of_birth: {
                                    country: 'GB',
                                },
                                address: {
                                    address_line1: '90 Tottenham Court Road',
                                    city: 'London',
                                    zip: 'W1T4TJ',
                                    country: 'GB',
                                },
                            },
                            roles: ['ubo', 'authorised_signatory', 'director', 'control_person'],
                        },
                    ],
                },
                processing_details: {
                    annual_processing_volume: 1000000,
                    average_transaction_value: 5000,
                    average_order_fulfillment_time: 3,
                    highest_transaction_value: 25000,
                    currency: 'GBP',
                    settlement_country: 'GB',
                    target_countries: ['GB'],
                    payments: {
                        ach: {
                            annual_ach_volume: 1000000,
                            average_ach_transaction_size: 5000,
                            estimated_monthly_credit_volume: 100000,
                            average_credit_amount: 5000,
                        },
                    },
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get a sub-entity members', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/members')
            .reply(200, {
                "data": [
                    {
                        "user_id": "usr_eyk754cqieqexfh6u46no5nnha"
                    }
                ]
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        let response = await cko.platforms.getSubEntityMembers('ent_aneh5mtyobxzazriwuevngrz6y');
        expect(response.data[0].user_id).to.equal('usr_eyk754cqieqexfh6u46no5nnha');
    });

    it('should reinvite a sub-entity member', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/members/usr_eyk754cqieqexfh6u46no5nnha')
            .reply(200, {
                "id": "usr_eyk754cqieqexfh6u46no5nnha"
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        let member = await cko.platforms.reinviteSubEntityMember(
            'ent_aneh5mtyobxzazriwuevngrz6y',
            'usr_eyk754cqieqexfh6u46no5nnha',
            {});

        expect(member.id).to.equal('usr_eyk754cqieqexfh6u46no5nnha');
    });

    it('should get sub-entity details', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y')
            .reply(200, {
                id: 'ent_aneh5mtyobxzazriwuevngrz6y',
                reference: 'superhero1234',
                status: 'active',
                capabilities: {
                    payments: { available: true, enabled: true },
                    payouts: { available: true, enabled: true },
                },
                company: {
                    business_registration_number: '452349600005',
                    legal_name: 'Super Hero Masks Inc.',
                    trading_name: 'Super Hero Masks',
                    principal_address: {
                        address_line1: '90 Tottenham Court Road',
                        city: 'London',
                        country: 'GB',
                        zip: 'W1T4TJ',
                    },
                    registered_address: {
                        address_line1: '90 Tottenham Court Road',
                        city: 'London',
                        country: 'GB',
                        zip: 'W1T4TJ',
                    },
                    representatives: [[Object]],
                },
                contact_details: { phone: { number: '2345678910' } },
                instruments: [],
                profile: {
                    default_holding_currency: 'GBP',
                    mccs: ['0742'],
                    urls: ['https://www.superheroexample.com'],
                },
                requirements_due: [],
                _links: {
                    self: {
                        href: 'https://123456789.api.sandbox.checkout.com/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y',
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        let details = await cko.platforms.getSubEntityDetails('ent_aneh5mtyobxzazriwuevngrz6y');
        expect(details.id).to.equal('ent_aneh5mtyobxzazriwuevngrz6y');
    });

    it('should throw auth error getting sub-entity details', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y')
            .reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            let details = await cko.platforms.getSubEntityDetails('ent_aneh5mtyobxzazriwuevngrz6y');
            expect(details.id).to.equal('ent_aneh5mtyobxzazriwuevngrz6y');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should update sub-entity details', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y')
            .reply(200, {
                id: 'ent_aneh5mtyobxzazriwuevngrz6y',
                reference: 'superhero1234',
                status: 'pending',
                capabilities: {
                    payments: { available: true, enabled: true },
                    payouts: { available: true, enabled: true },
                },
                requirements_due: [],
                _links: {
                    self: {
                        href: 'https://123456789.api.sandbox.checkout.com/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y',
                    },
                },
            });
        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        let entity = await cko.platforms.updateSubEntityDetails('ent_aneh5mtyobxzazriwuevngrz6y', {
            reference: 'superhero12349',
            contact_details: {
                phone: {
                    country_code: 'GB',
                    number: '2345678910',
                },
                email_addresses: {
                    primary: 'john.doe@example.com',
                },
            },
            profile: {
                urls: ['https://www.superheroexample.com'],
                mccs: ['0742'],
                default_holding_currency: 'USD',
                holding_currencies: ['USD'],
            },
            company: {
                business_registration_number: '45234960',
                business_type: 'limited_company',
                legal_name: 'Super Hero Masks Inc.',
                trading_name: 'Super Hero Masks',
                date_of_incorporation: {
                    day: 1,
                    month: 6,
                    year: 2010,
                },
                principal_address: {
                    address_line1: '90 Tottenham Court Road',
                    city: 'London',
                    zip: 'W1T4TJ',
                    country: 'GB',
                },
                registered_address: {
                    address_line1: '90 Tottenham Court Road',
                    city: 'London',
                    zip: 'W1T4TJ',
                    country: 'GB',
                },
                representatives: [
                    {
                        individual: {
                            first_name: 'John',
                            last_name: 'Doe',
                            date_of_birth: {
                                day: 5,
                                month: 6,
                                year: 1995,
                            },
                            place_of_birth: {
                                country: 'GB',
                            },
                            address: {
                                address_line1: '90 Tottenham Court Road',
                                city: 'London',
                                zip: 'W1T4TJ',
                                country: 'GB',
                            },
                        },
                        roles: ['ubo', 'authorised_signatory', 'director', 'control_person'],
                    },
                ],
            },
            processing_details: {
                annual_processing_volume: 1000000,
                average_transaction_value: 5000,
                average_order_fulfillment_time: 3,
                highest_transaction_value: 25000,
                currency: 'GBP',
                settlement_country: 'GB',
                target_countries: ['GB'],
                payments: {
                    ach: {
                        annual_ach_volume: 1000000,
                        average_ach_transaction_size: 5000,
                        estimated_monthly_credit_volume: 100000,
                        average_credit_amount: 5000,
                    },
                },
            },
        });
        expect(entity.id).to.equal('ent_aneh5mtyobxzazriwuevngrz6y');
    });

    it('should throw AuthenticationError when updating sub-entity details', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y')
            .reply(401);
        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            let entity = await cko.platforms.updateSubEntityDetails(
                'ent_aneh5mtyobxzazriwuevngrz6y',
                {
                    reference: 'superhero12349',
                    contact_details: {
                        phone: {
                            country_code: 'GB',
                            number: '2345678910',
                        },
                        email_addresses: {
                            primary: 'john.doe@example.com',
                        },
                    },
                    profile: {
                        urls: ['https://www.superheroexample.com'],
                        mccs: ['0742'],
                        default_holding_currency: 'USD',
                        holding_currencies: ['USD'],
                    },
                    company: {
                        business_registration_number: '45234960',
                        business_type: 'limited_company',
                        legal_name: 'Super Hero Masks Inc.',
                        trading_name: 'Super Hero Masks',
                        date_of_incorporation: {
                            day: 1,
                            month: 6,
                            year: 2010,
                        },
                        principal_address: {
                            address_line1: '90 Tottenham Court Road',
                            city: 'London',
                            zip: 'W1T4TJ',
                            country: 'GB',
                        },
                        registered_address: {
                            address_line1: '90 Tottenham Court Road',
                            city: 'London',
                            zip: 'W1T4TJ',
                            country: 'GB',
                        },
                        representatives: [
                            {
                                individual: {
                                    first_name: 'John',
                                    last_name: 'Doe',
                                    date_of_birth: {
                                        day: 5,
                                        month: 6,
                                        year: 1995,
                                    },
                                    place_of_birth: {
                                        country: 'GB',
                                    },
                                    address: {
                                        address_line1: '90 Tottenham Court Road',
                                        city: 'London',
                                        zip: 'W1T4TJ',
                                        country: 'GB',
                                    },
                                },
                                roles: ['ubo', 'authorised_signatory', 'director', 'control_person'],
                            },
                        ],
                    },
                    processing_details: {
                        annual_processing_volume: 1000000,
                        average_transaction_value: 5000,
                        average_order_fulfillment_time: 3,
                        highest_transaction_value: 25000,
                        currency: 'GBP',
                        settlement_country: 'GB',
                        target_countries: ['GB'],
                        payments: {
                            ach: {
                                annual_ach_volume: 1000000,
                                average_ach_transaction_size: 5000,
                                estimated_monthly_credit_volume: 100000,
                                average_credit_amount: 5000,
                            },
                        },
                    },
                }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw NotFoundError when getting members of non-existent entity', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'accounts',
        });
        
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_nonexistent/members')
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

            await cko.platforms.getSubEntityMembers('ent_nonexistent');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get sub entity members', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_123/members')
            .reply(200, {
                data: [
                    {
                        user_id: "usr_123",
                        email: "user@example.com"
                    }
                ]
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.platforms.getSubEntityMembers("ent_123");

        expect(response).to.not.be.null;
        expect(response.data).to.be.an('array');
    });

    it('should reinvite sub entity member', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/accounts/entities/ent_123/members/usr_123')
            .reply(200);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.platforms.reinviteSubEntityMember("ent_123", "usr_123");

        expect(response).to.not.be.null;
    });
    describe('representative documents (EEA Sole Trader 3.0)', () => {
        // The SDK sends the body as given, so the representative documents and the top-level
        // documents reach the API exactly as built. The representative object is strict on the API;
        // the top-level one is not.
        const representativeDocuments = {
            identity_verification: { type: 'passport', front: 'file_identityverificationaaaaaa' },
            proof_of_residential_address: { type: 'proof_of_address', front: 'file_proofofresidentialaddressa' },
            proof_of_registration: { type: 'extract_from_trade_register', front: 'file_proofofregistrationaaaaaaa' },
        };
        const body = {
            reference: 'ref_sole_trader',
            company: {
                business_type: 'individual_or_sole_proprietorship',
                representatives: [
                    {
                        individual: { first_name: 'Jane', last_name: 'Doe' },
                        roles: ['ubo'],
                        documents: representativeDocuments,
                    },
                ],
            },
            documents: { bank_verification: { type: 'bank_statement', front: 'file_bankverificationaaaaaaaaaa' } },
        };
        const checkout = () =>
            new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
                subdomain: '123456789',
            });

        beforeEach(() => {
            nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
                access_token: '1234',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'accounts',
            });
        });

        // POST and PUT return the basic v3.0 response (EntityBasicResponseWithLinksV3).
        const basicResponse = {
            id: 'ent_stuoyqyx4bsnsgfgair7hjdwna',
            reference: 'ref_sole_trader',
            requirements_due: [],
            _links: {
                self: { href: 'https://123456789.api.sandbox.checkout.com/accounts/entities/ent_stuoyqyx4bsnsgfgair7hjdwna' },
            },
        };

        it('onboardSubEntity sends them unchanged', async () => {
            let sent;
            nock('https://123456789.api.sandbox.checkout.com')
                .post('/accounts/entities', (requestBody) => {
                    sent = requestBody;
                    return true;
                })
                .reply(201, basicResponse);

            const response = await checkout().platforms.onboardSubEntity(body);

            expect(response.id).to.equal('ent_stuoyqyx4bsnsgfgair7hjdwna');
            expect(response.requirements_due).to.deep.equal([]);
            expect(sent.company.representatives[0].documents).to.deep.equal(representativeDocuments);
            expect(Object.keys(sent.documents)).to.deep.equal(['bank_verification']);
        });

        it('updateSubEntityDetails sends them unchanged', async () => {
            let sent;
            nock('https://123456789.api.sandbox.checkout.com')
                .put('/accounts/entities/ent_stuoyqyx4bsnsgfgair7hjdwna', (requestBody) => {
                    sent = requestBody;
                    return true;
                })
                .reply(200, basicResponse);

            const response = await checkout().platforms.updateSubEntityDetails('ent_stuoyqyx4bsnsgfgair7hjdwna', body);

            expect(response.id).to.equal('ent_stuoyqyx4bsnsgfgair7hjdwna');
            expect(sent.company.representatives[0].documents).to.deep.equal(representativeDocuments);
        });

        it('getSubEntityDetails reads them back', async () => {
            // The GET returns the variant schema (EEASoleTraderFull3-0), which carries no id.
            nock('https://123456789.api.sandbox.checkout.com')
                .get('/accounts/entities/ent_stuoyqyx4bsnsgfgair7hjdwna')
                .reply(200, { ...body, status: 'draft', is_draft: true });

            const entity = await checkout().platforms.getSubEntityDetails('ent_stuoyqyx4bsnsgfgair7hjdwna');

            expect(entity.company.representatives[0].documents).to.deep.equal(representativeDocuments);
            expect(entity.documents).to.deep.equal(body.documents);
        });

        it('onboardSubEntity sends an EEA Company Full (3.0) certified_authorised_signatory unchanged', async () => {
            const signatoryDocuments = {
                certified_authorised_signatory: { type: 'power_of_attorney', front: 'file_signatoryaaaaaaaaaaaaaaaaa' },
            };
            let sent;
            nock('https://123456789.api.sandbox.checkout.com')
                .post('/accounts/entities', (requestBody) => {
                    sent = requestBody;
                    return true;
                })
                .reply(201, { ...basicResponse, reference: 'ref_company' });

            await checkout().platforms.onboardSubEntity({
                reference: 'ref_company',
                company: {
                    business_type: 'limited_company',
                    representatives: [
                        {
                            individual: {
                                first_name: 'Jane',
                                last_name: 'Doe',
                                date_of_birth: { day: 5, month: 6, year: 1985 },
                                place_of_birth: { country: 'FR' },
                                address: { address_line1: '1 Rue de Rivoli', city: 'Paris', zip: '75001', country: 'FR' },
                            },
                            roles: ['authorised_signatory'],
                            documents: signatoryDocuments,
                        },
                    ],
                },
            });

            expect(sent.company.representatives[0].documents).to.deep.equal(signatoryDocuments);
        });
    });
});
