import { AuthenticationError, NotFoundError, } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

describe('Workflows', () => {
    
    it('should get all workflows', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows')
            .reply(200, {
                data: [
                    {
                        id: 'wf_wlu3wxc26jounofs5iez75qaqa',
                        name: 'SITE4',
                        active: true,
                        _links: {
                            self: {
                                href: 'https://api.checkout.com/workflows/wf_wlu3wxc26jounofs5iez75qaqa',
                            },
                        },
                    },
                    {
                        id: 'wf_vsmdljusa3felalfww7tegllyi',
                        name: 'test',
                        active: false,
                        _links: {
                            self: {
                                href: 'https://api.checkout.com/workflows/wf_wlu3wxc26jounofs5iez75qaqa',
                            },
                        },
                    },
                ],
            });
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.getAll();
        expect(workflows.data).to.exist;
    });

    it('should throw AuthenticationError when getting all worflows', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com').get('/workflows').reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.getAll();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should add a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows')
            .reply(201, {
                id: 'wf_wlu3wxc26jounofs5iez75qaqa',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/workflows/wf_wlu3wxc26jounofs5iez75qaqa',
                    },
                },
            });
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.add({
            name: 'Webhooks workflow',
            active: true,
            conditions: [
                {
                    type: 'event',
                    events: {
                        gateway: [
                            'payment_approved',
                            'payment_declined',
                            'card_verification_declined',
                            'card_verified',
                            'payment_authorization_incremented',
                            'payment_authorization_increment_declined',
                            'payment_capture_declined',
                            'payment_captured',
                            'payment_refund_declined',
                            'payment_refunded',
                            'payment_void_declined',
                            'payment_voided'
                        ],
                        dispute: [
                            'dispute_canceled',
                            'dispute_evidence_required',
                            'dispute_expired',
                            'dispute_lost',
                            'dispute_resolved',
                            'dispute_won'
                        ]
                    },
                },
                {
                    type: 'entity',
                    entities: [
                        'ent_xyfdshfudosfdshfdiosfds',
                        'ent_fidjosfjdisofdjsifdosfu'
                    ],
                },
                {
                    type: 'processing_channel',
                    processing_channels: ['pc_axclravnqf5u5ejkweijnp5zc4'],
                },
            ],
            actions: [
                {
                    type: 'webhook',
                    url: 'https://example.com/webhooks',
                    headers: {
                        Authorization: '<AUTHORIZATION_UUID>',
                    },
                    signature: {
                        method: 'HMACSHA256',
                        key: '8V8x0dLK%AyD*DNS8JJr',
                    },
                },
            ],
        });
        expect(workflows.id).to.exist;
    });

    it('should throw AuthenticationError when adding a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com').post('/workflows').reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.add({
                name: 'Webhooks workflow',
                active: true,
                conditions: [
                    {
                        type: 'event',
                        events: {
                            gateway: [
                                'payment_approved',
                                'payment_declined',
                                'card_verification_declined',
                                'card_verified',
                                'payment_authorization_incremented',
                                'payment_authorization_increment_declined',
                                'payment_capture_declined',
                                'payment_captured',
                                'payment_refund_declined',
                                'payment_refunded',
                                'payment_void_declined',
                                'payment_voided'
                            ],
                            dispute: [
                                'dispute_canceled',
                                'dispute_evidence_required',
                                'dispute_expired',
                                'dispute_lost',
                                'dispute_resolved',
                                'dispute_won'
                            ]
                        },
                    },
                    {
                        type: 'entity',
                        entities: [
                            'ent_xyfdshfudosfdshfdiosfds',
                            'ent_fidjosfjdisofdjsifdosfu'
                        ],
                    },
                    {
                        type: 'processing_channel',
                        processing_channels: ['pc_axclravnqf5u5ejkweijnp5zc4'],
                    },
                ],
                actions: [
                    {
                        type: 'webhook',
                        url: 'https://example.com/webhooks',
                        headers: {
                            Authorization: '<AUTHORIZATION_UUID>',
                        },
                        signature: {
                            method: 'HMACSHA256',
                            key: '8V8x0dLK%AyD*DNS8JJr',
                        },
                    },
                ],
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/wf_34pacj7ae6wexju4avpecxvp6e')
            .reply(200, {
                id: 'wf_34pacj7ae6wexju4avpecxvp6e',
                name: 'Webhooks workflow',
                conditions: [
                    {
                        id: 'wfc_ytkofw3gy2wunpkjv6jjuqwqam',
                        type: 'event',
                        events: [Object],
                    },
                    {
                        id: 'wfc_ntfwe6yng74ehl3pa2vp35pgwq',
                        type: 'entity',
                        entities: [Array],
                    },
                    {
                        id: 'wfc_yr2wgu4p66eezghton2sk3djh4',
                        type: 'processing_channel',
                        processing_channels: [Array],
                    },
                ],
                actions: [
                    {
                        id: 'wfa_xv7kfbmlhw6e7adicy7onfmuki',
                        type: 'webhook',
                        url: 'https://example.com/webhooks',
                        headers: [Object],
                        signature: [Object],
                    },
                ],
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/workflows/wf_34pacj7ae6wexju4avpecxvp6e',
                    },
                },
            });
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.get('wf_34pacj7ae6wexju4avpecxvp6e');
        expect(workflows.id).to.exist;
    });

    it('should throw AuthenticationError when getting a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/wf_34pacj7ae6wexju4avpecxvp6e')
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.get('wf_34pacj7ae6wexju4avpecxvp6e');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should remove a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .delete('/workflows/wf_34pacj7ae6wexju4avpecxvp6e')
            .reply(204);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.remove('wf_34pacj7ae6wexju4avpecxvp6e');
        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when removing a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .delete('/workflows/wf_34pacj7ae6wexju4avpecxvp6e')
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.remove('wf_34pacj7ae6wexju4avpecxvp6e');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should patch a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .patch('/workflows/wf_c7svxlvo2bbuva4f6s3xu4f7wm')
            .reply(201, { name: 'Webhooks workflow updated' });
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.patch('wf_c7svxlvo2bbuva4f6s3xu4f7wm', {
            name: 'Webhooks workflow updated',
        });
        expect(workflows.name).to.equal('Webhooks workflow updated');
    });

    it('should throw AuthenticationError when patching a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .patch('/workflows/wf_c7svxlvo2bbuva4f6s3xu4f7wm')
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.patch('wf_c7svxlvo2bbuva4f6s3xu4f7wm', {
                name: 'Webhooks workflow updated',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});

describe('Workflow Actions', () => {

    it('should add a workflow action', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/wf_c7svxlvo2bbuva4f6s3xu4f7wm/actions/')
            .reply(201, {
                id: 'wfa_wlu3wxc26jounofs5iez75qaqa',
                _links: {
                    self: {
                        href: 'https://api.checkout.com/workflows/wf_c7svxlvo2bbuva4f6s3xu4f7wm/actions/wfa_wlu3wxc26jounofs5iez75qaqa',
                    },
                },
            });
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const action = await cko.workflows.addAction('wf_c7svxlvo2bbuva4f6s3xu4f7wm', {
            type: 'webhook',
            url: 'https://example.com/webhooks',
        });
        expect(action.id).to.equal('wfa_wlu3wxc26jounofs5iez75qaqa');
    });

    it('should throw AuthenticationError when adding an action with invalid credentials', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/wf_c7svxlvo2bbuva4f6s3xu4f7wm/actions/')
            .reply(401);

        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );

        try {
            await cko.workflows.addAction('wf_c7svxlvo2bbuva4f6s3xu4f7wm', {
                type: 'webhook',
                url: 'https://example.com/webhooks',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw NotFoundError when adding an action to a non-existent workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/wf_nonexistent/actions/')
            .reply(404);

        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );

        try {
            await cko.workflows.addAction('wf_nonexistent', {
                type: 'webhook',
                url: 'https://example.com/webhooks',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should throw an error for server issues when adding an action', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/wfa_wlu3wxc26jounofs5iez75qaqa/actions/')
            .reply(500);

        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );

        try {
            await cko.workflows.addAction('wfa_wlu3wxc26jounofs5iez75qaqa', {
                type: 'webhook',
                url: 'https://example.com/webhooks',
            });
        } catch (err) {
            expect(err.http_code).to.equal(500);
        }
    });

    it('should update a workflow action', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .put('/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/actions/wfa_5qxwp7stgcqufj63mkr42xyeqi')
            .reply(200);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.updateAction(
            'wf_2i7z3lwdoe5uzmomm7yzrytqdy',
            'wfa_5qxwp7stgcqufj63mkr42xyeqi',
            {
                type: 'webhook',
                url: 'https://example.com/updated',
            }
        );
        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when updating a workflow action', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .put('/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/actions/wfa_5qxwp7stgcqufj63mkr42xyeqi')
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.updateAction(
                'wf_2i7z3lwdoe5uzmomm7yzrytqdy',
                'wfa_5qxwp7stgcqufj63mkr42xyeqi',
                {
                    type: 'webhook',
                    url: 'https://example.com/updated',
                }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should remove a workflow action', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .delete('/workflows/wf_rou7m32mhmyeblg4xebx5pueoi/actions/wfa_c7svxlvo2bbuva4f6s3xu4f7wm')
            .reply(204);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.removeAction(
            'wf_rou7m32mhmyeblg4xebx5pueoi',
            'wfa_c7svxlvo2bbuva4f6s3xu4f7wm'
        );
        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when removing a workflow action', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .delete('/workflows/wf_rou7m32mhmyeblg4xebx5pueoi/actions/wfa_c7svxlvo2bbuva4f6s3xu4f7wm')
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.removeAction(
                'wf_rou7m32mhmyeblg4xebx5pueoi',
                'wfa_c7svxlvo2bbuva4f6s3xu4f7wm'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

});

describe('Workflow Conditions', () => {

    it('should add a workflow condition', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/conditions/')
            .reply(201, {
                id: 'wfc_wlu3wxc26jounofs5iez75qaqa',
                _links: {
                    self: {
                        href: 'https://api.checkout.com/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/conditions/wfc_wlu3wxc26jounofs5iez75qaqa',
                    },
                },
            });

        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const condition = await cko.workflows.addCondition('wf_2i7z3lwdoe5uzmomm7yzrytqdy', {
            type: 'event',
            events: {
                gateway: ['payment_approved', 'payment_declined'],
            },
        });
        expect(condition.id).to.equal('wfc_wlu3wxc26jounofs5iez75qaqa');
    });

    it('should throw AuthenticationError when adding a condition with invalid credentials', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/conditions/')
            .reply(401);

        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );

        try {
            await cko.workflows.addCondition('wf_2i7z3lwdoe5uzmomm7yzrytqdy', {
                type: 'event',
                events: {
                    gateway: ['payment_approved', 'payment_declined'],
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw NotFoundError when adding a condition to a non-existent workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/wf_nonexistent/conditions/')
            .reply(404);

        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );

        try {
            await cko.workflows.addCondition('wf_nonexistent', {
                type: 'event',
                events: {
                    gateway: ['payment_approved', 'payment_declined'],
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should throw an error for server issues when adding a condition', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/conditions/')
            .reply(500);

        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );

        try {
            await cko.workflows.addCondition('wf_2i7z3lwdoe5uzmomm7yzrytqdy', {
                type: 'event',
                events: {
                    gateway: ['payment_approved', 'payment_declined'],
                },
            });
        } catch (err) {
            expect(err.http_code).to.equal(500);
        }
    });

    it('should update a workflow condition', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .put(
                '/workflows/wf_c7svxlvo2bbuva4f6s3xu4f7wm/conditions/wfc_d5estuyxzshubhly2wu3hloehi'
            )
            .reply(200, {});
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.updateCondition(
            'wf_c7svxlvo2bbuva4f6s3xu4f7wm',
            'wfc_d5estuyxzshubhly2wu3hloehi',
            {
                type: 'event',
                events: {
                    gateway: ['card_verification_declined', 'card_verified', 'payment_approved'],
                },
            }
        );
        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when updating a workflow condition', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .put(
                '/workflows/wf_c7svxlvo2bbuva4f6s3xu4f7wm/conditions/wfc_d5estuyxzshubhly2wu3hloehi'
            )
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.updateCondition(
                'wf_c7svxlvo2bbuva4f6s3xu4f7wm',
                'wfc_d5estuyxzshubhly2wu3hloehi',
                {
                    type: 'event',
                    events: {
                        gateway: [
                            'card_verification_declined',
                            'card_verified',
                            'payment_approved',
                        ],
                    },
                }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should remove a workflow condition', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token')
        .reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .delete('/workflows/wf_c7svxlvo2bbuva4f6s3xu4f7wm/conditions/wfc_c7svxlvo2bbuva4f6s3xu4f7wm')
            .reply(204);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.removeCondition(
            'wf_c7svxlvo2bbuva4f6s3xu4f7wm',
            'wfc_c7svxlvo2bbuva4f6s3xu4f7wm'
        );
        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when removing a workflow condition', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .delete('/workflows/wf_c7svxlvo2bbuva4f6s3xu4f7wm/conditions/wfc_c7svxlvo2bbuva4f6s3xu4f7wm')
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.removeCondition(
                'wf_c7svxlvo2bbuva4f6s3xu4f7wm',
                'wfc_c7svxlvo2bbuva4f6s3xu4f7wm'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

});

describe('Workflow Test', () => {

    it('should test a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post(
                '/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/test'
            )
            .reply(204);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.test(
            'wf_2i7z3lwdoe5uzmomm7yzrytqdy',
            {
                "event_types": [
                  "payment_approved",
                  "payment_declined",
                  "card_verification_declined",
                  "card_verified",
                  "payment_authorization_incremented",
                  "payment_authorization_increment_declined",
                  "payment_capture_declined",
                  "payment_captured",
                  "payment_refund_declined",
                  "payment_refunded",
                  "payment_void_declined",
                  "payment_voided",
                  "dispute_canceled",
                  "dispute_evidence_required",
                  "dispute_expired",
                  "dispute_lost",
                  "dispute_resolved",
                  "dispute_won"
                ]
              }
        );

        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when testing a workflow with invalid credentials', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/test')
            .reply(401);
    
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
    
        try {
            await cko.workflows.test('wf_2i7z3lwdoe5uzmomm7yzrytqdy', {
                "event_types": ["payment_approved", "payment_declined"]
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
    
    it('should throw NotFoundError when testing a non-existent workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/wf_nonexistent/test')
            .reply(404);
    
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
    
        try {
            await cko.workflows.test('wf_nonexistent', {
                "event_types": ["payment_approved", "payment_declined"]
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
    
    it('should throw an error for server issues when testing a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/test')
            .reply(500);
    
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
    
        try {
            await cko.workflows.test('wf_2i7z3lwdoe5uzmomm7yzrytqdy', {
                "event_types": ["payment_approved", "payment_declined"]
            });
        } catch (err) {
            expect(err.http_code).to.equal(500);
        }
    });

});

describe('Workflow Events', () => {

    it('should get event types', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/event-types')
            .reply(200, [
                {
                    id: 'dispute',
                    display_name: 'Disputes',
                    description: 'Disputes Integration',
                    events: [[Object]],
                },
            ]);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.getEventTypes();
        expect(workflows[0].id).to.equal('dispute');
    });

    it('should throw AuthenticationError when get a workflow event', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com').get('/workflows/event-types').reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.getEventTypes();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get an event', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka')
            .reply(200, {
                id: 'evt_hsfxtjwidv6ulah5gdbiqwqnka',
                source: 'gateway',
                type: 'payment_approved',
            });
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.getEvent('evt_hsfxtjwidv6ulah5gdbiqwqnka');

        expect(workflows.id).to.equal('evt_hsfxtjwidv6ulah5gdbiqwqnka');
    });

    it('should throw AuthenticationError when get a workflow event', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka')
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.getEvent('evt_hsfxtjwidv6ulah5gdbiqwqnka');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

});

describe('Workflow Action Invocations', () => {

    it('should get action invocations', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/evt_az5sblvku4ge3dwpztvyizgcau/actions/wfa_uzkxpffkvpiu5fe3h5ira7sqpa')
            .reply(200, {
                workflow_id: 'wf_c7svxlvo2bbuva4f6s3xu4f7wm',
                event_id: 'evt_az5sblvku4ge3dwpztvyizgcau',
                workflow_action_id: 'wfa_uzkxpffkvpiu5fe3h5ira7sqpa',
                action_type: 'webhook',
                status: 'successful',
                action_invocations: [
                    {
                        invocation_id: 'ivc_az5sblvku4ge3dwpztvyizgcau',
                        timestamp: '2019-05-23T08:26:59Z',
                        retry: false,
                        succeeded: true,
                        final: true,
                        result_details: {
                            status_code: 200,
                            url: 'https://example.com/webhooks',
                            headers: {},
                            response_received_timestamp: '2019-05-23T08:27:01Z',
                        }
                    },
                    {
                        invocation_id: 'ivc_az5sblvku4ge3dwpztvyizgcau',
                        timestamp: '2019-05-23T08:27:01Z',
                        retry: true,
                        succeeded: false,
                        final: false,
                        result_details: {
                            status_code: 500,
                            url: 'https://example.com/webhooks',
                            headers: {},
                            response_received_timestamp: '2019-05-23T08:27:01Z',
                        }
                    },
                ],
            });
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.getActionInvocations('evt_az5sblvku4ge3dwpztvyizgcau', 'wfa_uzkxpffkvpiu5fe3h5ira7sqpa');

        expect(workflows.workflow_id).to.equal('wf_c7svxlvo2bbuva4f6s3xu4f7wm');
        expect(workflows.event_id).to.equal('evt_az5sblvku4ge3dwpztvyizgcau');
        expect(workflows.workflow_action_id).to.equal('wfa_uzkxpffkvpiu5fe3h5ira7sqpa');
    });

    it('should throw AuthenticationError when get an action invocation', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/evt_az5sblvku4ge3dwpztvyizgcau/actions/wfa_uzkxpffkvpiu5fe3h5ira7sqpa')
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.getActionInvocations('evt_az5sblvku4ge3dwpztvyizgcau', 'wfa_uzkxpffkvpiu5fe3h5ira7sqpa');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

});

describe('Workflow Reflows', () => {

    it('should reflow by event', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka/reflow')
            .reply(202);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.reflowByEvent('evt_hsfxtjwidv6ulah5gdbiqwqnka');
        
        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when reflowing by event id', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka/reflow')
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.reflowByEvent('evt_hsfxtjwidv6ulah5gdbiqwqnka');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should reflow by event and workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post(
                '/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka/workflow/wf_6p73pesh75vu7fqo6p6exhpe54/reflow'
            )
            .reply(202);

        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.reflowByEventAndWorkflow(
            'evt_hsfxtjwidv6ulah5gdbiqwqnka',
            'wf_6p73pesh75vu7fqo6p6exhpe54'
        );

        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when reflowing by event and workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token')
        .reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post(
                '/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka/workflow/wf_6p73pesh75vu7fqo6p6exhpe54/reflow'
            )
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.reflowByEventAndWorkflow(
                'evt_hsfxtjwidv6ulah5gdbiqwqnka',
                'wf_6p73pesh75vu7fqo6p6exhpe54'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should reflow events by event and workflow ids', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token')
        .reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com').post('/workflows/events/reflow')
        .reply(202);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.reflowEventsByEventAndWorkflowIds(
            ['evt_hsfxtjwidv6ulah5gdbiqwqnka'],
            ['wf_6p73pesh75vu7fqo6p6exhpe54']
        );

        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when reflowing events by event and workflow ids', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token')
        .reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com').post('/workflows/events/reflow')
        .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.reflowEventsByEventAndWorkflowIds(
                ['evt_hsfxtjwidv6ulah5gdbiqwqnka'],
                ['wf_6p73pesh75vu7fqo6p6exhpe54']
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should reflow events by subject and workflow ids', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token')
        .reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com').post('/workflows/events/reflow')
        .reply(202);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.reflowEventsBySubjectAndWorkflowIds(
            ['pay_ymhp72mhubcejmjjwcupzalm5e'],
            ['wf_6p73pesh75vu7fqo6p6exhpe54']
        );

        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when reflowing events by subject and workflow ids', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com').post('/workflows/events/reflow')
        .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.reflowEventsBySubjectAndWorkflowIds(
                ['pay_ymhp72mhubcejmjjwcupzalm5e'],
                ['wf_6p73pesh75vu7fqo6p6exhpe54']
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

});

describe('Workflow Subjects', () => {

    it('should get subject events', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e')
            .reply(200, {
                data: [
                    {
                        id: 'evt_hsfxtjwidv6ulah5gdbiqwqnka',
                        type: 'payment_approved',
                        timestamp: '2022-01-03T19:51:16.022+00:00',
                        _links: [Object],
                    },
                ],
            });
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.getSubjectEvents('pay_ymhp72mhubcejmjjwcupzalm5e');
        expect(workflows.data[0].type).to.equal('payment_approved');
    });

    it('should throw AuthenticationError when getting subject events', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e')
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.getSubjectEvents('pay_ymhp72mhubcejmjjwcupzalm5e');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should reflow by subject', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e/reflow')
            .reply(202);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.reflowBySubject('pay_ymhp72mhubcejmjjwcupzalm5e');
        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when reflowing by subject', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e/reflow')
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.reflowBySubject('pay_ymhp72mhubcejmjjwcupzalm5e');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should reflow by subject and workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post(
                '/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e/workflow/wf_6p73pesh75vu7fqo6p6exhpe54/reflow'
            )
            .reply(202);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        const workflows = await cko.workflows.reflowBySubjectAndWorkflow(
            'pay_ymhp72mhubcejmjjwcupzalm5e',
            'wf_6p73pesh75vu7fqo6p6exhpe54'
        );
        expect(workflows).to.deep.equal({});
    });

    it('should throw AuthenticationError when reflowing by subject and workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['flow', 'flow:workflows'],
        });
        nock('https://api.sandbox.checkout.com')
            .post(
                '/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e/workflow/wf_6p73pesh75vu7fqo6p6exhpe54/reflow'
            )
            .reply(401);
        const cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow', 'flow:workflows'],
                environment: 'sandbox',
            }
        );
        try {
            await cko.workflows.reflowBySubjectAndWorkflow(
                'pay_ymhp72mhubcejmjjwcupzalm5e',
                'wf_6p73pesh75vu7fqo6p6exhpe54'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
