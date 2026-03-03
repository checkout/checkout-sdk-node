import nock from "nock";
import { expect } from "chai";
import Checkout from "../../../src/Checkout.js";

describe('Unit::Issuing::ControlProfiles', () => {
    it('should create a control profile', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/controls/control-profiles')
            .reply(200, {
                id: "ctp_abc123",
                name: "Test profile"
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.createControlProfile({
            name: "Test profile",
            control_group_ids: ["ctg_123"]
        });

        expect(response).to.not.be.null;
        expect(response.id).to.equal("ctp_abc123");
    });

    it('should get control profiles by target', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/controls/control-profiles?target_id=crd_123')
            .reply(200, {
                data: [{
                    id: "ctp_abc123"
                }]
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.getControlProfilesByTarget({ target_id: "crd_123" });

        expect(response).to.not.be.null;
    });

    it('should get a control profile', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/controls/control-profiles/ctp_abc123')
            .reply(200, {
                id: "ctp_abc123",
                name: "Test profile"
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.getControlProfile("ctp_abc123");

        expect(response).to.not.be.null;
        expect(response.id).to.equal("ctp_abc123");
    });

    it('should update a control profile', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/issuing/controls/control-profiles/ctp_abc123')
            .reply(200, {
                id: "ctp_abc123",
                name: "Updated profile"
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.updateControlProfile("ctp_abc123", {
            name: "Updated profile"
        });

        expect(response).to.not.be.null;
        expect(response.name).to.equal("Updated profile");
    });

    it('should delete a control profile', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .delete('/issuing/controls/control-profiles/ctp_abc123')
            .reply(200);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.deleteControlProfile("ctp_abc123");

        expect(response).to.not.be.null;
    });

    it('should add target to control profile', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/controls/control-profiles/ctp_abc123/add/crd_123')
            .reply(200);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.addTargetToControlProfile("ctp_abc123", "crd_123");

        expect(response).to.not.be.null;
    });

    it('should remove target from control profile', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(200, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'issuing:controls-write issuing:controls-read'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/controls/control-profiles/ctp_abc123/remove/crd_123')
            .reply(200);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['issuing:controls-write', 'issuing:controls-read'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.removeTargetFromControlProfile("ctp_abc123", "crd_123");

        expect(response).to.not.be.null;
    });
});
