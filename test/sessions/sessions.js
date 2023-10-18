import { AuthenticationError, } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

describe('Sessions', () => {
    it('should create session', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });

        nock('https://api.sandbox.checkout.com')
            .post('/sessions')
            .reply(201, {
                id: 'sid_jlfm4ithpgpefdxgzzdnc3xrc4',
                transaction_id: '22ceca4a-7967-429e-8ee6-ce46d16ef117',
                amount: 100,
                currency: 'USD',
                completed: false,
                authentication_type: 'regular',
                authentication_category: 'payment',
                status: 'pending',
                protocol_version: '2.1.0',
                reference: 'ORD-5023-4E89',
                next_actions: ['collect_channel_data', 'issuer_fingerprint'],
                transaction_type: 'goods_service',
                session_secret: 'sek_SuNKcyJPEcCWGvJcKb2/86RVZ5pzM6SxHPefj0uQG7o=',
                scheme: 'visa',
                card: {
                    instrument_id: 'src_nnx54wa2fggejbsqf6d27flodu',
                    fingerprint: '35DA711E85648C054705A83122F3AA1F653840FBA8BE7268A906BF3B3757D4F6',
                    metadata: {},
                },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4',
                    },
                    issuer_fingerprint: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4/issuer-fingerprint',
                    },
                    collect_channel_data: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4/collect-data',
                    },
                    three_ds_method_url: {
                        href: 'https://3ds2-sandbox.ckotech.co/simulator/acs/3ds-method',
                    },
                    callback_url: { href: 'https://example.com/sessions/callback' },
                },
            });

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['sessions:browser'],
                environment: 'sandbox',
            }
        );
        let session = await cko.sessions.request({
            source: {
                type: 'card',
                number: '4485040371536584',
                expiry_month: 1,
                expiry_year: 2030,
            },
            amount: 100,
            currency: 'USD',
            authentication_type: 'regular',
            authentication_category: 'payment',
            challenge_indicator: 'no_preference',
            reference: 'ORD-5023-4E89',
            transaction_type: 'goods_service',
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
            shipping_address: {
                address_line1: 'Checkout.com',
                address_line2: '90 Tottenham Court Road',
                city: 'London',
                state: 'GB',
                zip: 'W1T 4TJ',
                country: 'GB',
            },
            completion: {
                type: 'non_hosted',
                callback_url: 'https://example.com/sessions/callback',
            },
        });

        expect(session.status).to.equal('pending');
    });

    it('should throw AuthenticationError creating session', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });
        nock('https://api.sandbox.checkout.com').post('/sessions').reply(401);

        try {
            let cko = new Checkout(
                '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
                {
                    client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                    scope: ['sessions:browser'],
                    environment: 'sandbox',
                }
            );
            let session = await cko.sessions.request({
                source: {
                    type: 'card',
                    number: '4485040371536584',
                    expiry_month: 1,
                    expiry_year: 2030,
                },
                amount: 100,
                currency: 'USD',
                authentication_type: 'regular',
                authentication_category: 'payment',
                challenge_indicator: 'no_preference',
                reference: 'ORD-5023-4E89',
                transaction_type: 'goods_service',
                processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
                shipping_address: {
                    address_line1: 'Checkout.com',
                    address_line2: '90 Tottenham Court Road',
                    city: 'London',
                    state: 'GB',
                    zip: 'W1T 4TJ',
                    country: 'GB',
                },
                completion: {
                    type: 'non_hosted',
                    callback_url: 'https://example.com/sessions/callback',
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get session', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });

        nock('https://api.sandbox.checkout.com')
            .post('/sessions')
            .reply(201, {
                id: 'sid_jlfm4ithpgpefdxgzzdnc3xrc4',
                transaction_id: '22ceca4a-7967-429e-8ee6-ce46d16ef117',
                amount: 100,
                currency: 'USD',
                completed: false,
                authentication_type: 'regular',
                authentication_category: 'payment',
                status: 'pending',
                protocol_version: '2.1.0',
                reference: 'ORD-5023-4E89',
                next_actions: ['collect_channel_data', 'issuer_fingerprint'],
                transaction_type: 'goods_service',
                session_secret: 'sek_SuNKcyJPEcCWGvJcKb2/86RVZ5pzM6SxHPefj0uQG7o=',
                scheme: 'visa',
                card: {
                    instrument_id: 'src_nnx54wa2fggejbsqf6d27flodu',
                    fingerprint: '35DA711E85648C054705A83122F3AA1F653840FBA8BE7268A906BF3B3757D4F6',
                    metadata: {},
                },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4',
                    },
                    issuer_fingerprint: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4/issuer-fingerprint',
                    },
                    collect_channel_data: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4/collect-data',
                    },
                    three_ds_method_url: {
                        href: 'https://3ds2-sandbox.ckotech.co/simulator/acs/3ds-method',
                    },
                    callback_url: { href: 'https://example.com/sessions/callback' },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .get('/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4')
            .reply(201, {
                id: 'sid_jlfm4ithpgpefdxgzzdnc3xrc4',
                transaction_id: '22ceca4a-7967-429e-8ee6-ce46d16ef117',
                amount: 100,
                currency: 'USD',
                completed: false,
                authentication_type: 'regular',
                authentication_category: 'payment',
                status: 'pending',
                protocol_version: '2.1.0',
                reference: 'ORD-5023-4E89',
                next_actions: ['collect_channel_data', 'issuer_fingerprint'],
                transaction_type: 'goods_service',
                session_secret: 'sek_SuNKcyJPEcCWGvJcKb2/86RVZ5pzM6SxHPefj0uQG7o=',
                scheme: 'visa',
                card: {
                    instrument_id: 'src_nnx54wa2fggejbsqf6d27flodu',
                    fingerprint: '35DA711E85648C054705A83122F3AA1F653840FBA8BE7268A906BF3B3757D4F6',
                    metadata: {},
                },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4',
                    },
                    issuer_fingerprint: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4/issuer-fingerprint',
                    },
                    collect_channel_data: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4/collect-data',
                    },
                    three_ds_method_url: {
                        href: 'https://3ds2-sandbox.ckotech.co/simulator/acs/3ds-method',
                    },
                    callback_url: { href: 'https://example.com/sessions/callback' },
                },
            });

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['sessions:browser'],
                environment: 'sandbox',
            }
        );
        let session = await cko.sessions.request({
            source: {
                type: 'card',
                number: '4485040371536584',
                expiry_month: 1,
                expiry_year: 2030,
            },
            amount: 100,
            currency: 'USD',
            authentication_type: 'regular',
            authentication_category: 'payment',
            challenge_indicator: 'no_preference',
            reference: 'ORD-5023-4E89',
            transaction_type: 'goods_service',
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
            shipping_address: {
                address_line1: 'Checkout.com',
                address_line2: '90 Tottenham Court Road',
                city: 'London',
                state: 'GB',
                zip: 'W1T 4TJ',
                country: 'GB',
            },
            completion: {
                type: 'non_hosted',
                callback_url: 'https://example.com/sessions/callback',
            },
        });

        let getSession = await cko.sessions.get(session.id);
        expect(session.status).to.equal('pending');
    });

    it('should throw AuthenticationError getting the session', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });
        nock('https://api.sandbox.checkout.com')
            .get('/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4')
            .reply(401);

        try {
            let cko = new Checkout(
                '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
                {
                    client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                    scope: ['sessions:browser'],
                    environment: 'sandbox',
                }
            );
            let session = await cko.sessions.get('sid_jlfm4ithpgpefdxgzzdnc3xrc4');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should update session', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });

        nock('https://api.sandbox.checkout.com')
            .post('/sessions')
            .reply(201, {
                id: 'sid_jlfm4ithpgpefdxgzzdnc3xrc4',
                transaction_id: '22ceca4a-7967-429e-8ee6-ce46d16ef117',
                amount: 100,
                currency: 'USD',
                completed: false,
                authentication_type: 'regular',
                authentication_category: 'payment',
                status: 'pending',
                protocol_version: '2.1.0',
                reference: 'ORD-5023-4E89',
                next_actions: ['collect_channel_data', 'issuer_fingerprint'],
                transaction_type: 'goods_service',
                session_secret: 'sek_SuNKcyJPEcCWGvJcKb2/86RVZ5pzM6SxHPefj0uQG7o=',
                scheme: 'visa',
                card: {
                    instrument_id: 'src_nnx54wa2fggejbsqf6d27flodu',
                    fingerprint: '35DA711E85648C054705A83122F3AA1F653840FBA8BE7268A906BF3B3757D4F6',
                    metadata: {},
                },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4',
                    },
                    issuer_fingerprint: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4/issuer-fingerprint',
                    },
                    collect_channel_data: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_jlfm4ithpgpefdxgzzdnc3xrc4/collect-data',
                    },
                    three_ds_method_url: {
                        href: 'https://3ds2-sandbox.ckotech.co/simulator/acs/3ds-method',
                    },
                    callback_url: { href: 'https://example.com/sessions/callback' },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .put('/sessions/sid_rwhwl4kb3eeenglibbvej2qtdy/collect-data')
            .reply(201, {
                id: 'sid_rwhwl4kb3eeenglibbvej2qtdy',
                transaction_id: 'f1658f8d-d941-4608-9968-086a44ea131e',
                amount: 100,
                currency: 'USD',
                completed: false,
                authentication_type: 'regular',
                authentication_category: 'payment',
                status: 'pending',
                protocol_version: '2.1.0',
                reference: 'ORD-5023-4E89',
                next_actions: ['collect_channel_data', 'issuer_fingerprint'],
                transaction_type: 'goods_service',
                session_secret: 'sek_GA0aqTJdqojvhCk9ZqQO9M2G3q1wpyags5zYWzAdHUg=',
                scheme: 'visa',
                card: {
                    instrument_id: 'src_hftflc3d5ipetjtqwjm5g4h7q4',
                    fingerprint: '35DA711E85648C054705A83122F3AA1F653840FBA8BE7268A906BF3B3757D4F6',
                    metadata: {},
                },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_rwhwl4kb3eeenglibbvej2qtdy',
                    },
                    issuer_fingerprint: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_rwhwl4kb3eeenglibbvej2qtdy/issuer-fingerprint',
                    },
                    collect_channel_data: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_rwhwl4kb3eeenglibbvej2qtdy/collect-data',
                    },
                    three_ds_method_url: {
                        href: 'https://3ds2-sandbox.ckotech.co/simulator/acs/3ds-method',
                    },
                    callback_url: { href: 'https://example.com/sessions/callback' },
                },
            });

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['sessions:browser'],
                environment: 'sandbox',
            }
        );
        let session = await cko.sessions.update('sid_rwhwl4kb3eeenglibbvej2qtdy', {
            channel: 'browser',
            accept_header: 'Accept:  *.*, q=0.1',
            java_enabled: true,
            javascript_enabled: true,
            language: 'FR-fr',
            color_depth: '16',
            screen_height: '1080',
            screen_width: '1920',
            timezone: '60',
            user_agent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            ip_address: '1.12.123.255',
        });

        expect(session.id).to.exist;
    });

    it('should throw AuthenticationError updating the session', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });
        nock('https://api.sandbox.checkout.com')
            .put('/sessions/sid_rwhwl4kb3eeenglibbvej2qtdy/collect-data')
            .reply(401);

        try {
            let cko = new Checkout(
                '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
                {
                    client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                    scope: ['sessions:browser'],
                    environment: 'sandbox',
                }
            );
            let session = await cko.sessions.update('sid_rwhwl4kb3eeenglibbvej2qtdy', {
                channel: 'browser',
                accept_header: 'Accept:  *.*, q=0.1',
                java_enabled: true,
                javascript_enabled: true,
                language: 'FR-fr',
                color_depth: '16',
                screen_height: '1080',
                screen_width: '1920',
                timezone: '60',
                user_agent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
                ip_address: '1.12.123.255',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should complete session', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'sessions:browser',
        });

        nock('https://api.sandbox.checkout.com')
            .post('/sessions')
            .reply(201, {
                id: 'sid_kfa2wttsisdude7acvva4irrfm',
                transaction_id: '4eab4151-4472-4187-93e0-156a0e22312b',
                amount: 100,
                currency: 'USD',
                completed: false,
                authentication_type: 'regular',
                authentication_category: 'payment',
                status: 'approved',
                status_reason: 'ares_status',
                approved: true,
                protocol_version: '2.1.0',
                reference: 'ORD-5023-4E89',
                next_actions: ['complete'],
                ds: {
                    reference_number: '61247f29-63c3-4330-94e2-bf662673',
                    transaction_id: '883c530e-bd4e-4103-8101-e292e1070333',
                },
                acs: {
                    reference_number: 'ac60978c-ddbd-4075-ae7e-b3f6d960',
                    transaction_id: 'e2db6afe-4764-433e-8a3e-0165c3426c63',
                    operator_id: 'cec59323-bfd0-4f49-8fae-a19d268a',
                    challenge_mandated: false,
                },
                response_code: 'Y',
                challenged: false,
                cryptogram: 'AAABAVIREQAAAAAAAAAAAAAAAAA=',
                transaction_type: 'goods_service',
                eci: '05',
                session_secret: 'sek_xX6tEuUe5JAxm0n+cS2Xbd1SX2/YSBoUsO/yyAKw3RM=',
                cardholder_info: 'This is some information for the cardholder',
                scheme: 'visa',
                xid: '4eab4151-4472-4187-93e0-156a0e22312b',
                card: {
                    instrument_id: 'src_zjpwlvpvgnpehn6tdu42loetxi',
                    fingerprint: '35DA711E85648C054705A83122F3AA1F653840FBA8BE7268A906BF3B3757D4F6',
                    metadata: {},
                },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_kfa2wttsisdude7acvva4irrfm',
                    },
                    complete: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_kfa2wttsisdude7acvva4irrfm/complete',
                    },
                    callback_url: {
                        href: 'https://example.com/sessions/callback',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .post('/sessions/sid_j47vcmk3uaaerlv3zv7xhzg6du/complete')
            .reply(201, {});

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['sessions:browser'],
                environment: 'sandbox',
            }
        );
        let session = await cko.sessions.complete('sid_j47vcmk3uaaerlv3zv7xhzg6du');
    });

    it('should throw AuthenticationError complete the session', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });
        nock('https://api.sandbox.checkout.com')
            .post('/sessions/sid_j47vcmk3uaaerlv3zv7xhzg6du/complete')
            .reply(401);

        try {
            let cko = new Checkout(
                '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
                {
                    client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                    scope: ['sessions:browser'],
                    environment: 'sandbox',
                }
            );
            let session = await cko.sessions.complete('sid_j47vcmk3uaaerlv3zv7xhzg6du');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should update session 3DS Method completion indicator', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'sessions:browser',
        });

        nock('https://api.sandbox.checkout.com')
            .post('/sessions')
            .reply(201, {
                id: 'sid_aurdb2b3yv6eniu7mbrl7nfopm',
                transaction_id: '4eab4151-4472-4187-93e0-156a0e22312b',
                amount: 100,
                currency: 'USD',
                completed: false,
                authentication_type: 'regular',
                authentication_category: 'payment',
                status: 'approved',
                status_reason: 'ares_status',
                approved: true,
                protocol_version: '2.1.0',
                reference: 'ORD-5023-4E89',
                next_actions: ['complete'],
                ds: {
                    reference_number: '61247f29-63c3-4330-94e2-bf662673',
                    transaction_id: '883c530e-bd4e-4103-8101-e292e1070333',
                },
                acs: {
                    reference_number: 'ac60978c-ddbd-4075-ae7e-b3f6d960',
                    transaction_id: 'e2db6afe-4764-433e-8a3e-0165c3426c63',
                    operator_id: 'cec59323-bfd0-4f49-8fae-a19d268a',
                    challenge_mandated: false,
                },
                response_code: 'Y',
                challenged: false,
                cryptogram: 'AAABAVIREQAAAAAAAAAAAAAAAAA=',
                transaction_type: 'goods_service',
                eci: '05',
                session_secret: 'sek_xX6tEuUe5JAxm0n+cS2Xbd1SX2/YSBoUsO/yyAKw3RM=',
                cardholder_info: 'This is some information for the cardholder',
                scheme: 'visa',
                xid: '4eab4151-4472-4187-93e0-156a0e22312b',
                card: {
                    instrument_id: 'src_zjpwlvpvgnpehn6tdu42loetxi',
                    fingerprint: '35DA711E85648C054705A83122F3AA1F653840FBA8BE7268A906BF3B3757D4F6',
                    metadata: {},
                },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_kfa2wttsisdude7acvva4irrfm',
                    },
                    complete: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_kfa2wttsisdude7acvva4irrfm/complete',
                    },
                    callback_url: {
                        href: 'https://example.com/sessions/callback',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .put('/sessions/sid_aurdb2b3yv6eniu7mbrl7nfopm/issuer-fingerprint')
            .reply(201, {
                id: 'sid_aurdb2b3yv6eniu7mbrl7nfopm',
                transaction_id: 'e8302205-c53b-467c-a29f-6062bfb4ae7b',
                amount: 100,
                currency: 'USD',
                completed: false,
                authentication_type: 'regular',
                authentication_category: 'payment',
                status: 'approved',
                status_reason: 'ares_status',
                approved: true,
                protocol_version: '2.1.0',
                reference: 'ORD-5023-4E89',
                next_actions: ['complete'],
                ds: {
                    reference_number: '49aa9ecd-70dd-4684-9514-55da4814',
                    transaction_id: '9cf2ea7e-7a1f-4ce2-9846-43eb6cbcbb60',
                },
                acs: {
                    reference_number: 'dc537dc1-b306-49bb-9240-c4a4dfc5',
                    transaction_id: 'd69a62e5-60b5-4bcb-9ec1-883b775528ec',
                    operator_id: '38faab14-46db-44fb-94e8-b5b137d8',
                    challenge_mandated: false,
                },
                response_code: 'Y',
                challenged: false,
                cryptogram: 'AAABAVIREQAAAAAAAAAAAAAAAAA=',
                transaction_type: 'goods_service',
                eci: '05',
                session_secret: 'sek_s2MKmDiFiZ7czJ3l0jFDkaIkaO73henfAyaA5y7TnN0=',
                cardholder_info: 'This is some information for the cardholder',
                scheme: 'visa',
                xid: 'e8302205-c53b-467c-a29f-6062bfb4ae7b',
                card: {
                    instrument_id: 'src_gzukp7rg6o6uriaofop4gzgjxe',
                    fingerprint: '35DA711E85648C054705A83122F3AA1F653840FBA8BE7268A906BF3B3757D4F6',
                    metadata: {},
                },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_aurdb2b3yv6eniu7mbrl7nfopm',
                    },
                    complete: {
                        href: 'https://api.sandbox.checkout.com/sessions/sid_aurdb2b3yv6eniu7mbrl7nfopm/complete',
                    },
                    callback_url: {
                        href: 'https://checkout.com/',
                    },
                },
            });

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['sessions:browser'],
                environment: 'sandbox',
            }
        );
        let session = await cko.sessions.request({
            source: {
                type: 'card',
                number: '4485040371536584',
                expiry_month: 1,
                expiry_year: 2030,
            },
            amount: 100,
            currency: 'USD',
            authentication_type: 'regular',
            authentication_category: 'payment',
            challenge_indicator: 'no_preference',
            reference: 'ORD-5023-4E89',
            transaction_type: 'goods_service',
            shipping_address: {
                address_line1: 'Checkout.com',
                address_line2: '90 Tottenham Court Road',
                city: 'London',
                state: 'GB',
                zip: 'W1T 4TJ',
                country: 'GB',
            },
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
            completion: {
                type: 'non_hosted',
                callback_url: 'https://checkout.com',
            },
            channel_data: {
                channel: 'browser',
                accept_header: 'Accept:  *.*, q=0.1',
                java_enabled: true,
                javascript_enabled: true,
                language: 'FR-fr',
                color_depth: '16',
                screen_height: '1080',
                screen_width: '1920',
                timezone: '60',
                user_agent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
                ip_address: '1.12.123.255',
            },
        });

        let updated = await cko.sessions.update3DSMethodCompletionIndicator(
            'sid_aurdb2b3yv6eniu7mbrl7nfopm',
            'U'
        );

        expect(updated.approved).to.be.true;
    });

    it('should throw AuthenticationError when updating session 3DS Method completion indicator', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'fx',
        });
        nock('https://api.sandbox.checkout.com')
            .put('/sessions/sid_j47vcmk3uaaerlv3zv7xhzg6du/issuer-fingerprint')
            .reply(401);

        try {
            let cko = new Checkout(
                '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
                {
                    client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                    scope: ['sessions:browser'],
                    environment: 'sandbox',
                }
            );
            let updated = await cko.sessions.update3DSMethodCompletionIndicator(
                'sid_j47vcmk3uaaerlv3zv7xhzg6du',
                'U'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
