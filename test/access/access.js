import { AuthenticationError, } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

describe('Access', () => {
    it('should create access token', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token:
                'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFybjphd3M6a21zOmV1LXdlc3QtMTo2ODY0OTY3NDc3MTU6a2V5LzAyYThmYWM5LWE5MjItNGNkNy05MDk1LTg0ZjA5YjllNTliZCIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE2NDA1NTMzNDksImV4cCI6MTY0MDU1Njk0OSwiaXNzIjoiaHR0cHM6Ly9hY2Nlc3Muc2FuZGJveC5jaGVja291dC5jb20iLCJhdWQiOiJnYXRld2F5IiwiY2xpZW50X2lkIjoiYWNrX3Z2emhvYWk0NjZzdTNqM3ZieGI0N3RzNW9lIiwiY2tvX2NsaWVudF9pZCI6ImNsaV9nNnJvZ2IzaGhmZXUzZ2h0eGN2M2J3NHFweSIsImNrb19lbnRpdHlfaWQiOiJlbnRfZGppZ2NxeDRjbG11Zm8yc2FzZ29tZ3Bxc3EiLCJqdGkiOiI3RDRCQTRBNEJBQUYzQ0E5MjYwMzlDRTNGQTc1ODVEMCIsImlhdCI6MTY0MDU1MzM0OSwic2NvcGUiOlsiZ2F0ZXdheSJdfQ.U4S2YQDZtRb5WsKA6P8eiHyoqH_KN_1MabiNG5LAOeyYwRiIdyuzWJlYJg-wJlly84Eo68P1rcEB0Pac90PRiDBfSPNh0rIFJvFrA1fHE95EWjwER8UBvYT6yr-yI4JlrTnjeU6f5mJpxWbuN2ywE36x5eWPBdBs3w_j_x8FU62-UYwPOy5LIyZLR_JRxHMU81r7chOD9113CTGzJG9CGzKDMN53iciLdLPXUCFH2AlLHm9-YFh46WMIz85i4nVG0aKI_fIW9gjsLIvG0j-8shf-k4D1LLP0R3juX6twULVbrDuZqacC0TqGI6bAahVJ37Old74He7Ft6j3cx9Hi8A',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'gateway',
        });

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['gateway'],
                environment: 'sandbox',
            }
        );

        const tkn = await cko.access.request({
            grant_type: 'client_credentials',
            client_id: 'ack_vvzhoai466su3j3vbxb47ts5oe',
            client_secret:
                '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            scope: 'gateway',
        });

        expect(tkn.token_type).to.equals('Bearer');
    });

    it('should be able to updat the access token in the config from the access class', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'gateway',
        });
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['gateway'],
                environment: 'sandbox',
            }
        );

        const tkn = await cko.access.request({
            grant_type: 'client_credentials',
            client_id: 'ack_vvzhoai466su3j3vbxb47ts5oe',
            client_secret:
                '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            scope: 'gateway',
        });

        cko.access.updateAccessToken(tkn);

        expect(cko.config.access.token).to.exist;
    });

    it('should throw AuthenticationError in pre-capture', async () => {
        nock('https://access.checkout.com').post('/connect/token').reply(401);
        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['gateway'],
                environment: 'live',
            }
        );

        try {
            const tkn = await cko.access.request({
                grant_type: 'client_credentials',
                client_id: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                client_secret:
                    '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
                scope: 'gateway',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
