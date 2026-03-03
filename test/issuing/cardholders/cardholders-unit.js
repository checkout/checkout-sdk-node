import nock from "nock";
import { expect } from "chai";
import Checkout from "../../../src/Checkout.js";
import { AuthenticationError, NotFoundError, ValidationError } from "../../../src/services/errors.js";

describe('Unit::Issuing::Cardholder', () => {
    it('should create a cardholder', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/cardholders')
            .reply(200, {
                id: 'crh_d3ozhf43pcq2xbldn2g45qnb44',
                client_id: 'cli_vkuhvk4vjn2edkps7dfsq6emqm',
                entity_id: 'ent_fa6psq242dcd6fdn5gifcq1491',
                type: "individual",
                status: "active",
                reference: "X-123456-N11",
                created_date: "string",
                last_modified_date: "2019-09-10T10:11:12Z",
                _links: {
                    self: {
                        href: "https://123456789.api.checkout.com/issuing/cardholders/crh_d3ozhf43pcq2xbldn2g45qnb44"
                    },
                    cards: {
                        href: "https://123456789.api.checkout.com/issuing/cards"
                    }
                }
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

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
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com').post('/issuing/cardholders').reply(401);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

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
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
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
                        href: "https://123456789.api.checkout.com/issuing/cardholders/crh_d3ozhf43pcq2xbldn2g45qnb44"
                    },
                    cards: {
                        href: "https://123456789.api.checkout.com/issuing/cards"
                    }
                }
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const cardholderResponse = await cko.issuing.getCardholder('crh_d3ozhf43pcq2xbldn2g45qnb44');

        expect(cardholderResponse.id).to.equal("crh_d3ozhf43pcq2xbldn2g45qnb44");
        expect(cardholderResponse.type).to.equal("individual")
        expect(cardholderResponse.first_name).to.equal("John")
        expect(cardholderResponse.last_name).to.equal("Kennedy")
    });

    it('should throw when getting a cardholder', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/cardholders/not_found')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.getCardholder('not_found');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should update a cardholder', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/issuing/cardholders/crh_d3ozhf43pcq2xbldn2g45qnb44')
            .reply(200, {
                id: 'crh_d3ozhf43pcq2xbldn2g45qnb44',
                type: "individual",
                status: "active",
                reference: "X-123456-N11-UPDATED",
                last_modified_date: "2019-09-10T10:11:12Z"
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const cardholderResponse = await cko.issuing.updateCardholder('crh_d3ozhf43pcq2xbldn2g45qnb44', {
            reference: "X-123456-N11-UPDATED",
            email: "john.kennedy.updated@myemaildomain.com"
        });

        expect(cardholderResponse.id).to.equal("crh_d3ozhf43pcq2xbldn2g45qnb44");
        expect(cardholderResponse.reference).to.equal("X-123456-N11-UPDATED");
    });

    it('should throw when updating a cardholder', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/issuing/cardholders/not_found')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.updateCardholder('not_found', { reference: "test" });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get a cardholder cards', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
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

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const cardholderResponse = await cko.issuing.getCardholderCards('crh_d3ozhf43pcq2xbldn2g45qnb44');

        expect(cardholderResponse.cards[0].id).to.equal("crd_fa6psq242dcd6fdn5gifcq1491");
        expect(cardholderResponse.cards[0].cardholder_id).to.equal("crh_d3ozhf43pcq2xbldn2g45qnb44");
        expect(cardholderResponse.cards[0].card_product_id).to.equal("pro_7syjig3jq3mezlc3vjrdpfitl4")
        expect(cardholderResponse.cards[0].client_id).to.equal("cli_vkuhvk4vjn2edkps7dfsq6emqm")
        expect(cardholderResponse.cards[0].status).to.equal("active")
    });

    it('should throw when getting a cardholder cards', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:card-management-write issuing:card-management-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/cardholders/not_found/cards')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:card-management-write', 'issuing:card-management-read'],
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.getCardholderCards('not_found');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
