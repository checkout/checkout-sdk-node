import {
    BadGateway,
    TooManyRequestsError,
    ValidationError,
    ValueError,
    AuthenticationError,
    NotFoundError,
    ActionNotAllowed,
    UrlAlreadyRegistered,
} from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';
import fs from 'fs';

describe('Marketplace', () => {
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
                id: 'file_zna32sccqbwevd3ldmejtplbhu',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/files/file_zna32sccqbwevd3ldmejtplbhu',
                    },
                },
            });
        let cko = new Checkout(
            'gRzsnKmjjRpmBkrSXVPNibIfQzhSRBWz528ROoJ79Pcg0OddTYZzdOJeK0f9dcH7e6m9A5jdZ-kDwgKte9MYcg',
            {
                client: 'ack_o5vwqjcjlfdufjplxhgiri2dnq',
                scope: ['marketplace'],
                environment: 'sandbox',
            }
        );

        const file = await cko.marketplace.uploadFile(
            'identification',
            fs.createReadStream('./test/marketplace/evidence.jpg')
        );
    }).timeout(120000);

    it('should upload file from remote', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        nock('https://files.sandbox.checkout.com')
            .post(/.*/)
            .reply(201, {
                id: 'file_zna32sccqbwevd3ldmejtplbhu',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/files/file_zna32sccqbwevd3ldmejtplbhu',
                    },
                },
            });
        let cko = new Checkout(
            'gRzsnKmjjRpmBkrSXVPNibIfQzhSRBWz528ROoJ79Pcg0OddTYZzdOJeK0f9dcH7e6m9A5jdZ-kDwgKte9MYcg',
            {
                client: 'ack_o5vwqjcjlfdufjplxhgiri2dnq',
                scope: ['marketplace'],
                environment: 'sandbox',
            }
        );

        const file = await cko.marketplace.uploadFile(
            'identification',
            'https://media.ethicalads.io/media/images/2020/12/ethicalads_2.jpg'
        );
    }).timeout(120000);

    it('should throw AuthenticationError when uploading file', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://files.sandbox.checkout.com').post(/.*/).reply(401);
        let cko = new Checkout(
            'gRzsnKmjjRpmBkrSXVPNibIfQzhSRBWz528ROoJ79Pcg0OddTYZzdOJeK0f9dcH7e6m9A5jdZ-kDwgKte9MYcg',
            {
                client: 'ack_o5vwqjcjlfdufjplxhgiri2dnq',
                scope: ['marketplace'],
                environment: 'sandbox',
            }
        );
        try {
            const file = await cko.marketplace.uploadFile(
                'identification',
                fs.createReadStream('./test/marketplace/evidence.jpg')
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
            .post('/marketplace/entities')
            .reply(201, {
                id: 'ent_aneh5mtyobxzazriwuevngrz6y',
                reference: 'superhero1234',
                status: 'pending',
                capabilities: { payments: { enabled: false }, payouts: { enabled: false } },
                requirements_due: [],
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/marketplace/entities/ent_aneh5mtyobxzazriwuevngrz6y',
                    },
                },
            });
        let cko = new Checkout(
            'gRzsnKmjjRpmBkrSXVPNibIfQzhSRBWz528ROoJ79Pcg0OddTYZzdOJeK0f9dcH7e6m9A5jdZ-kDwgKte9MYcg',
            {
                client: 'ack_o5vwqjcjlfdufjplxhgiri2dnq',
                scope: ['marketplace'],
                environment: 'sandbox',
            }
        );
        let marketplace = await cko.marketplace.onboardSubEntity({
            reference: 'superhero1234',
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
                business_registration_number: '452349600005',
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
        expect(marketplace.status).to.equal('pending');
    });

    it('should throw AuthenticationError when onboarding sub-entity', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com').post('/marketplace/entities').reply(401);
        let cko = new Checkout(
            'gRzsnKmjjRpmBkrSXVPNibIfQzhSRBWz528ROoJ79Pcg0OddTYZzdOJeK0f9dcH7e6m9A5jdZ-kDwgKte9MYcg',
            {
                client: 'ack_o5vwqjcjlfdufjplxhgiri2dnq',
                scope: ['marketplace'],
                environment: 'sandbox',
            }
        );
        try {
            let marketplace = await cko.marketplace.onboardSubEntity({
                reference: 'superhero1234',
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
                    business_registration_number: '452349600005',
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

    it('should get sub-entity details', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/marketplace/entities/ent_aneh5mtyobxzazriwuevngrz6y')
            .reply(201, {
                id: 'ent_aneh5mtyobxzazriwuevngrz6y',
                reference: 'superhero1234',
                status: 'active',
                capabilities: { payments: { enabled: true }, payouts: { enabled: true } },
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
                        href: 'https://api.sandbox.checkout.com/marketplace/entities/ent_aneh5mtyobxzazriwuevngrz6y',
                    },
                },
            });
        let cko = new Checkout(
            'gRzsnKmjjRpmBkrSXVPNibIfQzhSRBWz528ROoJ79Pcg0OddTYZzdOJeK0f9dcH7e6m9A5jdZ-kDwgKte9MYcg',
            {
                client: 'ack_o5vwqjcjlfdufjplxhgiri2dnq',
                scope: ['marketplace'],
                environment: 'sandbox',
            }
        );
        let marketplace = await cko.marketplace.getSubEntityDetails(
            'ent_aneh5mtyobxzazriwuevngrz6y'
        );
        console.log(marketplace);
        expect(marketplace.reference).to.equal('superhero1234');
    });

    it('should throw AuthenticationError when getting sub-entity details', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/marketplace/entities/ent_aneh5mtyobxzazriwuevngrz6y')
            .reply(401);
        let cko = new Checkout(
            'gRzsnKmjjRpmBkrSXVPNibIfQzhSRBWz528ROoJ79Pcg0OddTYZzdOJeK0f9dcH7e6m9A5jdZ-kDwgKte9MYcg',
            {
                client: 'ack_o5vwqjcjlfdufjplxhgiri2dnq',
                scope: ['marketplace'],
                environment: 'sandbox',
            }
        );
        try {
            let marketplace = await cko.marketplace.getSubEntityDetails(
                'ent_aneh5mtyobxzazriwuevngrz6y'
            );
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
            .put('/marketplace/entities/ent_aneh5mtyobxzazriwuevngrz6y')
            .reply(201, {
                id: 'ent_aneh5mtyobxzazriwuevngrz6y',
                reference: 'superhero1234',
                status: 'pending',
                capabilities: { payments: { enabled: false }, payouts: { enabled: false } },
                requirements_due: [],
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/marketplace/entities/ent_aneh5mtyobxzazriwuevngrz6y',
                    },
                },
            });
        let cko = new Checkout(
            'gRzsnKmjjRpmBkrSXVPNibIfQzhSRBWz528ROoJ79Pcg0OddTYZzdOJeK0f9dcH7e6m9A5jdZ-kDwgKte9MYcg',
            {
                client: 'ack_o5vwqjcjlfdufjplxhgiri2dnq',
                scope: ['marketplace'],
                environment: 'sandbox',
            }
        );
        try {
            let marketplace = await cko.marketplace.updateSubEntityDetails(
                'ent_aneh5mtyobxzazriwuevngrz6y',
                {
                    reference: 'superhero12346',
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
                        business_registration_number: '452349600005',
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
            expect(marketplace.id).to.equal('ent_aneh5mtyobxzazriwuevngrz6y');
        } catch (error) {
            console.log(error);
        }
    });

    it('should throw AuthenticationError when updating sub-entity details', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .put('/marketplace/entities/ent_aneh5mtyobxzazriwuevngrz6y')
            .reply(401);
        let cko = new Checkout(
            'gRzsnKmjjRpmBkrSXVPNibIfQzhSRBWz528ROoJ79Pcg0OddTYZzdOJeK0f9dcH7e6m9A5jdZ-kDwgKte9MYcg',
            {
                client: 'ack_o5vwqjcjlfdufjplxhgiri2dnq',
                scope: ['marketplace'],
                environment: 'sandbox',
            }
        );
        try {
            let marketplace = await cko.marketplace.updateSubEntityDetails(
                'ent_aneh5mtyobxzazriwuevngrz6y',
                {
                    reference: 'superhero12346',
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
                        business_registration_number: '452349600005',
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

    it('should add a payment instrument', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/marketplace/entities/ent_aneh5mtyobxzazriwuevngrz6y/instruments')
            .reply(202, {});
        let cko = new Checkout(
            'gRzsnKmjjRpmBkrSXVPNibIfQzhSRBWz528ROoJ79Pcg0OddTYZzdOJeK0f9dcH7e6m9A5jdZ-kDwgKte9MYcg',
            {
                client: 'ack_o5vwqjcjlfdufjplxhgiri2dnq',
                scope: ['marketplace'],
                environment: 'sandbox',
            }
        );

        let marketplace = await cko.marketplace.addPaymentInstrument(
            'ent_aneh5mtyobxzazriwuevngrz6y',
            {
                label: "Peter's Personal Account",
                type: 'bank_account',
                account_number: '12345678',
                bank_code: '050389',
                currency: 'GBP',
                country: 'GB',
                account_holder: {
                    first_name: 'Peter',
                    last_name: 'Parker',
                    billing_address: {
                        address_line1: '90 Tottenham Court Road',
                        city: 'London',
                        state: 'London',
                        zip: 'W1T 4TJ',
                        country: 'GB',
                    },
                },
                document: {
                    type: 'bank_statement',
                    file_id: 'file_wxglze3wwywujg4nna5fb7ldli',
                },
            }
        );
    });

    it('should throw AuthenticationError when adding a payment instrument', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/marketplace/entities/ent_aneh5mtyobxzazriwuevngrz6y/instruments')
            .reply(401);
        let cko = new Checkout(
            'gRzsnKmjjRpmBkrSXVPNibIfQzhSRBWz528ROoJ79Pcg0OddTYZzdOJeK0f9dcH7e6m9A5jdZ-kDwgKte9MYcg',
            {
                client: 'ack_o5vwqjcjlfdufjplxhgiri2dnq',
                scope: ['marketplace'],
                environment: 'sandbox',
            }
        );
        try {
            let marketplace = await cko.marketplace.addPaymentInstrument(
                'ent_aneh5mtyobxzazriwuevngrz6y',
                {
                    label: "Peter's Personal Account",
                    type: 'bank_account',
                    account_number: '12345678',
                    bank_code: '050389',
                    currency: 'GBP',
                    country: 'GB',
                    account_holder: {
                        first_name: 'Peter',
                        last_name: 'Parker',
                        billing_address: {
                            address_line1: '90 Tottenham Court Road',
                            city: 'London',
                            state: 'London',
                            zip: 'W1T 4TJ',
                            country: 'GB',
                        },
                    },
                    document: {
                        type: 'bank_statement',
                        file_id: 'file_wxglze3wwywujg4nna5fb7ldli',
                    },
                }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
