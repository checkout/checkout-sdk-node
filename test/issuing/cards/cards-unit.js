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
                last_activated_on: null,
                scheduled_revocation_date: "2026-12-31",
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
            scheduled_revocation_date: "2026-12-31",
            activate_card: false
        })

        expect(cardResponse.id).to.equal("crd_fa6psq242dcd6fdn5gifcq1491")
        expect(cardResponse.display_name).to.equal("JOHN KENNEDY")
        expect(cardResponse.last_activated_on).to.equal(null)
        expect(cardResponse.scheduled_revocation_date).to.equal("2026-12-31")
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
                last_activated_on: "2021-09-09T19:41:39Z",
                scheduled_revocation_date: "2026-12-31",
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
        expect(cardholderResponse.last_activated_on).to.equal("2021-09-09T19:41:39Z")
        expect(cardholderResponse.scheduled_revocation_date).to.equal("2026-12-31")
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
                reference: "X-123456-N11-UPDATED",
                scheduled_revocation_date: "2026-12-31",
                last_modified_date: "2021-09-09T19:41:39Z",
                last_activated_on: null,
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                    },
                    credentials: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/credentials"
                    },
                    revoke: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/revoke"
                    },
                    controls: {
                        href: "https://123456789.api.checkout.com/issuing/controls?target_id=crd_fa6psq42dcdd6fdn5gifcq1491"
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

        const cardResponse = await cko.issuing.updateCard('crd_fa6psq242dcd6fdn5gifcq1491', {
            status: "inactive",
            reference: "X-123456-N11-UPDATED",
            scheduled_revocation_date: "2026-12-31"
        });

        expect(cardResponse.id).to.equal("crd_fa6psq242dcd6fdn5gifcq1491");
        expect(cardResponse.status).to.equal("inactive");
        expect(cardResponse.reference).to.equal("X-123456-N11-UPDATED");
        expect(cardResponse.scheduled_revocation_date).to.equal("2026-12-31");
        expect(cardResponse.last_modified_date).to.equal("2021-09-09T19:41:39Z");
        expect(cardResponse.encrypted_cvv).to.equal(undefined);
    });

    it('should reactivate a suspended card via update', async () => {
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
                status: "active",
                last_modified_date: "2021-09-09T19:41:39Z",
                last_activated_on: "2021-09-09T19:41:39Z",
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491"
                    },
                    credentials: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/credentials"
                    },
                    revoke: {
                        href: "https://123456789.api.checkout.com/issuing/cards/crd_fa6psq42dcdd6fdn5gifcq1491/revoke"
                    },
                    controls: {
                        href: "https://123456789.api.checkout.com/issuing/controls?target_id=crd_fa6psq42dcdd6fdn5gifcq1491"
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

        const cardResponse = await cko.issuing.updateCard('crd_fa6psq242dcd6fdn5gifcq1491', {
            status: "active"
        });

        expect(cardResponse.status).to.equal("active");
        expect(cardResponse.last_activated_on).to.equal("2021-09-09T19:41:39Z");
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
                last_activated_on: "2021-09-09T19:41:39Z",
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
        expect(activationResponse.last_activated_on).to.equal("2021-09-09T19:41:39Z")
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

    // The return-encrypted-cvv and Encryption-Key headers on PATCH /issuing/cards/{cardId}.
    //
    // These assert the headers on the outgoing request, because the spec spells them case
    // sensitively (return-encrypted-cvv lower case, Encryption-Key title case) and because they
    // travel on a copy of the config rather than on the body. The 2026-09-17 spec (INT-1700)
    // removed encrypted_cvv from update-card-response entirely, so the response body is
    // asserted without it regardless of whether these headers are sent.
    describe('update headers', () => {
        const SUBDOMAIN = "123456789";
        const ACCESS_BASE = `https://${SUBDOMAIN}.access.sandbox.checkout.com`;
        const BASE = `https://${SUBDOMAIN}.api.sandbox.checkout.com`;
        const CARD_ID = "crd_fa6psq42dc0uxl3ct3jryhdo2m";

        // Issuing uses OAuth, so every call needs the token endpoint stubbed first.
        const client = () => {
            nock(ACCESS_BASE).post('/connect/token').reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

            return new Checkout('test_client_secret', {
                client: 'ack_testclie123456',
                scope: ['issuing:card-management-write', 'issuing:card-management-read'],
                environment: 'sandbox',
                subdomain: SUBDOMAIN
            });
        };

        afterEach(() => {
            nock.cleanAll();
        });

        it('should send both headers with their exact swagger spelling', async () => {
            let seen;
            nock(BASE)
                .patch(`/issuing/cards/${CARD_ID}`)
                .reply(200, function () {
                    seen = this.req.headers;
                    return {
                        last_modified_date: '2026-06-01T10:00:00Z',
                        _links: {
                            self: {
                                href: `https://${SUBDOMAIN}.api.checkout.com/issuing/cards/${CARD_ID}`,
                                actions: ['GET'],
                                types: ['application/json']
                            }
                        }
                    };
                });

            const result = await client().issuing.cards.updateCard(
                CARD_ID,
                { reference: 'X-123456-N11' },
                { 'return-encrypted-cvv': true, 'Encryption-Key': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A' }
            );

            // nock lowercases header names when it records them, which is what HTTP does on the wire.
            expect(seen['return-encrypted-cvv']).to.equal('true');
            expect(seen['encryption-key']).to.equal('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A');

            // last_modified_date is required on update-card-response. The 2026-09-17 spec
            // (INT-1700) removed encrypted_cvv entirely, so these headers no longer make the
            // response carry it; _links is now the same CardLinks shape get-card-response uses.
            expect(result.last_modified_date).to.equal('2026-06-01T10:00:00Z');
            expect(result.encrypted_cvv).to.be.undefined;
            expect(result._links.self.href).to.contain(`/issuing/cards/${CARD_ID}`);
            expect(result._links.self.actions).to.deep.equal(['GET']);
            expect(result._links.self.types).to.deep.equal(['application/json']);
        });

        it('should not leak the headers into the request body', async () => {
            let body;
            nock(BASE)
                .patch(`/issuing/cards/${CARD_ID}`, (received) => {
                    body = received;
                    return true;
                })
                .reply(200, { last_modified_date: '2026-06-01T10:00:00Z' });

            await client().issuing.cards.updateCard(
                CARD_ID,
                { reference: 'X-123456-N11' },
                { 'return-encrypted-cvv': true }
            );

            expect(body).to.deep.equal({ reference: 'X-123456-N11' });
            expect(body['return-encrypted-cvv']).to.be.undefined;
            expect(body.headers).to.be.undefined;
        });

        it('should send no card headers when none are supplied', async () => {
            let seen;
            nock(BASE)
                .patch(`/issuing/cards/${CARD_ID}`)
                .reply(200, function () {
                    seen = this.req.headers;
                    return { last_modified_date: '2026-06-01T10:00:00Z' };
                });

            const result = await client().issuing.cards.updateCard(CARD_ID, { reference: 'X-123456-N11' });

            expect(seen['return-encrypted-cvv']).to.be.undefined;
            expect(seen['encryption-key']).to.be.undefined;
            expect(result.encrypted_cvv).to.be.undefined;
        });

        it('should send the encryption key on its own', async () => {
            let seen;
            nock(BASE)
                .patch(`/issuing/cards/${CARD_ID}`)
                .reply(200, function () {
                    seen = this.req.headers;
                    return { last_modified_date: '2026-06-01T10:00:00Z' };
                });

            await client().issuing.cards.updateCard(CARD_ID, {}, { 'Encryption-Key': 'MIIBIjAN' });

            expect(seen['encryption-key']).to.equal('MIIBIjAN');
            expect(seen['return-encrypted-cvv']).to.be.undefined;
        });

        it('should forward the headers through the backwards-compatible aggregate method', async () => {
            let seen;
            nock(BASE)
                .patch(`/issuing/cards/${CARD_ID}`)
                .reply(200, function () {
                    seen = this.req.headers;
                    return { last_modified_date: '2026-06-01T10:00:00Z' };
                });

            await client().issuing.updateCard(CARD_ID, {}, { 'return-encrypted-cvv': true });

            expect(seen['return-encrypted-cvv']).to.equal('true');
        });

        // The API answers 422 with error code encryption_key_required when the flag is set without
        // a key. The SDK must surface the error body rather than swallowing it.
        it('should surface the 422 encryption_key_required error', async () => {
            nock(BASE)
                .patch(`/issuing/cards/${CARD_ID}`)
                .reply(422, {
                    request_id: '0HLHPN8802NUF:00000003',
                    error_type: 'request_invalid',
                    error_codes: ['encryption_key_required']
                });

            try {
                await client().issuing.cards.updateCard(CARD_ID, {}, { 'return-encrypted-cvv': true });
                throw new Error('expected the update to reject');
            } catch (error) {
                expect(error).to.be.instanceOf(ValidationError);
                expect(error.http_code).to.equal(422);
                expect(error.body.error_codes).to.contain('encryption_key_required');
            }
        });

        // The renamed field is a plain passthrough here, since node models no card fields,
        // but the key still has to reach the wire under its new name.
        it('should pass scheduled_activation_date through to the request body', async () => {
            let body;
            nock(BASE)
                .patch(`/issuing/cards/${CARD_ID}`, (received) => {
                    body = received;
                    return true;
                })
                .reply(200, { last_modified_date: '2026-06-01T10:00:00Z' });

            await client().issuing.cards.updateCard(CARD_ID, {
                scheduled_activation_date: '2026-06-01T10:00Z',
                revocation_date: '2027-03-12'
            });

            expect(body.scheduled_activation_date).to.equal('2026-06-01T10:00Z');
            expect(body.revocation_date).to.equal('2027-03-12');
            expect(body.activation_date).to.be.undefined;
        });
    });
});
