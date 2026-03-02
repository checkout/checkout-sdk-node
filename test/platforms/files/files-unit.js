import { AuthenticationError, NotFoundError } from '../../../src/services/errors.js';
import { Checkout } from '../../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';
import fs from 'fs';

const platforms_ack = 'ack_123456789ry3uhiczwxkutelffq';
const platforms_secret =
    'Tlc9Un7iHa8IJq-rM7yzZYP7Bmm2iCDKXBzFRhGGLTUsNIm0KVqyngyiF_zR9g-B47RDJhbTuPYqSi-KqApIhA';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Platforms - Files', () => {
    it('should upload file', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });

        nock('https://files.sandbox.checkout.com')
            .post(/.*/)
            .reply(201, {
                id: 'file_awonj5x6qhhreojffryekdy65a',
                _links: {
                    self: {
                        href: 'https://files.sandbox.checkout.com/files/file_awonj5x6qhhreojffryekdy65a',
                    },
                },
            });
        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['files'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        const file = await cko.platforms.uploadFile(
            'identification',
            fs.createReadStream('./test/platforms/evidence.jpg')
        );

        expect(file.id).to.equal('file_awonj5x6qhhreojffryekdy65a');
    }).timeout(120000);

    it('should throw AuthenticationError when uploading file', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://files.sandbox.checkout.com').post(/.*/).reply(401);

        try {
            let cko = new Checkout('platforms_secret', {
                client: platforms_ack,
                scope: ['files'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            const file = await cko.platforms.uploadFile(
                'identification',
                fs.createReadStream('./test/platforms/evidence.jpg')
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should upload a file', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/entities/ent_aneh5mtyobxzazriwuevngrz6y/files')
            .reply(200, {
                "id": "file_6lbss42ezvoufcb2beo76rvwly",
                "maximum_size_in_bytes": 4194304,
                "document_types_for_purpose": [
                    "image/jpeg",
                    "image/png",
                    "image/jpg"
                ],
                "_links": {
                    "upload": {
                        "href": null
                    },
                    "self": {
                        "href": "https://files.checkout.com/files/file_6lbss42ezvoufcb2beo76rvwly"
                    }
                }
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });
        let platform = await cko.platforms.uploadAFile('ent_aneh5mtyobxzazriwuevngrz6y', {
            purpose: "bank_verification"
        });
        expect(platform.id).to.equal('file_6lbss42ezvoufcb2beo76rvwly');
        expect(platform.maximum_size_in_bytes).to.equal(4194304);
    });

    it('should retrieve a file', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'flow',
        });
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/entities/ent_aneh5mtyobxzazriwuevngrz6y/files/file_6lbss42ezvoufcb2beo76rvwly')
            .reply(200, {
                "id": "file_6lbss42ezvoufcb2beo76rvwly",
                "status": "invalid",
                "status_reasons": [
                    "InvalidMimeType"
                ],
                "size": 1024,
                "mime_type": "application/pdf",
                "uploaded_on": "2020-12-01T15:01:01Z",
                "purpose": "identity_verification",
                "_links": {
                    "download": {
                        "href": "https://s3.eu-west-1.amazonaws.com/mp-files-api-clean-prod/ent_ociwguf5a5fe3ndmpnvpnwsi3e/file_6lbss42ezvoufcb2beo76rvwly?X-Amz-Expires=3600&x-amz-security-token=some_token"
                    },
                    "self": {
                        "href": "https://files.checkout.com/files/file_6lbss42ezvoufcb2beo76rvwly"
                    }
                }
            });

        let cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['accounts'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        let file = await cko.platforms.retrieveAFile('ent_aneh5mtyobxzazriwuevngrz6y', 'file_6lbss42ezvoufcb2beo76rvwly');
        expect(file.id).to.equal('file_6lbss42ezvoufcb2beo76rvwly');
        expect(file.status).to.equal('invalid');
        expect(file.size).to.equal(1024);
        expect(file.mime_type).to.equal('application/pdf');
        expect(file.purpose).to.equal('identity_verification');
    });

    it('should throw NotFoundError when uploading file to non-existent entity', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'accounts',
        });
        
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/entities/ent_nonexistent/files')
            .reply(404, {
                request_id: 'req_123',
                error_type: 'resource_not_found'
            });

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            await cko.platforms.uploadAFile('ent_nonexistent', {
                purpose: 'identification'
            });
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should throw NotFoundError when retrieving non-existent file', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'accounts',
        });
        
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/entities/ent_test123/files/file_nonexistent')
            .reply(404, {
                request_id: 'req_123',
                error_type: 'resource_not_found'
            });

        try {
            let cko = new Checkout(platforms_secret, {
                client: platforms_ack,
                scope: ['accounts'],
                environment: 'sandbox',
            subdomain: '123456789',
            });

            await cko.platforms.retrieveAFile('ent_test123', 'file_nonexistent');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should retrieve a file from entity', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/entities/ent_123/files/file_123')
            .reply(200, {
                id: "file_123",
                filename: "document.pdf"
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.platforms.retrieveAFile("ent_123", "file_123");

        expect(response).to.not.be.null;
        expect(response.id).to.equal("file_123");
    });
});
