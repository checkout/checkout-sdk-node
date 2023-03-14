import {
    BadGateway,
    TooManyRequestsError,
    ValidationError,
    ValueError,
    AuthenticationError,
    NotFoundError,
    ActionNotAllowed,
    UrlAlreadyRegistered,
} from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

describe('Workflows', () => {
    it('should get all workflows', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows')
            .reply(201, {
                data: [
                    {
                        id: 'wf_ufvajwyu2gyubkkge6y7c3oui4',
                        name: 'SITE4',
                        _links: [Object],
                    },
                    {
                        id: 'wf_vsmdljusa3felalfww7tegllyi',
                        name: 'test',
                        _links: [Object],
                    },
                ],
            });
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.getAll();
        expect(workflows.data).to.exist;
    });

    it('should throw AuthenticationError when getting all worflows', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com').get('/workflows').reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.getAll();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should add a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows')
            .reply(201, {
                id: 'wf_cllqo2rsrp2evenxnzbl23n4mm',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/workflows/wf_cllqo2rsrp2evenxnzbl23n4mm',
                    },
                },
            });
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.add({
            name: 'Webhooks workflow',
            conditions: [
                {
                    type: 'event',
                    events: {
                        gateway: ['payment_approved', 'payment_declined'],
                    },
                },
                {
                    type: 'entity',
                    entities: ['ent_djigcqx4clmufo2sasgomgpqsq'],
                },
                {
                    type: 'processing_channel',
                    processing_channels: ['pc_zs5fqhybzc2e3jmq3efvybybpq'],
                },
            ],
            actions: [
                {
                    type: 'webhook',
                    url: 'https://example.com/webhooks',
                    headers: {
                        Authorization: '70ed20ff-ba31-4ea3-b3ef-772f2be1cbdf',
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
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com').post('/workflows').reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.add({
                name: 'Webhooks workflow',
                conditions: [
                    {
                        type: 'event',
                        events: {
                            gateway: ['payment_approved', 'payment_declined'],
                        },
                    },
                    {
                        type: 'entity',
                        entities: ['ent_djigcqx4clmufo2sasgomgpqsq'],
                    },
                    {
                        type: 'processing_channel',
                        processing_channels: ['pc_zs5fqhybzc2e3jmq3efvybybpq'],
                    },
                ],
                actions: [
                    {
                        type: 'webhook',
                        url: 'https://example.com/webhooks',
                        headers: {
                            Authorization: '70ed20ff-ba31-4ea3-b3ef-772f2be1cbdf',
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
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/wf_5zm7uccsc6bencaujumvutvfem')
            .reply(201, {
                id: 'wf_5zm7uccsc6bencaujumvutvfem',
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
                        href: 'https://api.sandbox.checkout.com/workflows/wf_5zm7uccsc6bencaujumvutvfem',
                    },
                },
            });
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.get('wf_5zm7uccsc6bencaujumvutvfem');
        expect(workflows.id).to.exist;
    });

    it('should throw AuthenticationError when getting a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/wf_5zm7uccsc6bencaujumvutvfem')
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.get('wf_5zm7uccsc6bencaujumvutvfem');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should remove a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .delete('/workflows/wf_rou7m32mhmyeblg4xebx5pueoi')
            .reply(201, {});
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.remove('wf_rou7m32mhmyeblg4xebx5pueoi');
    });

    it('should throw AuthenticationError when removing a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .delete('/workflows/wf_rou7m32mhmyeblg4xebx5pueoi')
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.remove('wf_rou7m32mhmyeblg4xebx5pueoi');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should patch a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .patch('/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy')
            .reply(201, { name: 'Webhooks workflow updated' });
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.patch('wf_2i7z3lwdoe5uzmomm7yzrytqdy', {
            name: 'Webhooks workflow updated',
        });
        expect(workflows.name).to.equal('Webhooks workflow updated');
    });

    it('should throw AuthenticationError when patching a workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .patch('/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy')
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.patch('wf_2i7z3lwdoe5uzmomm7yzrytqdy', {
                name: 'Webhooks workflow updated',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should update a workflow action', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .put('/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/actions/wfa_5qxwp7stgcqufj63mkr42xyeqi')
            .reply(201, {});
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.updateAction(
            'wf_2i7z3lwdoe5uzmomm7yzrytqdy',
            'wfa_5qxwp7stgcqufj63mkr42xyeqi',
            {
                type: 'webhook',
                url: 'https://example.com/updated',
            }
        );
    });

    it('should throw AuthenticationError when updating a workflow action', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .put('/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/actions/wfa_5qxwp7stgcqufj63mkr42xyeqi')
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.updateAction(
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

    it('should update a workflow condition', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .put(
                '/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/conditions/wfc_ybu4t6aruwju5l6ymlc67ya5ne'
            )
            .reply(201, {});
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.updateCondition(
            'wf_2i7z3lwdoe5uzmomm7yzrytqdy',
            'wfc_ybu4t6aruwju5l6ymlc67ya5ne',
            {
                type: 'event',
                events: {
                    gateway: ['card_verification_declined', 'card_verified', 'payment_approved'],
                },
            }
        );
    });

    it('should throw AuthenticationError when XXXXXX', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .put(
                '/workflows/wf_2i7z3lwdoe5uzmomm7yzrytqdy/conditions/wfc_ybu4t6aruwju5l6ymlc67ya5ne'
            )
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.updateCondition(
                'wf_2i7z3lwdoe5uzmomm7yzrytqdy',
                'wfc_ybu4t6aruwju5l6ymlc67ya5ne',
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

    it('should get event types', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/event-types')
            .reply(201, [
                {
                    id: 'dispute',
                    display_name: 'Disputes',
                    description: 'Disputes Integration',
                    events: [[Object]],
                },
            ]);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.getEventTypes();
        expect(workflows[0].id).to.equal('dispute');
    });

    it('should throw AuthenticationError when XXXXXX', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com').get('/workflows/event-types').reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.getEventTypes();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get an event', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka')
            .reply(201, {
                id: 'evt_hsfxtjwidv6ulah5gdbiqwqnka',
                source: 'gateway',
                type: 'payment_approved',
            });
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.getEvent('evt_hsfxtjwidv6ulah5gdbiqwqnka');

        expect(workflows.id).to.equal('evt_hsfxtjwidv6ulah5gdbiqwqnka');
    });

    it('should throw AuthenticationError when XXXXXX', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka')
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.getEvent('evt_hsfxtjwidv6ulah5gdbiqwqnka');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get action invocations', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/evt_az5sblvku4ge3dwpztvyizgcau/actions/wfa_uzkxpffkvpiu5fe3h5ira7sqpa')
            .reply(201, {
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
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.getActionInvocations('evt_az5sblvku4ge3dwpztvyizgcau', 'wfa_uzkxpffkvpiu5fe3h5ira7sqpa');

        expect(workflows.workflow_id).to.equal('wf_c7svxlvo2bbuva4f6s3xu4f7wm');
        expect(workflows.event_id).to.equal('evt_az5sblvku4ge3dwpztvyizgcau');
        expect(workflows.workflow_action_id).to.equal('wfa_uzkxpffkvpiu5fe3h5ira7sqpa');
    });

    it('should throw AuthenticationError when XXXXXX', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/evt_az5sblvku4ge3dwpztvyizgcau/actions/wfa_uzkxpffkvpiu5fe3h5ira7sqpa')
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.getActionInvocations('evt_az5sblvku4ge3dwpztvyizgcau', 'wfa_uzkxpffkvpiu5fe3h5ira7sqpa');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should reflow by event', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka/reflow')
            .reply(201, {});
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.reflowByEvent('evt_hsfxtjwidv6ulah5gdbiqwqnka');
    });

    it('should throw AuthenticationError when reflowing by event id', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka/reflow')
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.reflowByEvent('evt_hsfxtjwidv6ulah5gdbiqwqnka');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should reflow by event and workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post(
                '/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka/workflow/wf_6p73pesh75vu7fqo6p6exhpe54/reflow'
            )
            .reply(201, {});

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.reflowByEventAndWorkflow(
            'evt_hsfxtjwidv6ulah5gdbiqwqnka',
            'wf_6p73pesh75vu7fqo6p6exhpe54'
        );
    });

    it('should throw AuthenticationError when reflowing by event and workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post(
                '/workflows/events/evt_hsfxtjwidv6ulah5gdbiqwqnka/workflow/wf_6p73pesh75vu7fqo6p6exhpe54/reflow'
            )
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.reflowByEventAndWorkflow(
                'evt_hsfxtjwidv6ulah5gdbiqwqnka',
                'wf_6p73pesh75vu7fqo6p6exhpe54'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should reflow events by event and workflow ids', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com').post('/workflows/events/reflow').reply(201, {});
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.reflowEventsByEventAndWorkflowIds(
            ['evt_hsfxtjwidv6ulah5gdbiqwqnka'],
            ['wf_6p73pesh75vu7fqo6p6exhpe54']
        );
    });

    it('should throw AuthenticationError when reflowing events by event and workflow ids', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com').post('/workflows/events/reflow').reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.reflowEventsByEventAndWorkflowIds(
                ['evt_hsfxtjwidv6ulah5gdbiqwqnka'],
                ['wf_6p73pesh75vu7fqo6p6exhpe54']
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should reflow events by subject and workflow ids', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com').post('/workflows/events/reflow').reply(201, {});
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.reflowEventsBySubjectAndWorkflowIds(
            ['pay_ymhp72mhubcejmjjwcupzalm5e'],
            ['wf_6p73pesh75vu7fqo6p6exhpe54']
        );
    });

    it('should throw AuthenticationError when reflowing events by subject and workflow ids', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com').post('/workflows/events/reflow').reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.reflowEventsBySubjectAndWorkflowIds(
                ['pay_ymhp72mhubcejmjjwcupzalm5e'],
                ['wf_6p73pesh75vu7fqo6p6exhpe54']
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get subject events', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e')
            .reply(201, {
                data: [
                    {
                        id: 'evt_hsfxtjwidv6ulah5gdbiqwqnka',
                        type: 'payment_approved',
                        timestamp: '2022-01-03T19:51:16.022+00:00',
                        _links: [Object],
                    },
                ],
            });
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.getSubjectEvents('pay_ymhp72mhubcejmjjwcupzalm5e');
        expect(workflows.data[0].type).to.equal('payment_approved');
    });

    it('should throw AuthenticationError when getting subject events', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e')
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.getSubjectEvents('pay_ymhp72mhubcejmjjwcupzalm5e');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should reflow by subject', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e/reflow')
            .reply(201, {});
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.reflowBySubject('pay_ymhp72mhubcejmjjwcupzalm5e');
    });

    it('should throw AuthenticationError when reflowing by subject', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e/reflow')
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.reflowBySubject('pay_ymhp72mhubcejmjjwcupzalm5e');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should reflow by subject and workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post(
                '/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e/workflow/wf_6p73pesh75vu7fqo6p6exhpe54/reflow'
            )
            .reply(201, {});
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        let workflows = await cko.workflows.reflowBySubjectAndWorkflow(
            'pay_ymhp72mhubcejmjjwcupzalm5e',
            'wf_6p73pesh75vu7fqo6p6exhpe54'
        );
    });

    it('should throw AuthenticationError when reflowing by subject and workflow', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://api.sandbox.checkout.com')
            .post(
                '/workflows/events/subject/pay_ymhp72mhubcejmjjwcupzalm5e/workflow/wf_6p73pesh75vu7fqo6p6exhpe54/reflow'
            )
            .reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['flow'],
                environment: 'sandbox',
            }
        );
        try {
            let workflows = await cko.workflows.reflowBySubjectAndWorkflow(
                'pay_ymhp72mhubcejmjjwcupzalm5e',
                'wf_6p73pesh75vu7fqo6p6exhpe54'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
