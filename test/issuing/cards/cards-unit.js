import nock from "nock";
import { expect } from "chai";
import Checkout from "../../../src/Checkout.js";
import { AuthenticationError, NotFoundError, ValidationError } from "../../../src/services/errors.js";

describe('Unit::Issuing::Cards', () => {
    it('should create card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards')
            .reply(200, {
                id: "crd_fa6psq242dcd6fdn5gifcq1491",
                client_id: "cli_vkuhvk4vjn2edkps7dfsq6emqm",
                entity_id: "ent_fa6psq242dcd6fdn5gifcq1491",
                cardholder_id: "crh_d3ozhf43pcq2xbldn2g45qnb44",
                card_product_id: "pro_7syjig3jq3mezlc3vjrdpfitl4",
                display_name: "JOHN KENNEDY",
                last_four: 1234,
                expiry_month: 5,
                expiry_year: 2025,
                status: "active",
                type: "physical",
                billing_currency: "USD",
                issuing_country: "US",
                scheme: "VISA",
                reference: "X-123456-N11",
                created_date: "2019-09-10T10:11:12Z",
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                    },
                    credentials: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/credentials"
                    },
                    revoke: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/revoke"
                    }
                }
            })

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

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
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards')
            .reply(401);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.createCard({});
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get a card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
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
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                    },
                    credentials: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/credentials"
                    },
                    revoke: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/revoke"
                    }
                }
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const cardholderResponse = await cko.issuing.getCardDetails('crd_fa6psq242dcd6fdn5gifcq1491');

        expect(cardholderResponse.id).to.equal("crd_fa6psq242dcd6fdn5gifcq1491");
        expect(cardholderResponse.cardholder_id).to.equal("crh_d3ozhf43pcq2xbldn2g45qnb44")
        expect(cardholderResponse.type).to.equal("physical")
        expect(cardholderResponse.status).to.equal("active")
    });

    it('should throw when getting a card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/cards/not_found')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.getCardDetails('not_found');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should update a card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491')
            .reply(200, {
                id: "crd_fa6psq242dcd6fdn5gifcq1491",
                status: "inactive",
                reference: "X-123456-N11-UPDATED"
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const cardResponse = await cko.issuing.updateCard('crd_fa6psq242dcd6fdn5gifcq1491', {
            status: "inactive",
            reference: "X-123456-N11-UPDATED"
        });

        expect(cardResponse.id).to.equal("crd_fa6psq242dcd6fdn5gifcq1491");
        expect(cardResponse.status).to.equal("inactive");
        expect(cardResponse.reference).to.equal("X-123456-N11-UPDATED");
    });

    it('should throw when updating a card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/issuing/cards/not_found')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.updateCard('not_found', { status: "inactive" });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should enroll card into 3ds with password', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/3ds-enrollment')
            .reply(202, {
                created_date: "2019-09-10T10:11:12Z",
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/3ds-enrollment"
                    }
                }
            })

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const enrollmentResponse = await cko.issuing.enrollThreeDS("crd_fa6psq242dcd6fdn5gifcq1491", {
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
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/not_found/3ds-enrollment')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.enrollThreeDS("not_found", {});
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should update 3ds enrollment', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/3ds-enrollment')
            .reply(202, {
                last_modified_date: "2019-09-11T10:11:12Z",
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/3ds-enrollment"
                    }
                }
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

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
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/issuing/cards/not_found/3ds-enrollment')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.updateThreeDS("not_found", {});
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get a card`s 3DS enrollment', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
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
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/3ds-enrollment"
                    }
                }
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const enrollmentResponse = await cko.issuing.getThreeDSDetails('crd_fa6psq242dcd6fdn5gifcq1491');

        expect(enrollmentResponse.locale).to.equal("en-US");
        expect(enrollmentResponse.phone_number.country_code).to.equal("+1")
        expect(enrollmentResponse.phone_number.number).to.equal("415 555 2671")
    });

    it('should throw when getting enrollment into 3ds', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/cards/not_found/3ds-enrollment')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.getThreeDSDetails("not_found");
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should activate a card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/activate')
            .reply(200, {
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                    },
                    revoke: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/revoke"
                    },
                    suspend: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/suspend"
                    },
                    controls: {
                        href: "https://123456789.api.checkout.com/issuing/controls?target_id=crd_fa6psq42dcdd6fdn5gifcq1491"
                    }
                }
            })

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const activationResponse = await cko.issuing.activateCard("crd_fa6psq242dcd6fdn5gifcq1491")

        expect(activationResponse).to.not.be.null
    });

    it('should throw when activating card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/not_found/activate')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.activateCard("not_found");
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get card credentials', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/credentials?credentials=number,%20cvc2')
            .reply(200, {
                number: 4242424242424242,
                cvc2: 604
            })

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const credentialsResponse = await cko.issuing.getCardCredentials("crd_fa6psq242dcd6fdn5gifcq1491", {
            credentials: "number, cvc2"
        })

        expect(credentialsResponse.number).to.equal(4242424242424242)
        expect(credentialsResponse.cvc2).to.equal(604)
    });

    it('should renew a card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/renew')
            .reply(200, {
                id: "crd_renewed123456789abcd",
                cardholder_id: "crh_d3ozhf43pcq2xbldn2g45qnb44",
                status: "active",
                display_name: "JOHN KENNEDY",
                type: "virtual",
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_renewed123456789abcd"
                    }
                }
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const renewalResponse = await cko.issuing.renewCard("crd_fa6psq242dcd6fdn5gifcq1491", {
            card_type: "virtual"
        });

        expect(renewalResponse.id).to.equal("crd_renewed123456789abcd");
        expect(renewalResponse.cardholder_id).to.equal("crh_d3ozhf43pcq2xbldn2g45qnb44");
    });

    it('should throw when renewing a card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/not_found/renew')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.renewCard("not_found", { card_type: "virtual" });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should revoke a card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/revoke')
            .reply(200, {
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                    }
                }
            })

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const revokeResponse = await cko.issuing.revokeCard("crd_fa6psq242dcd6fdn5gifcq1491", {
            reason: "reported_lost"
        })

        expect(revokeResponse).to.not.be.null
    });

    it('should throw when revoking a card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/not_found/revoke')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.revokeCard("not_found", {});
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should schedule card revocation', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/schedule-revocation')
            .reply(200, {
                scheduled_date: "2025-12-31T23:59:59Z",
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491"
                    }
                }
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const scheduleResponse = await cko.issuing.scheduleCardRevocation("crd_fa6psq242dcd6fdn5gifcq1491", {
            scheduled_date: "2025-12-31T23:59:59Z",
            reason: "expiring"
        });

        expect(scheduleResponse.scheduled_date).to.equal("2025-12-31T23:59:59Z");
    });

    it('should throw when scheduling card revocation', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/not_found/schedule-revocation')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.scheduleCardRevocation("not_found", { scheduled_date: "2025-12-31T23:59:59Z" });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should cancel scheduled card revocation', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .delete('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/schedule-revocation')
            .reply(200, {
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491"
                    }
                }
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const cancelResponse = await cko.issuing.cancelScheduledCardRevocation("crd_fa6psq242dcd6fdn5gifcq1491");

        expect(cancelResponse).to.not.be.null;
    });

    it('should throw when canceling scheduled card revocation', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .delete('/issuing/cards/not_found/schedule-revocation')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.cancelScheduledCardRevocation("not_found");
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should suspend a card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/crd_fa6psq242dcd6fdn5gifcq1491/suspend')
            .reply(200, {
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                    }
                }
            })

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const suspendedResponse = await cko.issuing.suspendCard("crd_fa6psq242dcd6fdn5gifcq1491", {
            reason: "suspected_lost"
        })

        expect(suspendedResponse).to.not.be.null
    });

    it('should throw when suspending a card', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cards/not_found/suspend')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.suspendCard("not_found", {});
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
