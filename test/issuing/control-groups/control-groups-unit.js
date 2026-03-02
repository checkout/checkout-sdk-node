import nock from "nock";
import { expect } from "chai";
import Checkout from "../../../src/Checkout.js";

describe('Unit::Issuing::ControlGroups', () => {
    it('should create a control group', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/controls/control-groups')
            .reply(200, {
                id: "ctg_abc123",
                description: "Test group"
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });
        const response = await cko.issuing.createControlGroup({
            description: "Test group",
            control_ids: ["ctr_123", "ctr_456"]
        });

        expect(response).to.not.be.null;
        expect(response.id).to.equal("ctg_abc123");
    });

    it('should get control groups by target', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/controls/control-groups?target_id=crd_123')
            .reply(200, {
                data: [{
                    id: "ctg_abc123"
                }]
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });
        const response = await cko.issuing.getControlGroupByTarget({ target_id: "crd_123" });

        expect(response).to.not.be.null;
    });

    it('should get a control group', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/controls/control-groups/ctg_abc123')
            .reply(200, {
                id: "ctg_abc123",
                description: "Test group"
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });
        const response = await cko.issuing.getControlGroup("ctg_abc123");

        expect(response).to.not.be.null;
        expect(response.id).to.equal("ctg_abc123");
    });

    it('should delete a control group', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .delete('/issuing/controls/control-groups/ctg_abc123')
            .reply(200);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });
        const response = await cko.issuing.deleteControlGroup("ctg_abc123");

        expect(response).to.not.be.null;
    });
});
