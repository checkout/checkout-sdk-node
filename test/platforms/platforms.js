import { AuthenticationError, UrlAlreadyRegistered, } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';
import fs from 'fs';

const platforms_ack = 'ack_i72u2oo3ry3uhiczwxkutelffq';
const platforms_secret =
    'Tlc9Un7iHa8IJq-rM7yzZYP7Bmm2iCDKXBzFRhGGLTUsNIm0KVqyngyiF_zR9g-B47RDJhbTuPYqSi-KqApIhA';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Platforms', () => {
    it('should upload file', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        nock('https://files.sandbox.checkout.com')
            .post(/.*/)
            .reply(201, {
                id: 'file_awonj5x6qhhreojffryekdy65a',
                _links: {
                    self: {
                        href: 'https://files.sandbox.checkout.com/files/file_awonj5x6qhhreojffryekdy65a',
                    },
                },
            });
        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['files'],
            environment: 'sandbox',
        });

        const file = await cko.platforms.uploadFile(
            'identification',
            fs.createReadStream('./test/platforms/evidence.jpg')
        );

        expect(file.id).to.equal('file_awonj5x6qhhreojffryekdy65a');
    }).timeout(120000);

    it('should throw AuthenticationError when uploading file', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://files.sandbox.checkout.com').post(/.*/).reply(401);

        try {
            let cko = new Checkout('platforms_secret', {
                client: platforms_ack,
                scope: ['files'],
                environment: 'sandbox',
            });

            const file = await cko.platforms.uploadFile(
                'identification',
                fs.createReadStream('./test/platforms/evidence.jpg')
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should Onboard a sub-entity', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
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
                        href: 'https://api.sandbox.checkout.com/accounts/entities/ent_stuoyqyx4bsnsgfgair7hjdwna',
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/accounts/entities')
            .reply(409, {
                id: 'ent_stuoyqyx4bsnsgfgair7hjdwna',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/accounts/entities/ent_stuoyqyx4bsnsgfgair7hjdwna',
                    },
                },
            });

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com').post('/accounts/entities').reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
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

    it('should get payment instrument details', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
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
        });
        let instrument = await cko.platforms.getPaymentInstrumentDetails(
            'ent_aneh5mtyobxzazriwuevngrz6y',
            'ppi_c475pnoq2hkojdimoutaszcasa'
        );
        expect(instrument.id).to.equal('ppi_c475pnoq2hkojdimoutaszcasa');
    });

    it('should throw Auth errot geting payment instrument details', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get(
                '/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments/ppi_c475pnoq2hkojdimoutaszcasa'
            )
            .reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
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

    it('should upload a file', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/files')
            .reply(200, {
                "id": "file_6lbss42ezvoufcb2beo76rvwly",
                "maximum_size_in_bytes": 4194304,
                "document_types_for_purpose": [
                    "image/jpeg",
                    "image/png",
                    "image/jpg"
                ],
                "_links": {
                    "upload": {
                        "href": null
                    },
                    "self": {
                        "href": "https://files.checkout.com/files/file_6lbss42ezvoufcb2beo76rvwly"
                    }
                }
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
        });
        let platform = await cko.platforms.uploadAFile('ent_aneh5mtyobxzazriwuevngrz6y', {
            purpose: "bank_verification"
        });
        expect(platform.id).to.equal('file_6lbss42ezvoufcb2beo76rvwly');
        expect(platform.maximum_size_in_bytes).to.equal(4194304);
    });

    it('should retrieve a file', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/files/file_6lbss42ezvoufcb2beo76rvwly')
            .reply(200, {
                "id": "file_6lbss42ezvoufcb2beo76rvwly",
                "status": "invalid",
                "status_reasons": [
                    "InvalidMimeType"
                ],
                "size": 1024,
                "mime_type": "application/pdf",
                "uploaded_on": "2020-12-01T15:01:01Z",
                "purpose": "identity_verification",
                "_links": {
                    "download": {
                        "href": "https://s3.eu-west-1.amazonaws.com/mp-files-api-clean-prod/ent_ociwguf5a5fe3ndmpnvpnwsi3e/file_6lbss42ezvoufcb2beo76rvwly?X-Amz-Expires=3600&x-amz-security-token=some_token"
                    },
                    "self": {
                        "href": "https://files.checkout.com/files/file_6lbss42ezvoufcb2beo76rvwly"
                    }
                }
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
        });

        let file = await cko.platforms.retrieveAFile('ent_aneh5mtyobxzazriwuevngrz6y', 'file_6lbss42ezvoufcb2beo76rvwly');
        expect(file.id).to.equal('file_6lbss42ezvoufcb2beo76rvwly');
        expect(file.status).to.equal('invalid');
        expect(file.size).to.equal(1024);
        expect(file.mime_type).to.equal('application/pdf');
        expect(file.purpose).to.equal('identity_verification');
    });

    it('should get a sub-entity members', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
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
        });

        let response = await cko.platforms.getSubEntityMembers('ent_aneh5mtyobxzazriwuevngrz6y');
        expect(response.data[0].user_id).to.equal('usr_eyk754cqieqexfh6u46no5nnha');
    });

    it('should reinvite a sub-entity member', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .put('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/members/usr_eyk754cqieqexfh6u46no5nnha')
            .reply(200, {
                "id": "usr_eyk754cqieqexfh6u46no5nnha"
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
        });

        let member = await cko.platforms.reinviteSubEntityMember(
            'ent_aneh5mtyobxzazriwuevngrz6y',
            'usr_eyk754cqieqexfh6u46no5nnha',
            {});

        expect(member.id).to.equal('usr_eyk754cqieqexfh6u46no5nnha');
    });

    it('should get sub-entity details', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
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
                        href: 'https://api.sandbox.checkout.com/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y',
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
        });

        let details = await cko.platforms.getSubEntityDetails('ent_aneh5mtyobxzazriwuevngrz6y');
        expect(details.id).to.equal('ent_aneh5mtyobxzazriwuevngrz6y');
    });

    it('should throw auth error getting sub-entity details', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y')
            .reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            });

            let details = await cko.platforms.getSubEntityDetails('ent_aneh5mtyobxzazriwuevngrz6y');
            expect(details.id).to.equal('ent_aneh5mtyobxzazriwuevngrz6y');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should update sub-entity details', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
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
                        href: 'https://api.sandbox.checkout.com/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y',
                    },
                },
            });
        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .put('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y')
            .reply(401);
        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
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

    it('should update a payment instrument details', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .patch('/accounts/entities/ent_wxglze3wwywujg4nna5fb7ldli/payment-instruments/ppi_qn4nis4k3ykpzzu7cvtuvhqqga')
            .reply(200, {
                id: 'ppi_qn4nis4k3ykpzzu7cvtuvhqqga',
                _links: {
                    self: {
                        href: 'https://api.checkout.com/accounts/entities/ent_wxglze3wwywujg4nna5fb7ldli',
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .patch('/accounts/entities/ent_wxglze3wwywujg4nna5fb7ldli/payment-instruments/ppi_qn4nis4k3ykpzzu7cvtuvhqqga')
            .reply(401);
        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/instruments')
            .reply(401);
        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments')
            .reply(401);
        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
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
        });

        let instrument = await cko.platforms.queryPaymentInstruments(
            'ent_aneh5mtyobxzazriwuevngrz6y',
            'verified'
        );

        expect(instrument.data[0].entity_id).to.equal('ent_aneh5mtyobxzazriwuevngrz6y');
    });

    it('should throw auth error when you query payment instruments', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get(
                '/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payment-instruments?status=verified'
            )
            .reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            });

            let instrument = await cko.platforms.queryPaymentInstruments(
                'ent_aneh5mtyobxzazriwuevngrz6y',
                'verified'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should update a sub-entity payout schedule', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .put('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payout-schedules')
            .reply(201, {
                _links: {
                    self: {
                        href: 'https://api.checkout.com/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y',
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .put('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payout-schedules')
            .reply(401);

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
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
                            href: 'https://api.checkout.com/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y',
                        },
                    },
                },
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
        });

        let instrument = await cko.platforms.retrieveSubEntityPayoutSchedule(
            'ent_aneh5mtyobxzazriwuevngrz6y'
        );
    });

    it('should throw auth error when you retrieve a sub-entity payout schedule', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/accounts/entities/ent_aneh5mtyobxzazriwuevngrz6y/payout-schedules')
            .reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            });

            let instrument = await cko.platforms.retrieveSubEntityPayoutSchedule(
                'ent_aneh5mtyobxzazriwuevngrz6y'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get reserve rule details', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        const entityId = 'ent_aneh5mtyobxzazriwuevngrz6y';
        const reserveRuleId = 'rsv_qn4nis4k3ykpzzu7cvtuvhqqga';

        nock('https://api.sandbox.checkout.com')
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
            environment: 'sandbox'
        });

        const response = await cko.platforms.getReserveRuleDetails(entityId, reserveRuleId);

        expect(response.id).to.equal(reserveRuleId);
        expect(response.rolling.percentage).to.equal(10);
    });

    it('should update a reserve rule', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        const entityId = 'ent_aneh5mtyobxzazriwuevngrz6y';
        const reserveRuleId = 'rsv_qn4nis4k3ykpzzu7cvtuvhqqga';

        nock('https://api.sandbox.checkout.com')
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
            environment: 'sandbox'
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        const entityId = 'ent_aneh5mtyobxzazriwuevngrz6y';
        const reserveRuleId = 'rsv_qn4nis4k3ykpzzu7cvtuvhqqga';

        nock('https://api.sandbox.checkout.com')
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
            environment: 'sandbox'
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
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        const entityId = 'ent_aneh5mtyobxzazriwuevngrz6y';
        const reserveRuleId = 'rsv_qn4nis4k3ykpzzu7cvtuvhqqga';

        nock('https://api.sandbox.checkout.com')
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
            environment: 'sandbox'
        });

        const response = await cko.platforms.queryReserveRules(entityId);

        expect(response.data).to.be.an('array');
        expect(response.data[0].id).to.equal(reserveRuleId);
        expect(response.data[0].rolling.percentage).to.equal(10);
    });

    it('should throw AuthenticationError when updating a reserve rule', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        const entityId = 'ent_aneh5mtyobxzazriwuevngrz6y';
        const reserveRuleId = 'rsv_qn4nis4k3ykpzzu7cvtuvhqqga';

        nock('https://api.sandbox.checkout.com')
            .put(`/accounts/entities/${entityId}/reserve-rules/${reserveRuleId}`)
            .reply(401);

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox'
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
});
