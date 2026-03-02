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
                    number: '2345678910',
                },
            },
            profile: {
                urls: ['https://www.ljnkjnnjjknk.com'],
                mccs: ['0742'],
            },
            company: {
                legal_name: 'Super Hero Masks Inc.',
                trading_name: 'Super Hero Masks',
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
                        first_name: 'John',
                        last_name: 'Doe',
                        address: {
                            address_line1: '90 Tottenham Court Road',
                            city: 'London',
                            zip: 'W1T4TJ',
                            country: 'GB',
                        },
                        identification: {
                            national_id_number: 'AB123456C',
                        },
                        phone: {
                            number: '2345678910',
                        },
                        date_of_birth: {
                            day: 5,
                            month: 6,
                            year: 1995,
                        },
                    },
                ],
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
                        number: '2345678910',
                    },
                },
                profile: {
                    urls: ['https://www.ljnkjnnjjknk.com'],
                    mccs: ['0742'],
                },
                company: {
                    legal_name: 'Super Hero Masks Inc.',
                    trading_name: 'Super Hero Masks',
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
                            first_name: 'John',
                            last_name: 'Doe',
                            address: {
                                address_line1: '90 Tottenham Court Road',
                                city: 'London',
                                zip: 'W1T4TJ',
                                country: 'GB',
                            },
                            identification: {
                                national_id_number: 'AB123456C',
                            },
                            phone: {
                                number: '2345678910',
                            },
                            date_of_birth: {
                                day: 5,
                                month: 6,
                                year: 1995,
                            },
                        },
                    ],
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
                        number: '2345678910',
                    },
                },
                profile: {
                    urls: ['https://www.ljnkjnnjjknk.com'],
                    mccs: ['0742'],
                },
                company: {
                    legal_name: 'Super Hero Masks Inc.',
                    trading_name: 'Super Hero Masks',
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
                            first_name: 'John',
                            last_name: 'Doe',
                            address: {
                                address_line1: '90 Tottenham Court Road',
                                city: 'London',
                                zip: 'W1T4TJ',
                                country: 'GB',
                            },
                            identification: {
                                national_id_number: 'AB123456C',
                            },
                            phone: {
                                number: '2345678910',
                            },
                            date_of_birth: {
                                day: 5,
                                month: 6,
                                year: 1995,
                            },
                        },
                    ],
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
                    number: '2345678910',
                },
            },
            profile: {
                urls: ['https://www.superheroexample.com'],
                mccs: ['0742'],
            },
            company: {
                business_registration_number: '45234960',
                legal_name: 'Super Hero Masks Inc.',
                trading_name: 'Super Hero Masks',
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
                        first_name: 'John',
                        last_name: 'Doe',
                        address: {
                            address_line1: '90 Tottenham Court Road',
                            city: 'London',
                            zip: 'W1T4TJ',
                            country: 'GB',
                        },
                        identification: {
                            national_id_number: 'AB123456C',
                        },
                        phone: {
                            number: '2345678910',
                        },
                        date_of_birth: {
                            day: 5,
                            month: 6,
                            year: 1995,
                        },
                    },
                ],
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
                            number: '2345678910',
                        },
                    },
                    profile: {
                        urls: ['https://www.superheroexample.com'],
                        mccs: ['0742'],
                    },
                    company: {
                        business_registration_number: '45234960',
                        legal_name: 'Super Hero Masks Inc.',
                        trading_name: 'Super Hero Masks',
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
                                first_name: 'John',
                                last_name: 'Doe',
                                address: {
                                    address_line1: '90 Tottenham Court Road',
                                    city: 'London',
                                    zip: 'W1T4TJ',
                                    country: 'GB',
                                },
                                identification: {
                                    national_id_number: 'AB123456C',
                                },
                                phone: {
                                    number: '2345678910',
                                },
                                date_of_birth: {
                                    day: 5,
                                    month: 6,
                                    year: 1995,
                                },
                            },
                        ],
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
});
