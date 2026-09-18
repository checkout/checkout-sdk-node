import { Checkout, OAuthScopes } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

// Every Inventory operation requires the OAuth scope agentic:inventory (no
// ApiSecretKey/ApiPublicKey support), so the client is built the OAuth way
// (client/scope), same pattern used by NetworkTokens/Issuing tests.
const buildInventoryClient = () =>
    new Checkout('test_sk', {
        client: 'ack_test',
        scope: [OAuthScopes.AGENTIC_INVENTORY],
        environment: 'sandbox',
        subdomain: '123456789',
    });

const mockToken = () =>
    nock('https://123456789.access.sandbox.checkout.com')
        .post('/connect/token')
        .reply(200, { access_token: 'token_abc', expires_in: 3600, token_type: 'Bearer', scope: ['agentic:inventory'] });

describe('Inventory', () => {
    afterEach(() => nock.cleanAll());

    it('adjustInventory posts to /inventory/adjustments and forwards the idempotency key', async () => {
        mockToken();
        let capturedHeader = null;
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/inventory/adjustments')
            .reply(function () {
                capturedHeader = this.req.headers['cko-idempotency-key'];
                return [201, {
                    variant_id: 'var_123',
                    on_hand: 42,
                    reserved: 0,
                    safety_stock: 0,
                    available: 42,
                    state: 'in_stock',
                    source: 'managed',
                }];
            });

        const cko = buildInventoryClient();
        const res = await cko.inventory.adjustInventory(
            { variant_id: 'var_123', delta: 5, reason: 'stock count correction' },
            'idem-inv-1'
        );

        expect(res.variant_id).to.equal('var_123');
        expect(res.available).to.equal(42);
        expect(capturedHeader).to.equal('idem-inv-1');
    });

    it('createInventoryReservation posts to /inventory/reservations', async () => {
        mockToken();
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/inventory/reservations')
            .reply(201, {
                id: 'rsv_abc',
                state: 'held',
                owner_type: 'cart',
                owner_reference: 'cart_1',
                items: [{ variant_id: 'var_123', quantity: 2 }],
                expires_at: '2026-09-18T12:00:00Z',
                created_on: '2026-09-18T11:45:00Z',
            });

        const cko = buildInventoryClient();
        const res = await cko.inventory.createInventoryReservation({
            owner_type: 'cart',
            owner_reference: 'cart_1',
            items: [{ variant_id: 'var_123', quantity: 2 }],
        });

        expect(res.id).to.equal('rsv_abc');
        expect(res.state).to.equal('held');
    });

    it('getInventoryReservation gets /inventory/reservations/{id}', async () => {
        mockToken();
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/inventory/reservations/rsv_abc')
            .reply(200, { id: 'rsv_abc', state: 'held' });

        const cko = buildInventoryClient();
        const res = await cko.inventory.getInventoryReservation('rsv_abc');

        expect(res.id).to.equal('rsv_abc');
    });

    it('commitInventoryReservation posts to /inventory/reservations/{id}/commit', async () => {
        mockToken();
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/inventory/reservations/rsv_abc/commit')
            .reply(200, { id: 'rsv_abc', state: 'committed' });

        const cko = buildInventoryClient();
        const res = await cko.inventory.commitInventoryReservation('rsv_abc');

        expect(res.state).to.equal('committed');
    });

    it('releaseInventoryReservation posts to /inventory/reservations/{id}/release', async () => {
        mockToken();
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/inventory/reservations/rsv_abc/release')
            .reply(200, { id: 'rsv_abc', state: 'released' });

        const cko = buildInventoryClient();
        const res = await cko.inventory.releaseInventoryReservation('rsv_abc');

        expect(res.state).to.equal('released');
    });

    it('getInventoryLevels gets /inventory/{variant_id} and forwards expand=product', async () => {
        mockToken();
        let capturedPath = null;
        nock('https://123456789.api.sandbox.checkout.com')
            .get(/\/inventory\/var_123/)
            .reply(function (uri) {
                capturedPath = uri;
                return [200, {
                    variant_id: 'var_123',
                    on_hand: 10,
                    reserved: 2,
                    safety_stock: 1,
                    available: 7,
                    state: 'in_stock',
                    source: 'managed',
                    product: { variant_id: 'var_123', title: 'Widget' },
                }];
            });

        const cko = buildInventoryClient();
        const res = await cko.inventory.getInventoryLevels('var_123', { expand: 'product' });

        expect(res.available).to.equal(7);
        expect(res.product.title).to.equal('Widget');
        expect(capturedPath).to.equal('/inventory/var_123?expand=product');
    });

    it('setInventoryLevels puts to /inventory/{variant_id}', async () => {
        mockToken();
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/inventory/var_123')
            .reply(200, { variant_id: 'var_123', on_hand: 20, available: 20 });

        const cko = buildInventoryClient();
        const res = await cko.inventory.setInventoryLevels('var_123', { on_hand: 20 });

        expect(res.on_hand).to.equal(20);
    });

    it('getInventoryProduct gets /inventory/{variant_id}/product', async () => {
        mockToken();
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/inventory/var_123/product')
            .reply(200, {
                variant_id: 'var_123',
                title: 'Widget',
                description: 'A widget',
                product_url: 'https://example.com/widget',
                image_url: 'https://example.com/widget.png',
                condition: 'new',
                created_on: '2026-09-18T11:00:00Z',
                modified_on: '2026-09-18T11:00:00Z',
                _links: { self: { href: 'https://example.com/self' } },
            });

        const cko = buildInventoryClient();
        const res = await cko.inventory.getInventoryProduct('var_123');

        expect(res.title).to.equal('Widget');
    });

    it('setInventoryProduct puts to /inventory/{variant_id}/product', async () => {
        mockToken();
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/inventory/var_123/product')
            .reply(200, { variant_id: 'var_123', title: 'Widget', condition: 'new' });

        const cko = buildInventoryClient();
        const res = await cko.inventory.setInventoryProduct('var_123', {
            title: 'Widget',
            description: 'A widget',
            product_url: 'https://example.com/widget',
            image_url: 'https://example.com/widget.png',
        });

        expect(res.title).to.equal('Widget');
    });

    it('deleteInventoryProduct deletes /inventory/{variant_id}/product and returns {} on 204', async () => {
        mockToken();
        nock('https://123456789.api.sandbox.checkout.com')
            .delete('/inventory/var_123/product')
            .reply(204);

        const cko = buildInventoryClient();
        const res = await cko.inventory.deleteInventoryProduct('var_123');

        expect(res).to.deep.equal({});
    });
});
