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
                settlement_country: 'GB',
                target_countries: ['GB'],
                annual_processing_volume: 1000000,
                average_transaction_value: 5000,
                highest_transaction_value: 25000,
                currency: 'GBP',
            },
            documents: {
                articles_of_association: { type: 'memorandum_of_association', front: 'file_t36nz7ji43bzv3dbs47l4xwhbz' },
                shareholder_structure: { type: 'certified_shareholder_structure', front: 'file_yhnp2tnoegp6zpjvdz7kelv3cd' },
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
                    settlement_country: 'GB',
                    target_countries: ['GB'],
                    annual_processing_volume: 1000000,
                    average_transaction_value: 5000,
                    highest_transaction_value: 25000,
                    currency: 'GBP',
                },
                documents: {
                    articles_of_association: { type: 'memorandum_of_association', front: 'file_t36nz7ji43bzv3dbs47l4xwhbz' },
                    shareholder_structure: { type: 'certified_shareholder_structure', front: 'file_yhnp2tnoegp6zpjvdz7kelv3cd' },
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
                    settlement_country: 'GB',
                    target_countries: ['GB'],
                    annual_processing_volume: 1000000,
                    average_transaction_value: 5000,
                    highest_transaction_value: 25000,
                    currency: 'GBP',
                },
                documents: {
                    articles_of_association: { type: 'memorandum_of_association', front: 'file_t36nz7ji43bzv3dbs47l4xwhbz' },
                    shareholder_structure: { type: 'certified_shareholder_structure', front: 'file_yhnp2tnoegp6zpjvdz7kelv3cd' },
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
                    representatives: [
                        {
                            id: 'rep_wkppgeabr3i46qrvrdjpizulk3',
                            first_name: 'John',
                            last_name: 'Doe',
                            date_of_birth: { day: 5, month: 6, year: 1995 },
                            phone: { number: '2345678910' },
                            address: {
                                address_line1: '90 Tottenham Court Road',
                                city: 'London',
                                zip: 'W1T4TJ',
                                country: 'GB',
                            },
                            roles: ['ubo', 'authorised_signatory'],
                        },
                    ],
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

        // The mock is the GB Company Full (2.0) shape: flat representative, phone without
        // country_code, and instruments.
        let details = await cko.platforms.getSubEntityDetails('ent_aneh5mtyobxzazriwuevngrz6y', '2.0');
        expect(details.id).to.equal('ent_aneh5mtyobxzazriwuevngrz6y');
        expect(details.company.representatives).to.deep.equal([
            {
                id: 'rep_wkppgeabr3i46qrvrdjpizulk3',
                first_name: 'John',
                last_name: 'Doe',
                date_of_birth: { day: 5, month: 6, year: 1995 },
                phone: { number: '2345678910' },
                address: {
                    address_line1: '90 Tottenham Court Road',
                    city: 'London',
                    zip: 'W1T4TJ',
                    country: 'GB',
                },
                roles: ['ubo', 'authorised_signatory'],
            },
        ]);
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
                settlement_country: 'GB',
                target_countries: ['GB'],
                annual_processing_volume: 1000000,
                average_transaction_value: 5000,
                highest_transaction_value: 25000,
                currency: 'GBP',
            },
            documents: {
                articles_of_association: { type: 'memorandum_of_association', front: 'file_t36nz7ji43bzv3dbs47l4xwhbz' },
                shareholder_structure: { type: 'certified_shareholder_structure', front: 'file_yhnp2tnoegp6zpjvdz7kelv3cd' },
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
                        settlement_country: 'GB',
                        target_countries: ['GB'],
                        annual_processing_volume: 1000000,
                        average_transaction_value: 5000,
                        highest_transaction_value: 25000,
                        currency: 'GBP',
                    },
                    documents: {
                        articles_of_association: { type: 'memorandum_of_association', front: 'file_t36nz7ji43bzv3dbs47l4xwhbz' },
                        shareholder_structure: { type: 'certified_shareholder_structure', front: 'file_yhnp2tnoegp6zpjvdz7kelv3cd' },
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
            .get('/accounts/entities/ent_ucyst27iadksa5ofou47yztzu5/members')
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

            await cko.platforms.getSubEntityMembers('ent_ucyst27iadksa5ofou47yztzu5');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get sub entity members', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_6besloljz4vdvhtykaqvjzphfl/members')
            .reply(200, {
                data: [
                    {
                        user_id: "usr_l3c7uzl5docy5zwxcelmcbxxzd",
                        email: "user@example.com"
                    }
                ]
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.platforms.getSubEntityMembers("ent_6besloljz4vdvhtykaqvjzphfl");

        expect(response).to.not.be.null;
        expect(response.data).to.be.an('array');
    });

    it('should reinvite sub entity member', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/accounts/entities/ent_6besloljz4vdvhtykaqvjzphfl/members/usr_l3c7uzl5docy5zwxcelmcbxxzd')
            .reply(200);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.platforms.reinviteSubEntityMember("ent_6besloljz4vdvhtykaqvjzphfl", "usr_l3c7uzl5docy5zwxcelmcbxxzd");

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

    describe('request and response payloads by variant', () => {
        // The SDK sends the body as given and returns the parsed JSON, so each body below must
        // reach the API, and each payload the caller, exactly as built.
        afterEach(() => nock.cleanAll());

        const host = 'https://123456789.api.sandbox.checkout.com';
        const cko = () => new Checkout(SK, { subdomain: '123456789' }).platforms;

        // POST returns the basic v3.0 response (EntityBasicResponseWithLinksV3).
        const basicResponse = {
            id: 'ent_6besloljz4vdvhtykaqvjzphfl',
            reference: 'ref_variant',
            requirements_due: [],
            _links: {
                self: { href: 'https://123456789.api.sandbox.checkout.com/accounts/entities/ent_6besloljz4vdvhtykaqvjzphfl' },
            },
        };

        it('onboardSubEntity sends the US ISV Seller Company (3.0) spec example unchanged', async () => {
            // components.schemas["USISVSellerCompany3-0"].example
            const example = {
                reference: 'isv-seller-example001',
                agreed_terms: {
                    date: '2026-07-02T10:30:00.0000000+00:00',
                    ip_address: '8.8.8.8',
                    name: 'Toby Arden',
                    email: 'toby.arden@example.com',
                    version: 'cko-platform-terms-1.0.0',
                },
                seller_category: 'cat_retail_001',
                processing_details: {
                    annual_processing_volume: 1000,
                    average_transaction_value: 2000,
                    average_order_fulfillment_time: 3,
                    target_countries: ['US'],
                    currency: 'USD',
                    payments: {
                        ach: {
                            annual_ach_volume: 100000,
                            average_ach_transaction_size: 5000,
                            estimated_monthly_credit_volume: 50000,
                            average_credit_amount: 2500,
                        },
                    },
                },
                contact_details: {
                    phone: {
                        number: '4155678900',
                        country_code: 'US',
                    },
                    email_addresses: {
                        primary: 'toby.arden@example.com',
                        pci_compliance_contact: 'pci.contact@example.com',
                    },
                },
                profile: {
                    urls: ['https://www.isv-seller-example.com'],
                    mccs: ['5551'],
                    holding_currencies: ['USD'],
                    default_holding_currency: 'USD',
                },
                company: {
                    business_registration_number: '12-3456789',
                    business_type: 'private_corporation',
                    legal_name: 'ISV Seller Example Inc',
                    trading_name: 'ISV Seller Example',
                    registered_address: {
                        address_line1: '123 Main Street',
                        city: 'San Francisco',
                        state: 'CA',
                        zip: '94105',
                        country: 'US',
                    },
                    principal_address: {
                        address_line1: '123 Main Street',
                        city: 'San Francisco',
                        state: 'CA',
                        zip: '94105',
                        country: 'US',
                    },
                    date_of_incorporation: {
                        year: 2025,
                        month: 10,
                        day: 1,
                    },
                    representatives: [
                        {
                            roles: ['ubo', 'control_person'],
                            ownership_percentage: 25,
                            company_position: 'ceo',
                            individual: {
                                first_name: 'Toby',
                                last_name: 'Arden',
                                email_address: 'toby.arden@example.com',
                                national_id_type: 'ssn',
                                national_id_number: '123456789',
                                date_of_birth: {
                                    day: 15,
                                    month: 1,
                                    year: 1990,
                                },
                                place_of_birth: {
                                    country: 'US',
                                },
                                citizenships: [
                                    {
                                        country: 'US',
                                    },
                                ],
                                phone: {
                                    country_code: 'US',
                                    number: '4155678901',
                                },
                                address: {
                                    address_line1: '123 Main Street',
                                    city: 'San Francisco',
                                    state: 'CA',
                                    zip: '94105',
                                    country: 'US',
                                },
                            },
                        },
                        {
                            roles: ['authorised_signatory'],
                            individual: {
                                first_name: 'Alex',
                                last_name: 'Morgan',
                                email_address: 'alex.morgan@example.com',
                                national_id_type: 'ssn',
                                national_id_number: '987654321',
                                date_of_birth: {
                                    day: 22,
                                    month: 6,
                                    year: 1985,
                                },
                                place_of_birth: {
                                    country: 'US',
                                },
                                citizenships: [
                                    {
                                        country: 'US',
                                    },
                                ],
                                phone: {
                                    country_code: 'US',
                                    number: '4155678902',
                                },
                                address: {
                                    address_line1: '123 Main Street',
                                    city: 'San Francisco',
                                    state: 'CA',
                                    zip: '94105',
                                    country: 'US',
                                },
                            },
                        },
                    ],
                },
            };
            let sent;
            nock(host)
                .matchHeader('accept', 'application/json;schema_version=3.0')
                .post('/accounts/entities', (requestBody) => {
                    sent = requestBody;
                    return true;
                })
                .reply(201, basicResponse);

            const response = await cko().onboardSubEntity(example);

            expect(response).to.deep.equal(basicResponse);
            expect(sent).to.deep.equal(example);
        });

        it('getSubEntityDetails returns the US ISV Seller Company (3.0) spec example unchanged', async () => {
            // components.schemas["USISVSellerCompany3-0"].example
            const example = {
                reference: 'isv-seller-example001',
                agreed_terms: {
                    date: '2026-07-02T10:30:00.0000000+00:00',
                    ip_address: '8.8.8.8',
                    name: 'Toby Arden',
                    email: 'toby.arden@example.com',
                    version: 'cko-platform-terms-1.0.0',
                },
                seller_category: 'cat_retail_001',
                processing_details: {
                    annual_processing_volume: 1000,
                    average_transaction_value: 2000,
                    average_order_fulfillment_time: 3,
                    target_countries: ['US'],
                    currency: 'USD',
                    payments: {
                        ach: {
                            annual_ach_volume: 100000,
                            average_ach_transaction_size: 5000,
                            estimated_monthly_credit_volume: 50000,
                            average_credit_amount: 2500,
                        },
                    },
                },
                contact_details: {
                    phone: {
                        number: '4155678900',
                        country_code: 'US',
                    },
                    email_addresses: {
                        primary: 'toby.arden@example.com',
                        pci_compliance_contact: 'pci.contact@example.com',
                    },
                },
                profile: {
                    urls: ['https://www.isv-seller-example.com'],
                    mccs: ['5551'],
                    holding_currencies: ['USD'],
                    default_holding_currency: 'USD',
                },
                company: {
                    business_registration_number: '12-3456789',
                    business_type: 'private_corporation',
                    legal_name: 'ISV Seller Example Inc',
                    trading_name: 'ISV Seller Example',
                    registered_address: {
                        address_line1: '123 Main Street',
                        city: 'San Francisco',
                        state: 'CA',
                        zip: '94105',
                        country: 'US',
                    },
                    principal_address: {
                        address_line1: '123 Main Street',
                        city: 'San Francisco',
                        state: 'CA',
                        zip: '94105',
                        country: 'US',
                    },
                    date_of_incorporation: {
                        year: 2025,
                        month: 10,
                        day: 1,
                    },
                    representatives: [
                        {
                            roles: ['ubo', 'control_person'],
                            ownership_percentage: 25,
                            company_position: 'ceo',
                            individual: {
                                first_name: 'Toby',
                                last_name: 'Arden',
                                email_address: 'toby.arden@example.com',
                                national_id_type: 'ssn',
                                national_id_number: '123456789',
                                date_of_birth: {
                                    day: 15,
                                    month: 1,
                                    year: 1990,
                                },
                                place_of_birth: {
                                    country: 'US',
                                },
                                citizenships: [
                                    {
                                        country: 'US',
                                    },
                                ],
                                phone: {
                                    country_code: 'US',
                                    number: '4155678901',
                                },
                                address: {
                                    address_line1: '123 Main Street',
                                    city: 'San Francisco',
                                    state: 'CA',
                                    zip: '94105',
                                    country: 'US',
                                },
                            },
                        },
                        {
                            roles: ['authorised_signatory'],
                            individual: {
                                first_name: 'Alex',
                                last_name: 'Morgan',
                                email_address: 'alex.morgan@example.com',
                                national_id_type: 'ssn',
                                national_id_number: '987654321',
                                date_of_birth: {
                                    day: 22,
                                    month: 6,
                                    year: 1985,
                                },
                                place_of_birth: {
                                    country: 'US',
                                },
                                citizenships: [
                                    {
                                        country: 'US',
                                    },
                                ],
                                phone: {
                                    country_code: 'US',
                                    number: '4155678902',
                                },
                                address: {
                                    address_line1: '123 Main Street',
                                    city: 'San Francisco',
                                    state: 'CA',
                                    zip: '94105',
                                    country: 'US',
                                },
                            },
                        },
                    ],
                },
            };
            nock(host)
                .get('/accounts/entities/ent_6besloljz4vdvhtykaqvjzphfl')
                .reply(200, example);

            const entity = await cko().getSubEntityDetails('ent_6besloljz4vdvhtykaqvjzphfl');

            expect(entity).to.deep.equal(example);
        });

        it('onboardSubEntity sends the US ISV Seller Sole Trader (3.0) spec example unchanged', async () => {
            // components.schemas["USISVSellerSoleTrader3-0"].example
            const example = {
                reference: 'isv-sole-trader-example001',
                agreed_terms: {
                    date: '2026-07-02T10:30:00.0000000+00:00',
                    ip_address: '8.8.8.8',
                    name: 'Hannah Bret',
                    email: 'hannah.bret@example.com',
                    version: 'cko-platform-terms-1.0.0',
                },
                seller_category: 'cat_retail_001',
                processing_details: {
                    annual_processing_volume: 1000,
                    average_transaction_value: 2000,
                    average_order_fulfillment_time: 3,
                    target_countries: ['US'],
                    currency: 'USD',
                    payments: {
                        ach: {
                            annual_ach_volume: 100000,
                            average_ach_transaction_size: 5000,
                            estimated_monthly_credit_volume: 50000,
                            average_credit_amount: 2500,
                        },
                    },
                },
                contact_details: {
                    phone: {
                        number: '4155678900',
                        country_code: 'US',
                    },
                    email_addresses: {
                        primary: 'hannah.bret@example.com',
                        pci_compliance_contact: 'pci.contact@example.com',
                    },
                },
                profile: {
                    urls: ['https://www.isv-sole-trader-example.com'],
                    mccs: ['5551'],
                    holding_currencies: ['USD'],
                    default_holding_currency: 'USD',
                },
                company: {
                    business_type: 'individual_or_sole_proprietorship',
                    is_registered_company: false,
                    trading_name: "Hannah's Goods",
                    date_of_incorporation: {
                        year: 2025,
                        month: 10,
                        day: 1,
                    },
                    principal_address: {
                        address_line1: '123 Main Street',
                        city: 'San Francisco',
                        state: 'CA',
                        zip: '94105',
                        country: 'US',
                    },
                    representatives: [
                        {
                            roles: ['ubo'],
                            ownership_percentage: 100,
                            individual: {
                                first_name: 'Hannah',
                                last_name: 'Bret',
                                email_address: 'hannah.bret@example.com',
                                national_id_type: 'ssn',
                                national_id_number: '123456789',
                                date_of_birth: {
                                    day: 15,
                                    month: 1,
                                    year: 1990,
                                },
                                place_of_birth: {
                                    country: 'US',
                                },
                                citizenships: [
                                    {
                                        country: 'US',
                                    },
                                ],
                                phone: {
                                    country_code: 'US',
                                    number: '4155678901',
                                },
                                address: {
                                    address_line1: '123 Main Street',
                                    city: 'San Francisco',
                                    state: 'CA',
                                    zip: '94105',
                                    country: 'US',
                                },
                            },
                        },
                    ],
                },
            };
            let sent;
            nock(host)
                .matchHeader('accept', 'application/json;schema_version=3.0')
                .post('/accounts/entities', (requestBody) => {
                    sent = requestBody;
                    return true;
                })
                .reply(201, basicResponse);

            await cko().onboardSubEntity(example);

            expect(sent).to.deep.equal(example);
            // The schema enum is [false]: it must go out as the boolean, not a string.
            expect(sent.company.is_registered_company).to.be.a('boolean');
            expect(sent.company.is_registered_company).to.equal(false);
        });

        it('getSubEntityDetails returns the US ISV Seller Sole Trader (3.0) spec example unchanged', async () => {
            // components.schemas["USISVSellerSoleTrader3-0"].example
            const example = {
                reference: 'isv-sole-trader-example001',
                agreed_terms: {
                    date: '2026-07-02T10:30:00.0000000+00:00',
                    ip_address: '8.8.8.8',
                    name: 'Hannah Bret',
                    email: 'hannah.bret@example.com',
                    version: 'cko-platform-terms-1.0.0',
                },
                seller_category: 'cat_retail_001',
                processing_details: {
                    annual_processing_volume: 1000,
                    average_transaction_value: 2000,
                    average_order_fulfillment_time: 3,
                    target_countries: ['US'],
                    currency: 'USD',
                    payments: {
                        ach: {
                            annual_ach_volume: 100000,
                            average_ach_transaction_size: 5000,
                            estimated_monthly_credit_volume: 50000,
                            average_credit_amount: 2500,
                        },
                    },
                },
                contact_details: {
                    phone: {
                        number: '4155678900',
                        country_code: 'US',
                    },
                    email_addresses: {
                        primary: 'hannah.bret@example.com',
                        pci_compliance_contact: 'pci.contact@example.com',
                    },
                },
                profile: {
                    urls: ['https://www.isv-sole-trader-example.com'],
                    mccs: ['5551'],
                    holding_currencies: ['USD'],
                    default_holding_currency: 'USD',
                },
                company: {
                    business_type: 'individual_or_sole_proprietorship',
                    is_registered_company: false,
                    trading_name: "Hannah's Goods",
                    date_of_incorporation: {
                        year: 2025,
                        month: 10,
                        day: 1,
                    },
                    principal_address: {
                        address_line1: '123 Main Street',
                        city: 'San Francisco',
                        state: 'CA',
                        zip: '94105',
                        country: 'US',
                    },
                    representatives: [
                        {
                            roles: ['ubo'],
                            ownership_percentage: 100,
                            individual: {
                                first_name: 'Hannah',
                                last_name: 'Bret',
                                email_address: 'hannah.bret@example.com',
                                national_id_type: 'ssn',
                                national_id_number: '123456789',
                                date_of_birth: {
                                    day: 15,
                                    month: 1,
                                    year: 1990,
                                },
                                place_of_birth: {
                                    country: 'US',
                                },
                                citizenships: [
                                    {
                                        country: 'US',
                                    },
                                ],
                                phone: {
                                    country_code: 'US',
                                    number: '4155678901',
                                },
                                address: {
                                    address_line1: '123 Main Street',
                                    city: 'San Francisco',
                                    state: 'CA',
                                    zip: '94105',
                                    country: 'US',
                                },
                            },
                        },
                    ],
                },
            };
            nock(host)
                .get('/accounts/entities/ent_6besloljz4vdvhtykaqvjzphfl')
                .reply(200, example);

            const entity = await cko().getSubEntityDetails('ent_6besloljz4vdvhtykaqvjzphfl');

            expect(entity).to.deep.equal(example);
            expect(entity.company.is_registered_company).to.equal(false);
        });

        it('onboardSubEntity sends an EEA Company Full (3.0) body unchanged', async () => {
            const body = {
                reference: 'ref_eea_company_full',
                contact_details: {
                    phone: { country_code: 'FR', number: '612345678' },
                    email_addresses: { primary: 'contact@example.fr' },
                    invitee: { email: 'admin@example.fr' },
                },
                profile: {
                    urls: ['https://www.example.fr'],
                    mccs: ['5311'],
                    default_holding_currency: 'EUR',
                    holding_currencies: ['EUR'],
                },
                company: {
                    legal_name: 'Exemple Commerce SAS',
                    trading_name: 'Exemple Commerce',
                    business_registration_number: '55210055400013',
                    business_type: 'limited_company',
                    date_of_incorporation: { day: 1, month: 6, year: 2015 },
                    regulatory_licence_number: 'FR-REG-123456',
                    principal_address: { address_line1: '1 Rue de Rivoli', city: 'Paris', zip: '75001', country: 'FR' },
                    registered_address: { address_line1: '1 Rue de Rivoli', city: 'Paris', zip: '75001', country: 'FR' },
                    representatives: [
                        {
                            id: 'rep_wkppgeabr3i46qrvrdjpizulk3',
                            individual: {
                                first_name: 'Jane',
                                middle_name: 'Ann',
                                last_name: 'Doe',
                                date_of_birth: { day: 12, month: 3, year: 1980 },
                                place_of_birth: { country: 'FR' },
                                national_id_number: '123456789',
                                email_address: 'jane.doe@example.fr',
                                phone: { country_code: 'FR', number: '612345679' },
                                address: { address_line1: '2 Rue de Rivoli', city: 'Paris', zip: '75001', country: 'FR' },
                            },
                            company_position: 'ceo',
                            roles: ['ubo', 'legal_representative'],
                            ownership_percentage: 60,
                            documents: {
                                identity_verification: {
                                    type: 'national_identity_card',
                                    front: 'file_s5u4n57kkf3eyfe5y6vxnvthck',
                                    back: 'file_bi64slm3y2v3qs3qftnrekqqw4',
                                },
                            },
                        },
                        {
                            // A controlling company: no individual and no roles.
                            id: 'rep_esjj6kaqqxdqmsns4qefcxbhlj',
                            company: {
                                legal_name: 'Exemple Holding SA',
                                trading_name: 'Exemple Holding',
                                registered_address: {
                                    address_line1: '10 Avenue Montaigne',
                                    city: 'Paris',
                                    zip: '75008',
                                    country: 'FR',
                                },
                            },
                            ownership_percentage: 40,
                        },
                    ],
                },
                processing_details: {
                    settlement_country: 'FR',
                    target_countries: ['FR', 'DE'],
                    annual_processing_volume: 1200000,
                    average_transaction_value: 4500,
                    highest_transaction_value: 20000,
                    currency: 'EUR',
                },
                documents: {
                    company_verification: { type: 'incorporation_document', front: 'file_27vqzjhtd2ap2gpykjrd5bxgo4' },
                    articles_of_association: { type: 'articles_of_association', front: 'file_mnkvzsardeg4sp6owggjthr4xj' },
                    bank_verification: { type: 'bank_statement', front: 'file_2g4m34fku63pddnd6as4x2br26' },
                    shareholder_structure: { type: 'certified_shareholder_structure', front: 'file_6tr5ssz3tzwrajclwxrkmjaebf' },
                    proof_of_legality: { type: 'proof_of_legality', front: 'file_r2rabl6bvocpmbclkwqkkco6lh' },
                    proof_of_principal_address: { type: 'proof_of_address', front: 'file_lzc67bgcdousw6tixlpuahfyv3' },
                    additional_document1: { front: 'file_3dy4xmqtnyiwe5c2ohk5xw67wr' },
                    additional_document2: { front: 'file_4eh3xvmx64r426p4nqwyq55p6s' },
                    additional_document3: { front: 'file_46a3d27iggvzpk4iz47zoxf5p4' },
                },
            };
            let sent;
            nock(host)
                .matchHeader('accept', 'application/json;schema_version=3.0')
                .post('/accounts/entities', (requestBody) => {
                    sent = requestBody;
                    return true;
                })
                .reply(201, { ...basicResponse, reference: 'ref_eea_company_full' });

            const response = await cko().onboardSubEntity(body);

            expect(response.reference).to.equal('ref_eea_company_full');
            expect(sent).to.deep.equal(body);
        });

        // POST on v2.0 also returns capabilities.
        const basicResponseV2 = {
            ...basicResponse,
            status: 'requirements_due',
            capabilities: {
                payments: { available: true, enabled: false },
                payouts: { available: true, enabled: false },
            },
        };

        it('onboardSubEntity sends a US Company Full (2.0) body unchanged with schema_version=2.0', async () => {
            const body = {
                reference: 'ref_us_company_full_v2',
                contact_details: {
                    phone: { number: '4155678900' },
                    email_addresses: { primary: 'jane.doe@example.com' },
                },
                profile: { urls: ['https://www.example.com'], mccs: ['5311'] },
                company: {
                    legal_name: 'Example Goods Inc',
                    trading_name: 'Example Goods',
                    business_registration_number: '123456789',
                    business_type: 'private_corporation',
                    date_of_incorporation: { day: 1, month: 10, year: 2015 },
                    principal_address: {
                        address_line1: '123 Main Street',
                        city: 'San Francisco',
                        state: 'CA',
                        zip: '94105',
                        country: 'US',
                    },
                    registered_address: {
                        address_line1: '123 Main Street',
                        city: 'San Francisco',
                        state: 'CA',
                        zip: '94105',
                        country: 'US',
                    },
                    representatives: [
                        {
                            // v2.0: person details sit directly on the representative.
                            first_name: 'Jane',
                            middle_name: 'Ann',
                            last_name: 'Doe',
                            date_of_birth: { day: 15, month: 1, year: 1990 },
                            phone: { number: '4155678901' },
                            address: {
                                address_line1: '123 Main Street',
                                city: 'San Francisco',
                                state: 'CA',
                                zip: '94105',
                                country: 'US',
                            },
                            identification: { national_id_number: '123456789' },
                            roles: ['ubo', 'control_person'],
                        },
                    ],
                    financial_details: {
                        annual_processing_volume: 1000000,
                        average_transaction_value: 5000,
                        highest_transaction_value: 25000,
                        currency: 'USD',
                    },
                },
                documents: {
                    company_verification: { type: 'articles_of_association', front: 'file_7fvobd6eavjz6zkfyvweaaltnu' },
                    tax_verification: { type: 'ein_letter', front: 'file_pwgioxhw7aelmfuzeavyukemlg' },
                },
            };
            let sent;
            nock(host)
                .matchHeader('accept', 'application/json;schema_version=2.0')
                .post('/accounts/entities', (requestBody) => {
                    sent = requestBody;
                    return true;
                })
                .reply(201, basicResponseV2);

            const response = await cko().onboardSubEntity(body, '2.0');

            expect(response).to.deep.equal(basicResponseV2);
            expect(sent).to.deep.equal(body);
        });

        it('onboardSubEntity sends an EEA Company Full (2.0) body unchanged with schema_version=2.0', async () => {
            const body = {
                reference: 'ref_eea_company_full_v2',
                contact_details: {
                    phone: { number: '33612345678' },
                    email_addresses: { primary: 'contact@example.fr' },
                },
                profile: { urls: ['https://www.example.fr'], mccs: ['5311'] },
                company: {
                    legal_name: 'Exemple Commerce SAS',
                    trading_name: 'Exemple Commerce',
                    business_registration_number: '55210055400013',
                    business_type: 'limited_company',
                    date_of_incorporation: { day: 1, month: 6, year: 2015 },
                    principal_address: { address_line1: '1 Rue de Rivoli', city: 'Paris', zip: '75001', country: 'FR' },
                    registered_address: { address_line1: '1 Rue de Rivoli', city: 'Paris', zip: '75001', country: 'FR' },
                    representatives: [
                        {
                            first_name: 'Jane',
                            last_name: 'Doe',
                            date_of_birth: { day: 12, month: 3, year: 1980 },
                            place_of_birth: { country: 'FR' },
                            address: { address_line1: '2 Rue de Rivoli', city: 'Paris', zip: '75001', country: 'FR' },
                            roles: ['ubo', 'legal_representative'],
                            documents: {
                                identity_verification: { type: 'passport', front: 'file_eybebhdsf76ezfjynstl45qicg' },
                            },
                        },
                    ],
                    financial_details: {
                        annual_processing_volume: 1200000,
                        average_transaction_value: 4500,
                        highest_transaction_value: 20000,
                        currency: 'EUR',
                    },
                },
                documents: {
                    company_verification: { type: 'incorporation_document', front: 'file_kximsgwemsu37pjw7omk2zqhho' },
                    bank_verification: { type: 'bank_statement', front: 'file_oxjciqnoiqpsx6owhm7tyapekg' },
                    financial_verification: { type: 'financial_statement', front: 'file_by7kc6uem2dqfniaja6jkbidfm' },
                },
            };
            let sent;
            nock(host)
                .matchHeader('accept', 'application/json;schema_version=2.0')
                .post('/accounts/entities', (requestBody) => {
                    sent = requestBody;
                    return true;
                })
                .reply(201, basicResponseV2);

            await cko().onboardSubEntity(body, '2.0');

            expect(sent).to.deep.equal(body);
        });

        it('onboardSubEntity sends a US Sole Trader Full (2.0) body unchanged with schema_version=2.0', async () => {
            const body = {
                reference: 'ref_us_sole_trader_full_v2',
                contact_details: {
                    phone: { number: '4155678900' },
                    email_addresses: { primary: 'jane.doe@example.com' },
                },
                profile: { urls: ['https://www.example.com'], mccs: ['5311'] },
                // v2.0 sole traders carry the person at the top level, not under company.
                individual: {
                    trading_name: 'Jane Doe Goods',
                    first_name: 'Jane',
                    middle_name: 'Ann',
                    last_name: 'Doe',
                    date_of_birth: { day: 15, month: 1, year: 1990 },
                    registered_address: {
                        address_line1: '123 Main Street',
                        city: 'San Francisco',
                        state: 'CA',
                        zip: '94105',
                        country: 'US',
                    },
                    identification: { national_id_number: '123456789' },
                    financial_details: {
                        annual_processing_volume: 100000,
                        average_transaction_value: 2000,
                        highest_transaction_value: 10000,
                        currency: 'USD',
                    },
                },
                documents: {
                    identity_verification: {
                        type: 'driving_license',
                        front: 'file_rzddj5rp3vlvz7io6v3e3yqpfy',
                        back: 'file_fvjj2mla6t5lyem33wlypxmjp4',
                    },
                },
            };
            let sent;
            nock(host)
                .matchHeader('accept', 'application/json;schema_version=2.0')
                .post('/accounts/entities', (requestBody) => {
                    sent = requestBody;
                    return true;
                })
                .reply(201, basicResponseV2);

            await cko().onboardSubEntity(body, '2.0');

            expect(sent).to.deep.equal(body);
        });

        it('onboardSubEntity sends every document type value unchanged', async () => {
            const front = 'file_totqefcktp5kobfedd5qhz63zp';
            // Every type value the spec declares, per document key. The first group sits on the
            // representative, the second at the top level.
            const representativeCases = [
                ['identity_verification', 'passport'],
                ['identity_verification', 'national_identity_card'],
                ['identity_verification', 'driving_license'],
                ['identity_verification', 'citizen_card'],
                ['identity_verification', 'residence_permit'],
                ['identity_verification', 'electoral_id'],
                ['certified_authorised_signatory', 'power_of_attorney'],
                ['proof_of_residential_address', 'proof_of_address'],
                ['proof_of_registration', 'extract_from_trade_register'],
                ['proof_of_registration', 'other'],
            ];
            const topLevelCases = [
                ['company_verification', 'incorporation_document'],
                // US Company Full and Lite (2.0) only.
                ['company_verification', 'articles_of_association'],
                ['articles_of_association', 'memorandum_of_association'],
                ['articles_of_association', 'articles_of_association'],
                ['bank_verification', 'bank_statement'],
                ['shareholder_structure', 'certified_shareholder_structure'],
                ['proof_of_legality', 'proof_of_legality'],
                ['proof_of_principal_address', 'proof_of_address'],
                ['tax_verification', 'ein_letter'],
                ['financial_verification', 'financial_statement'],
                ['financial_statements', 'financial_statements'],
            ];
            const sent = [];
            nock(host)
                .post('/accounts/entities', (requestBody) => {
                    sent.push(requestBody);
                    return true;
                })
                .times(representativeCases.length + topLevelCases.length)
                .reply(201, basicResponse);

            for (const [key, type] of representativeCases) {
                await cko().onboardSubEntity({
                    reference: 'ref_document_types',
                    company: {
                        representatives: [{ roles: ['ubo'], documents: { [key]: { type, front } } }],
                    },
                });
            }
            for (const [key, type] of topLevelCases) {
                await cko().onboardSubEntity({ reference: 'ref_document_types', documents: { [key]: { type, front } } });
            }

            expect(sent).to.have.length(representativeCases.length + topLevelCases.length);
            representativeCases.forEach(([key, type], i) => {
                expect(sent[i].company.representatives[0].documents).to.deep.equal({ [key]: { type, front } });
            });
            topLevelCases.forEach(([key, type], i) => {
                expect(sent[representativeCases.length + i].documents).to.deep.equal({ [key]: { type, front } });
            });
        });
    });
});
