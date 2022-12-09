import {
    BadGateway,
    TooManyRequestsError,
    ValidationError,
    ValueError,
    AuthenticationError,
    NotFoundError,
    ActionNotAllowed,
} from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Transfers', () => {
    it('should initiate a transfer with static key', async () => {
        nock('https://transfers.sandbox.checkout.com')
            .post('/transfers')
            .reply(201, {
                id: 'tra_lx6isvi4lahkrkn462bj77xnki',
                status: 'pending',
                _links: {
                    self: {
                        href: 'https://transfers.sandbox.checkout.com/transfers/tra_lx6isvi4lahkrkn462bj77xnki',
                    },
                },
            });

        const cko = new Checkout(SK);

        const transfer = await cko.transfers.initiate({
            reference: 'superhero1234',
            transfer_type: 'commission',
            source: {
                id: 'ent_djigcqx4clmufo2sasgomgpqsq',
                amount: 100,
            },
            destination: {
                id: 'ent_fz5knnpfjkceta7kpzlbu6dkt4',
            },
        });

        expect(transfer.status).to.equal('pending');
    });

    it('should use the correct url for prod and send idemportency', async () => {
        nock('https://transfers.checkout.com')
            .post('/transfers')
            .reply(201, {
                id: 'tra_lx6isvi4lahkrkn462bj77xnki',
                status: 'pending',
                _links: {
                    self: {
                        href: 'https://transfers.sandbox.checkout.com/transfers/tra_lx6isvi4lahkrkn462bj77xnki',
                    },
                },
            });

        // fake key
        const cko = new Checkout('sk_o2nulev2arguvyf6w7sc5fkznas');

        const transfer = await cko.transfers.initiate(
            {
                reference: 'superhero1234',
                transfer_type: 'commission',
                source: {
                    id: 'ent_djigcqx4clmufo2sasgomgpqsq',
                    amount: 100,
                },
                destination: {
                    id: 'ent_fz5knnpfjkceta7kpzlbu6dkt4',
                },
            },
            '123456'
        );

        expect(transfer.status).to.equal('pending');
    });

    it('should initiate a transfer with oauth', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token:
                'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFybjphd3M6a21zOmV1LXdlc3QtMTo2ODY0OTY3NDc3MTU6a2V5LzAyYThmYWM5LWE5MjItNGNkNy05MDk1LTg0ZjA5YjllNTliZCIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE2NDA1NTMzNDksImV4cCI6MTY0MDU1Njk0OSwiaXNzIjoiaHR0cHM6Ly9hY2Nlc3Muc2FuZGJveC5jaGVja291dC5jb20iLCJhdWQiOiJnYXRld2F5IiwiY2xpZW50X2lkIjoiYWNrX3Z2emhvYWk0NjZzdTNqM3ZieGI0N3RzNW9lIiwiY2tvX2NsaWVudF9pZCI6ImNsaV9nNnJvZ2IzaGhmZXUzZ2h0eGN2M2J3NHFweSIsImNrb19lbnRpdHlfaWQiOiJlbnRfZGppZ2NxeDRjbG11Zm8yc2FzZ29tZ3Bxc3EiLCJqdGkiOiI3RDRCQTRBNEJBQUYzQ0E5MjYwMzlDRTNGQTc1ODVEMCIsImlhdCI6MTY0MDU1MzM0OSwic2NvcGUiOlsiZ2F0ZXdheSJdfQ.U4S2YQDZtRb5WsKA6P8eiHyoqH_KN_1MabiNG5LAOeyYwRiIdyuzWJlYJg-wJlly84Eo68P1rcEB0Pac90PRiDBfSPNh0rIFJvFrA1fHE95EWjwER8UBvYT6yr-yI4JlrTnjeU6f5mJpxWbuN2ywE36x5eWPBdBs3w_j_x8FU62-UYwPOy5LIyZLR_JRxHMU81r7chOD9113CTGzJG9CGzKDMN53iciLdLPXUCFH2AlLHm9-YFh46WMIz85i4nVG0aKI_fIW9gjsLIvG0j-8shf-k4D1LLP0R3juX6twULVbrDuZqacC0TqGI6bAahVJ37Old74He7Ft6j3cx9Hi8A',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'gateway',
        });

        nock('https://transfers.sandbox.checkout.com')
            .post('/transfers')
            .reply(201, {
                id: 'tra_lx6isvi4lahkrkn462bj77xnki',
                status: 'pending',
                _links: {
                    self: {
                        href: 'https://transfers.sandbox.checkout.com/transfers/tra_lx6isvi4lahkrkn462bj77xnki',
                    },
                },
            });

        let cko = new Checkout(
            'KFXYMa1Nzw0Vt4yXL9aekDNY_uNThoWF8eW4voTZKnjYKwCYBCiunskDeCFvkfaPQB6ui3O25vfzjBjkCfJSCg',
            {
                client: 'ack_kjw76w4uy47uboaiztlpifyj7q',
                scope: ['transfers', 'gateway'], // array of scopes
                environment: 'sandbox', // or "production"
            }
        );

        try {
            const transfer = await cko.transfers.initiate({
                reference: 'superhero1234',
                transfer_type: 'commission',
                source: {
                    id: 'ent_djigcqx4clmufo2sasgomgpqsq',
                    amount: 100,
                },
                destination: {
                    id: 'ent_fz5knnpfjkceta7kpzlbu6dkt4',
                },
            });

            expect(transfer.status).to.equal('pending');
        } catch (error) {
            console.log(error);
        }
    });

    it('should throw authentication error', async () => {
        nock('https://transfers.sandbox.checkout.com').post('/transfers').reply(401);

        try {
            const cko = new Checkout('test');

            const transfer = await cko.transfers.initiate({
                reference: 'superhero1234',
                transfer_type: 'commission',
                source: {
                    id: 'ent_djigcqx4clmufo2sasgomgpqsq',
                    amount: 100,
                },
                destination: {
                    id: 'ent_fz5knnpfjkceta7kpzlbu6dkt4',
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw ValidationError error', async () => {
        nock('https://transfers.sandbox.checkout.com').post('/transfers').reply(422, {});

        try {
            const cko = new Checkout(SK);

            const transfer = await cko.transfers.initiate({
                transfer_type: 'test',
            });
        } catch (err) {
            console.log(err);
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should retrive transfer', async () => {
        nock('https://transfers.sandbox.checkout.com')
            .get('/transfers/tra_lx6isvi4lahkrkn462bj77xnki')
            .reply(200, {
                id: 'tra_lx6isvi4lahkrkn462bj77xnki',
                reference: 'superhero1234',
                requested_on: '2022-12-09T14:12:55.1384233Z',
                status: 'pending',
                transfer_type: 'commission',
                destination: { entity_id: 'ent_fz5knnpfjkceta7kpzlbu6dkt4' },
                reason_codes: [],
                source: { amount: 100, entity_id: 'ent_djigcqx4clmufo2sasgomgpqsq' },
                _links: {
                    self: {
                        href: 'https://transfers.sandbox.checkout.com/transfers/tra_lx6isvi4lahkrkn462bj77xnki',
                    },
                },
            });

        const cko = new Checkout(SK);

        const transfer = await cko.transfers.retrieve('tra_lx6isvi4lahkrkn462bj77xnki');

        expect(transfer.id).to.equal('tra_lx6isvi4lahkrkn462bj77xnki');
    });

    it('should retrive transfer in prod', async () => {
        nock('https://transfers.checkout.com')
            .get('/transfers/tra_lx6isvi4lahkrkn462bj77xnki')
            .reply(200, {
                id: 'tra_lx6isvi4lahkrkn462bj77xnki',
                reference: 'superhero1234',
                requested_on: '2022-12-09T14:12:55.1384233Z',
                status: 'pending',
                transfer_type: 'commission',
                destination: { entity_id: 'ent_fz5knnpfjkceta7kpzlbu6dkt4' },
                reason_codes: [],
                source: { amount: 100, entity_id: 'ent_djigcqx4clmufo2sasgomgpqsq' },
                _links: {
                    self: {
                        href: 'https://transfers.sandbox.checkout.com/transfers/tra_lx6isvi4lahkrkn462bj77xnki',
                    },
                },
            });

        // fake key
        const cko = new Checkout('sk_o2nulev2arguvyf6w7sc5fkznas');

        const transfer = await cko.transfers.retrieve('tra_lx6isvi4lahkrkn462bj77xnki');

        expect(transfer.id).to.equal('tra_lx6isvi4lahkrkn462bj77xnki');
    });

    it('should throw authentication error for retrival', async () => {
        nock('https://transfers.sandbox.checkout.com')
            .get('/transfers/tra_lx6isvi4lahkrkn462bj77xnki')
            .reply(401);

        try {
            const cko = new Checkout('test');

            const transfer = await cko.transfers.retrieve('tra_lx6isvi4lahkrkn462bj77xnki');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw ValidationError error for retrival', async () => {
        nock('https://transfers.sandbox.checkout.com')
            .get('/transfers/123')
            .reply(422, {
                request_id: '8daac099-b8e5-428c-8374-11c9c0f42d2f',
                error_type: 'processing_error',
                error_codes: ['example'],
            });

        try {
            const cko = new Checkout(SK);

            const transfer = await cko.transfers.retrieve('123');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });
});
