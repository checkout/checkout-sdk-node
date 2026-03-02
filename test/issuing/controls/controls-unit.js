import nock from "nock";
import { expect } from "chai";
import Checkout from "../../../src/Checkout.js";
import { AuthenticationError, NotFoundError, ValidationError } from "../../../src/services/errors.js";

describe('Unit::Issuing::Controls', () => {
    it('should create a card control', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/controls')
            .reply(200, {
                id: "ctr_gp7vkmxayztufjz6top5bjcdra",
                client_id: "cli_vkuhvk4vjn2edkps7dfsq6emqm",
                entity_id: "ent_fa6psq242dcd6fdn5gifcq1491",
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

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

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
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/controls')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.createCardControl({
                target_id: "not_found",
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get a card`s controls', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
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

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const controlsResponse = await cko.issuing.getCardControls({
            target_id: "crd_fa6psq42dcdd6fdn5gifcq1491",
        });

        expect(controlsResponse).to.not.be.null
        expect(controlsResponse.controls[0].id).to.equal("ctr_gp7vkmxayztufjz6top5bjcdra")
        expect(controlsResponse.controls[0].target_id).to.equal("crd_fa6psq42dcdd6fdn5gifcq1491")
        expect(controlsResponse.controls[0].control_type).to.equal("velocity_limit")
    });

    it('should throw when getting a card`s controls', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/controls?target_id=not_found')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.getCardControls({
                target_id: "not_found",
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get a card`s control details', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
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

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const controlResponse = await cko.issuing.getCardControlDetails("ctr_gp7vkmxayztufjz6top5bjcdra");

        expect(controlResponse).to.not.be.null
        expect(controlResponse.id).to.equal("ctr_gp7vkmxayztufjz6top5bjcdra")
        expect(controlResponse.target_id).to.equal("crd_fa6psq42dcdd6fdn5gifcq1491")
        expect(controlResponse.control_type).to.equal("velocity_limit")
    });

    it('should throw when getting a card`s control details', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/controls/not_found')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.getCardControlDetails("not_found");
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should update a card`s controls', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
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

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

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
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .put('/issuing/controls/not_found')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.updateCardControl("not_found", {});
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should delete a card`s control', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .delete('/issuing/controls/ctr_gp7vkmxayztufjz6top5bjcdra')
            .reply(200, {
                id: "ctr_gp7vkmxayztufjz6top5bjcdra",
            })

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const controlResponse = await cko.issuing.deleteCardControl("ctr_gp7vkmxayztufjz6top5bjcdra");

        expect(controlResponse).to.not.be.null
        expect(controlResponse.id).to.equal("ctr_gp7vkmxayztufjz6top5bjcdra")
    });

    it('should throw when deleting a card`s control details', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .delete('/issuing/controls/not_found')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.issuing.deleteCardControl("not_found");
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
