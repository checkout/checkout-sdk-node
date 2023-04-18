import nock from "nock";
import {Checkout} from "../../src";
import {expect} from "chai";
import { AuthenticationError, NotFoundError, ValidationError } from "../../src/services/errors";

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Unit::Issuing', () => {
    describe('Cardholder', () => {
        it('should create a cardholder', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/cardholders')
                .reply(200, {
                    id: 'crh_d3ozhf43pcq2xbldn2g45qnb44',
                    type: "individual",
                    status: "active",
                    reference: "X-123456-N11",
                    created_date: "string",
                    last_modified_date: "2019-09-10T10:11:12Z",
                    _links: {
                        self: {
                            href: "https://api.checkout.com/issuing/cardholders/crh_d3ozhf43pcq2xbldn2g45qnb44"
                        },
                        cards: {
                            href: "https://api.checkout.com/issuing/cards"
                        }
                    }
                });

            const cko = new Checkout(SK);

            const cardholderResponse = await cko.issuing.createCardholder({
                type: "individual",
                reference: "X-123456-N11",
                entity_id: "ent_fa6psq242dcd6fdn5gifcq1491",
                first_name: "John",
                middle_name: "Fitzgerald",
                last_name: "Kennedy",
                email: "john.kennedy@myemaildomain.com",
                phone_number: {
                    country_code: "+1",
                    number: "415 555 2671"
                },
                date_of_birth: "1985-05-15",
                billing_address: {
                    address_line1: "Checkout.com",
                    address_line2: "90 Tottenham Court Road",
                    city: "London",
                    state: "London",
                    zip: "W1T 4TJ",
                    country: "GB"
                },
                residency_address: {
                    address_line1: "Checkout.com",
                    address_line2: "90 Tottenham Court Road",
                    city: "London",
                    state: "London",
                    zip: "W1T 4TJ",
                    country: "GB"
                },
                document: {
                    type: "national_identity_card",
                    front_document_id: "file_6lbss42ezvoufcb2beo76rvwly",
                    back_document_id: "file_aaz5pemp6326zbuvevp6qroqu4"
                }
            });

            expect(cardholderResponse.id).to.equal("crh_d3ozhf43pcq2xbldn2g45qnb44")
            expect(cardholderResponse.type).to.equal("individual")
            expect(cardholderResponse.status).to.equal("active")
        });

        it('should throw when creating a cardholder', async () => {
            nock('https://api.sandbox.checkout.com').post('/issuing/cardholders').reply(401);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.createCardholder({
                    type: "individual",
                    reference: "X-123456-N11",
                    entity_id: "ent_fa6psq242dcd6fdn5gifcq1491",
                    first_name: "John",
                    middle_name: "Fitzgerald",
                    last_name: "Kennedy",
                    email: "john.kennedy@myemaildomain.com",
                    phone_number: {
                        country_code: "+1",
                        number: "415 555 2671"
                    },
                    date_of_birth: "1985-05-15",
                    billing_address: {
                        address_line1: "Checkout.com",
                        address_line2: "90 Tottenham Court Road",
                        city: "London",
                        state: "London",
                        zip: "W1T 4TJ",
                        country: "GB"
                    },
                    residency_address: {
                        address_line1: "Checkout.com",
                        address_line2: "90 Tottenham Court Road",
                        city: "London",
                        state: "London",
                        zip: "W1T 4TJ",
                        country: "GB"
                    },
                    document: {
                        type: "national_identity_card",
                        front_document_id: "file_6lbss42ezvoufcb2beo76rvwly",
                        back_document_id: "file_aaz5pemp6326zbuvevp6qroqu4"
                    }
                });
            } catch (err) {
                expect(err).to.be.instanceOf(AuthenticationError);
            }
        });

        it('should get a cardholder', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/cardholders/crh_d3ozhf43pcq2xbldn2g45qnb44')
                .reply(200, {
                    id: "crh_d3ozhf43pcq2xbldn2g45qnb44",
                    type: "individual",
                    first_name: "John",
                    middle_name: "Fitzgerald",
                    last_name: "Kennedy",
                    email: "john.kennedy@myemaildomain.com",
                    phone_number: {
                        country_code: "+1",
                        number: "415 555 2671"
                    },
                    date_of_birth: "1985-05-28",
                    billing_address: {
                        address_line1: "Checkout.com",
                        address_line2: "90 Tottenham Court Road",
                        city: "London",
                        state: "London",
                        zip: "W1T 4TJ",
                        country: "GB"
                    },
                    residency_address: {
                        address_line1: "Checkout.com",
                        address_line2: "90 Tottenham Court Road",
                        city: "London",
                        state: "London",
                        zip: "W1T 4TJ",
                        country: "GB"
                    },
                    reference: "X-123456-N11",
                    account_entity_id: "ent_fa6psq242dcd6fdn5gifcq1491",
                    parent_sub_entity_id: "ent_fa6psq242dcd6fdn5gifcq1491",
                    entity_id: "ent_fa6psq242dcd6fdn5gifcq1491",
                    created_date: "2019-09-10T10:11:12Z",
                    last_modified_date: "2019-09-11T10:11:12Z",
                    _links: {
                        self: {
                            href: "https://api.checkout.com/issuing/cardholders/crh_d3ozhf43pcq2xbldn2g45qnb44"
                        },
                        cards: {
                            href: "https://api.checkout.com/issuing/cards"
                        }
                    }
                });

            const cko = new Checkout(SK);

            const cardholderResponse = await cko.issuing.getCardholder('crh_d3ozhf43pcq2xbldn2g45qnb44');

            expect(cardholderResponse.id).to.equal("crh_d3ozhf43pcq2xbldn2g45qnb44");
            expect(cardholderResponse.type).to.equal("individual")
            expect(cardholderResponse.first_name).to.equal("John")
            expect(cardholderResponse.last_name).to.equal("Kennedy")
        });

        it('should throw when getting a cardholder', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/cardholders/not_found')
                .reply(404);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.getCardholder('not_found');
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should get a cardholder cards', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/cardholders/crh_d3ozhf43pcq2xbldn2g45qnb44/cards')
                .reply(200, {
                    cards: [
                        {
                            id: "crd_fa6psq242dcd6fdn5gifcq1491",
                            cardholder_id: "crh_d3ozhf43pcq2xbldn2g45qnb44",
                            card_product_id: "pro_7syjig3jq3mezlc3vjrdpfitl4",
                            client_id: "cli_vkuhvk4vjn2edkps7dfsq6emqm",
                            last_four: 1234,
                            expiry_month: 5,
                            expiry_year: 2025,
                            status: "active",
                            display_name: "JOHN KENNEDY",
                            type: "virtual",
                            billing_currency: "USD",
                            issuing_country: "US",
                            reference: "X-123456-N11",
                            created_date: "2021-09-09T19:41:39Z",
                            last_modified_date: "2021-09-09T19:41:39Z"
                        }
                    ]
                });

            const cko = new Checkout(SK);

            const cardholderResponse = await cko.issuing.getCardholderCards('crh_d3ozhf43pcq2xbldn2g45qnb44');

            expect(cardholderResponse.cards[0].id).to.equal("crd_fa6psq242dcd6fdn5gifcq1491");
            expect(cardholderResponse.cards[0].cardholder_id).to.equal("crh_d3ozhf43pcq2xbldn2g45qnb44");
            expect(cardholderResponse.cards[0].card_product_id).to.equal("pro_7syjig3jq3mezlc3vjrdpfitl4")
            expect(cardholderResponse.cards[0].client_id).to.equal("cli_vkuhvk4vjn2edkps7dfsq6emqm")
            expect(cardholderResponse.cards[0].status).to.equal("active")
        });

        it('should throw when getting a cardholder cards', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/cardholders/not_found/cards')
                .reply(404);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.getCardholderCards('not_found');
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });
    });

    describe('Cards', () => {
        it('should create card', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/cards')
                .reply(201, {
                    id: "crd_fa6psq242dcd6fdn5gifcq1491",
                    display_name: "JOHN KENNEDY",
                    last_four: 1234,
                    expiry_month: 5,
                    expiry_year: 2025,
                    billing_currency: "USD",
                    issuing_country: "US",
                    reference: "X-123456-N11",
                    created_date: "2019-09-10T10:11:12Z",
                    _links: {
                        self: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                        },
                        credentials: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/credentials"
                        },
                        revoke: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/revoke"
                        }
                    }
                })

            const cko = new Checkout(SK);

            const cardResponse = await cko.issuing.createCard({
                type: "physical",
                cardholder_id: "crh_d3ozhf43pcq2xbldn2g45qnb44",
                lifetime: {
                    unit: "Months",
                    value: 6
                },
                reference: "X-123456-N11",
                card_product_id: "pro_7syjig3jq3mezlc3vjrdpfitl4",
                display_name: "JOHN KENNEDY",
                shipping_instructions: {
                    shipping_recipient: "john kennedy",
                    shipping_address: {
                        address_line1: "Checkout.com",
                        address_line2: "90 Tottenham Court Road",
                        city: "London",
                        state: "London",
                        zip: "W1T 4TJ",
                        country: "GB"
                    },
                    additional_comment: "string"
                },
                activate_card: false
            })

            expect(cardResponse.id).to.equal("crd_fa6psq242dcd6fdn5gifcq1491")
            expect(cardResponse.display_name).to.equal("JOHN KENNEDY")
        });

        it('should throw when creating a cardholder cards', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/cards')
                .reply(401);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.createCard({});
            } catch (err) {
                expect(err).to.be.instanceOf(AuthenticationError);
            }
        });

        it('should get a card', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491')
                .reply(200, {
                    id: "crd_fa6psq242dcd6fdn5gifcq1491",
                    cardholder_id: "crh_d3ozhf43pcq2xbldn2g45qnb44",
                    card_product_id: "pro_7syjig3jq3mezlc3vjrdpfitl4",
                    client_id: "cli_vkuhvk4vjn2edkps7dfsq6emqm",
                    last_four: 1234,
                    expiry_month: 5,
                    expiry_year: 2025,
                    status: "active",
                    display_name: "JOHN KENNEDY",
                    type: "physical",
                    billing_currency: "USD",
                    issuing_country: "US",
                    reference: "X-123456-N11",
                    created_date: "2021-09-09T19:41:39Z",
                    last_modified_date: "2021-09-09T19:41:39Z",
                    _links: {
                        self: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                        },
                        credentials: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/credentials"
                        },
                        revoke: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/revoke"
                        }
                    }
                });

            const cko = new Checkout(SK);

            const cardholderResponse = await cko.issuing.getCardDetails('crd_fa6psq242dcd6fdn5gifcq1491');

            expect(cardholderResponse.id).to.equal("crd_fa6psq242dcd6fdn5gifcq1491");
            expect(cardholderResponse.cardholder_id).to.equal("crh_d3ozhf43pcq2xbldn2g45qnb44")
            expect(cardholderResponse.type).to.equal("physical")
            expect(cardholderResponse.status).to.equal("active")
        });

        it('should throw when getting a card', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/cards/not_found')
                .reply(404);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.getCardDetails('not_found');
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should enroll card into 3ds with password', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/3ds-enrollment')
                .reply(202, {
                    created_date: "2019-09-10T10:11:12Z",
                    _links: {
                        self: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/3ds-enrollment"
                        }
                    }
                })

            const cko = new Checkout(SK);

            const enrollmentResponse = await cko.issuing.enrollThreeDS( "crd_fa6psq242dcd6fdn5gifcq1491", {
                password: "Xtui43FvfiZ",
                locale: "en-US",
                phone_number: {
                    country_code: "+1",
                    number: "415 555 2671"
                }
            })

            expect(enrollmentResponse.created_date).to.equal("2019-09-10T10:11:12Z")
        });

        it('should throw when enrolling into 3ds', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/cards/not_found/3ds-enrollment')
                .reply(404);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.enrollThreeDS("not_found", {});
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should update 3ds enrollment', async () => {
            nock('https://api.sandbox.checkout.com')
                .patch('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/3ds-enrollment')
                .reply(202, {
                    last_modified_date: "2019-09-11T10:11:12Z",
                    _links: {
                        self: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/3ds-enrollment"
                        }
                    }
                });

            const cko = new Checkout(SK);

            const enrollmentResponse = await cko.issuing.updateThreeDS("crd_fa6psq242dcd6fdn5gifcq1491", {
                security_pair: {
                    question: "Who are you?",
                    answer: "Bond. James Bond."
                },
                password: "Xtui43FvfiZ",
                locale: "en-US",
                phone_number: {
                    country_code: "+1",
                    number: "415 555 2671"
                }
            });

            expect(enrollmentResponse.last_modified_date).to.equal("2019-09-11T10:11:12Z")
        });

        it('should throw when updating enrollment into 3ds', async () => {
            nock('https://api.sandbox.checkout.com')
                .patch('/issuing/cards/not_found/3ds-enrollment')
                .reply(404);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.updateThreeDS("not_found", {});
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should get a card`s 3DS enrollment', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/3ds-enrollment')
                .reply(200, {
                    locale: "en-US",
                    phone_number: {
                        country_code: "+1",
                        number: "415 555 2671"
                    },
                    created_date: "2019-09-10T10:11:12Z",
                    last_modified_date: "2019-09-11T10:11:12Z",
                    _links: {
                        self: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/3ds-enrollment"
                        }
                    }
                });

            const cko = new Checkout(SK);

            const enrollmentResponse = await cko.issuing.getThreeDSDetails('crd_fa6psq242dcd6fdn5gifcq1491');

            expect(enrollmentResponse.locale).to.equal("en-US");
            expect(enrollmentResponse.phone_number.country_code).to.equal("+1")
            expect(enrollmentResponse.phone_number.number).to.equal("415 555 2671")
        });

        it('should throw when getting enrollment into 3ds', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/cards/not_found/3ds-enrollment')
                .reply(404);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.getThreeDSDetails("not_found");
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should activate a card', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/activate')
                .reply(200, {
                    _links: {
                        self: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                        },
                        revoke: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/revoke"
                        },
                        suspend: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/suspend"
                        }
                    }
                })

            const cko = new Checkout(SK);

            const activationResponse = await cko.issuing.activateCard( "crd_fa6psq242dcd6fdn5gifcq1491")

            expect(activationResponse).to.not.be.null
        });

        it('should throw when activating card', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/cards/not_found/activate')
                .reply(404);

            const cko = new Checkout(SK);

            try {
                await cko.issuing.activateCard("not_found");
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should get card credentials', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/credentials?credentials=number,%20cvc2')
                .reply(200, {
                    number: 4242424242424242,
                    cvc2: 604
                })

            const cko = new Checkout(SK);

            const credentialsResponse = await cko.issuing.getCardCredentials( "crd_fa6psq242dcd6fdn5gifcq1491", {
                credentials: "number, cvc2"
            })

            expect(credentialsResponse.number).to.equal(4242424242424242)
            expect(credentialsResponse.cvc2).to.equal(604)
        });

        it('should revoke a card', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/revoke')
                .reply(200, {
                    _links: {
                        self: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                        }
                    }
                })

            const cko = new Checkout(SK);

            const revokeResponse = await cko.issuing.revokeCard( "crd_fa6psq242dcd6fdn5gifcq1491", {
                reason: "reported_lost"
            })

            expect(revokeResponse).to.not.be.null
        });

        it('should throw when revoking a card', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/cards/not_found/revoke')
                .reply(404);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.revokeCard("not_found", {});
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should suspend a card', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/suspend')
                .reply(200, {
                    _links: {
                        self: {
                            href: "https://api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                        }
                    }
                })

            const cko = new Checkout(SK);

            const suspendedResponse = await cko.issuing.suspendCard( "crd_fa6psq242dcd6fdn5gifcq1491", {
                reason: "suspected_lost"
            })

            expect(suspendedResponse).to.not.be.null
        });

        it('should throw when suspending a card', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/cards/not_found/suspend')
                .reply(404);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.suspendCard("not_found", {});
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });
    });

    describe('Card Controls', () => {
        it('should create a card control', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/controls')
                .reply(201, {
                    id: "ctr_gp7vkmxayztufjz6top5bjcdra",
                    description: "Max spend of 500€ per week for restaurants",
                    control_type: "velocity_limit",
                    target_id: "crd_fa6psq42dcdd6fdn5gifcq1491",
                    created_date: "2023-03-12T18:20:12Z",
                    last_modified_date: "2023-03-12T18:20:12Z",
                    velocity_limit: {
                        amount_limit: 5000,
                        velocity_window: {
                            type: "weekly"
                        },
                        mcc_list: [
                            "4121",
                            "4582"
                        ]
                    }
                })

            const cko = new Checkout(SK);

            const controlResponse = await cko.issuing.createCardControl({
                description: "Max spend of 500€ per week for restaurants",
                control_type: "velocity_limit",
                target_id: "crd_fa6psq42dcdd6fdn5gifcq1491",
                velocity_limit: {
                    amount_limit: 5000,
                    velocity_window: {
                        type: "weekly"
                    },
                    mcc_list: [
                        "4121",
                        "4582"
                    ]
                }
            });

            expect(controlResponse).to.not.be.null
            expect(controlResponse.id).to.equal("ctr_gp7vkmxayztufjz6top5bjcdra")
            expect(controlResponse.target_id).to.equal("crd_fa6psq42dcdd6fdn5gifcq1491")
            expect(controlResponse.control_type).to.equal("velocity_limit")
            expect(controlResponse.velocity_limit.amount_limit).to.equal(5000)
        });

        it('should throw when creating a card control', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/controls')
                .reply(404);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.createCardControl({
                    target_id: "not_found",
                });
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should get a card`s controls', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/controls?target_id=crd_fa6psq42dcdd6fdn5gifcq1491')
                .reply(200, {
                    controls: [
                        {
                            id: "ctr_gp7vkmxayztufjz6top5bjcdra",
                            target_id: "crd_fa6psq42dcdd6fdn5gifcq1491",
                            description: "Max spend of 500€ per week for restaurants",
                            control_type: "velocity_limit",
                            created_date: "2021-09-09T19:41:39Z",
                            last_modified_date: "2021-09-09T19:41:39Z"
                        }
                    ]
                })

            const cko = new Checkout(SK);

            const controlsResponse = await cko.issuing.getCardControls({
                target_id: "crd_fa6psq42dcdd6fdn5gifcq1491",
            });

            expect(controlsResponse).to.not.be.null
            expect(controlsResponse.controls[0].id).to.equal("ctr_gp7vkmxayztufjz6top5bjcdra")
            expect(controlsResponse.controls[0].target_id).to.equal("crd_fa6psq42dcdd6fdn5gifcq1491")
            expect(controlsResponse.controls[0].control_type).to.equal("velocity_limit")
        });

        it('should throw when getting a card`s controls', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/controls?target_id=not_found')
                .reply(404);

            const cko = new Checkout(SK);

            try {
                await cko.issuing.getCardControls({
                    target_id: "not_found",
                });
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should get a card`s control details', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/controls/ctr_gp7vkmxayztufjz6top5bjcdra')
                .reply(200, {
                    id: "ctr_gp7vkmxayztufjz6top5bjcdra",
                    target_id: "crd_fa6psq42dcdd6fdn5gifcq1491",
                    description: "Max spend of 500€ per week for restaurants",
                    control_type: "velocity_limit",
                    created_date: "2021-09-09T19:41:39Z",
                    last_modified_date: "2021-09-09T19:41:39Z",
                    velocity_limit: {
                        amount_limit: 5000,
                        velocity_window: {
                            type: "weekly"
                        },
                        mcc_list: [
                            "4121",
                            "4582"
                        ]
                    }
                })

            const cko = new Checkout(SK);

            const controlResponse = await cko.issuing.getCardControlDetails("ctr_gp7vkmxayztufjz6top5bjcdra");

            expect(controlResponse).to.not.be.null
            expect(controlResponse.id).to.equal("ctr_gp7vkmxayztufjz6top5bjcdra")
            expect(controlResponse.target_id).to.equal("crd_fa6psq42dcdd6fdn5gifcq1491")
            expect(controlResponse.control_type).to.equal("velocity_limit")
        });

        it('should throw when getting a card`s control details', async () => {
            nock('https://api.sandbox.checkout.com')
                .get('/issuing/controls/not_found')
                .reply(404);

            const cko = new Checkout(SK);

            try {
                await cko.issuing.getCardControlDetails("not_found");
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should update a card`s controls', async () => {
            nock('https://api.sandbox.checkout.com')
                .put('/issuing/controls/ctr_gp7vkmxayztufjz6top5bjcdra')
                .reply(200, {
                    id: "ctr_gp7vkmxayztufjz6top5bjcdra",
                    description: "Max spend of 500€ per week for restaurants",
                    control_type: "velocity_limit",
                    target_id: "crd_fa6psq42dcdd6fdn5gifcq1491",
                    created_date: "2023-03-12T18:20:12Z",
                    last_modified_date: "2023-03-12T18:20:12Z",
                    velocity_limit: {
                        amount_limit: 5000,
                        velocity_window: {
                            type: "weekly"
                        },
                        mcc_list: [
                            "4121",
                            "4582"
                        ]
                    }
                })

            const cko = new Checkout(SK);

            const controlsResponse = await cko.issuing.updateCardControl("ctr_gp7vkmxayztufjz6top5bjcdra", {
                description: "Max spend of 500€ per week for restaurants",
                velocity_limit: {
                    amount_limit: 5000,
                    velocity_window: {
                        type: "weekly"
                    },
                    mcc_list: [
                        "4121",
                        "4582"
                    ]
                },
                mcc_limit: {
                    type: "block",
                    mcc_list: [
                        "4121",
                        "4582"
                    ]
                }
            });

            expect(controlsResponse).to.not.be.null
            expect(controlsResponse.id).to.equal("ctr_gp7vkmxayztufjz6top5bjcdra")
            expect(controlsResponse.target_id).to.equal("crd_fa6psq42dcdd6fdn5gifcq1491")
            expect(controlsResponse.control_type).to.equal("velocity_limit")
        });

        it('should throw when updating a card`s controls', async () => {
            nock('https://api.sandbox.checkout.com')
                .put('/issuing/controls/not_found')
                .reply(404);

            const cko = new Checkout('sk_123');

            try {
                await cko.issuing.updateCardControl("not_found", {});
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should delete a card`s control', async () => {
            nock('https://api.sandbox.checkout.com')
                .delete('/issuing/controls/ctr_gp7vkmxayztufjz6top5bjcdra')
                .reply(200, {
                    id: "ctr_gp7vkmxayztufjz6top5bjcdra",
                })

            const cko = new Checkout(SK);

            const controlResponse = await cko.issuing.deleteCardControl("ctr_gp7vkmxayztufjz6top5bjcdra");

            expect(controlResponse).to.not.be.null
            expect(controlResponse.id).to.equal("ctr_gp7vkmxayztufjz6top5bjcdra")
        });

        it('should throw when deleting a card`s control details', async () => {
            nock('https://api.sandbox.checkout.com')
                .delete('/issuing/controls/not_found')
                .reply(404);

            const cko = new Checkout(SK);

            try {
                await cko.issuing.deleteCardControl("not_found");
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });
    });

    describe('Authorizations', () => {
        it('should simulate an authorization', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/simulate/authorizations')
                .reply(201, {
                    id: "trx_aaqc4uaaybigcaaqc4uaayfiga",
                    status: "Authorized"
                });

            const cko = new Checkout(SK);

            const authorizationResponse = await cko.issuing.simulateAuthorization({
                card: {
                    id: "crd_fa6psq242dcd6fdn5gifcq1491",
                    expiry_month: 5,
                    expiry_year: 2025
                },
                transaction: {
                    type: "purchase",
                    amount: 6540,
                    currency: "GBP"
                }
            });

            expect(authorizationResponse).to.not.be.null
            expect(authorizationResponse.id).to.equal("trx_aaqc4uaaybigcaaqc4uaayfiga")
            expect(authorizationResponse.status).to.equal("Authorized")
        });

        it('should throw when simulating an authorization with invalid card', async () => {
            nock('https://api.sandbox.checkout.com')
                .post('/issuing/simulate/authorizations')
                .reply(422);

            try {
                const cko = new Checkout(SK);

                await cko.issuing.simulateAuthorization({
                    card: {
                        id: "not_found",
                        expiry_month: 5,
                        expiry_year: 2025
                    },
                    transaction: {
                        type: "purchase",
                        amount: 6540,
                        currency: "GBP"
                    }
                });
            } catch (err) {
                expect(err).to.be.instanceOf(ValidationError);
            }
        });
    })
});
