import { Checkout } from '../../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

/**
 * The Accounts API negotiates the payload schema version through the Accept header
 * (`application/json;schema_version=<v>`, latest 3.0). These tests assert the header is emitted on
 * every entity operation that declares it in the swagger, and that an explicit version overrides it.
 */
describe('Platforms — Accounts schema_version Accept header', () => {
    afterEach(() => nock.cleanAll());

    const host = 'https://123456789.api.sandbox.checkout.com';
    const cko = () => new Checkout(SK, { subdomain: '123456789' }).platforms;

    it('onboardSubEntity sends schema_version=3.0 by default', async () => {
        nock(host)
            .matchHeader('accept', 'application/json;schema_version=3.0')
            .post('/accounts/entities')
            .reply(201, { id: 'ent_1' });
        const res = await cko().onboardSubEntity({ reference: 'r' });
        expect(res.id).to.equal('ent_1');
    });

    it('getSubEntityDetails sends schema_version=3.0 by default', async () => {
        nock(host)
            .matchHeader('accept', 'application/json;schema_version=3.0')
            .get('/accounts/entities/ent_1')
            .reply(200, { id: 'ent_1' });
        const res = await cko().getSubEntityDetails('ent_1');
        expect(res.id).to.equal('ent_1');
    });

    it('updateSubEntityDetails sends schema_version=3.0 by default', async () => {
        nock(host)
            .matchHeader('accept', 'application/json;schema_version=3.0')
            .put('/accounts/entities/ent_1')
            .reply(200, { id: 'ent_1' });
        const res = await cko().updateSubEntityDetails('ent_1', { reference: 'r' });
        expect(res.id).to.equal('ent_1');
    });

    it('getEntityRequirements sends schema_version=3.0 by default', async () => {
        nock(host)
            .matchHeader('accept', 'application/json;schema_version=3.0')
            .get('/accounts/entities/ent_1/requirements')
            .reply(200, { data: [] });
        const res = await cko().getEntityRequirements('ent_1');
        expect(res.data).to.deep.equal([]);
    });

    it('honors an explicit schema version override on every entity operation', async () => {
        nock(host)
            .matchHeader('accept', 'application/json;schema_version=2.0')
            .post('/accounts/entities')
            .reply(201, { id: 'ent_1' });
        nock(host)
            .matchHeader('accept', 'application/json;schema_version=2.0')
            .get('/accounts/entities/ent_1')
            .reply(200, { id: 'ent_1' });
        nock(host)
            .matchHeader('accept', 'application/json;schema_version=2.0')
            .put('/accounts/entities/ent_1')
            .reply(200, { id: 'ent_1' });
        nock(host)
            .matchHeader('accept', 'application/json;schema_version=2.0')
            .get('/accounts/entities/ent_1/requirements')
            .reply(200, { data: [] });

        const client = cko();
        expect((await client.onboardSubEntity({ reference: 'r' }, '2.0')).id).to.equal('ent_1');
        expect((await client.getSubEntityDetails('ent_1', '2.0')).id).to.equal('ent_1');
        expect((await client.updateSubEntityDetails('ent_1', { reference: 'r' }, '2.0')).id).to.equal('ent_1');
        expect((await client.getEntityRequirements('ent_1', '2.0')).data).to.deep.equal([]);
    });

    it('rejects an unsupported schema version', async () => {
        // No nock interceptor: the request must never be sent for an invalid version.
        let error;
        try {
            await cko().onboardSubEntity({ reference: 'r' }, '4.0');
        } catch (err) {
            error = err;
        }
        expect(error).to.exist;
        expect(error.name).to.equal('ValueError');
        expect(error.message).to.contain('Unsupported Accounts schema version');
    });
});
