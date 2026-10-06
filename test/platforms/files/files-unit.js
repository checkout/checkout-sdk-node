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
            'identity_verification',
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
                'identity_verification',
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
            .post('/entities/ent_ucyst27iadksa5ofou47yztzu5/files')
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

            await cko.platforms.uploadAFile('ent_ucyst27iadksa5ofou47yztzu5', {
                purpose: 'identity_verification'
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
            .get('/entities/ent_je5umzzhglwwcqlo3ihx6stv53/files/file_hhbwy4r2uwrvvgnt7g2mgisahm')
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

            await cko.platforms.retrieveAFile('ent_je5umzzhglwwcqlo3ihx6stv53', 'file_hhbwy4r2uwrvvgnt7g2mgisahm');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should retrieve a file from entity', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/entities/ent_6besloljz4vdvhtykaqvjzphfl/files/file_irk5webmcuzsdew6cntfts2njp')
            .reply(200, {
                id: "file_irk5webmcuzsdew6cntfts2njp",
                filename: "document.pdf"
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.platforms.retrieveAFile("ent_6besloljz4vdvhtykaqvjzphfl", "file_irk5webmcuzsdew6cntfts2njp");

        expect(response).to.not.be.null;
        expect(response.id).to.equal("file_irk5webmcuzsdew6cntfts2njp");
    });
    it('uploadAFile sends every PlatformsFileUpload purpose as the JSON body and returns the spec example', async () => {
        // PlatformsFileUploadResponse, built from the spec field examples.
        const uploadResponse = {
            id: 'file_6lbss42ezvoufcb2beo76rvwly',
            maximum_size_in_bytes: 4194304,
            document_types_for_purpose: ['image/jpeg', 'image/png', 'image/jpg'],
            _links: {
                upload: {
                    href: 'https://s3.eu-west-1.amazonaws.com/mp-files-api-staging-prod/ent_ociwguf5a5fe3ndmpnvpnwsi3e/file_6lbss42ezvoufcb2beo76rvwly?AWSAccessKeyId=ASIX4BFJOBCQFLAMPKU3&Expires=1661355993&x-amz-security-token=some_token',
                },
                self: {
                    href: 'https://files.checkout.com/files/file_6lbss42ezvoufcb2beo76rvwly',
                },
            },
        };
        // PlatformsFileUpload.purpose enum, in spec order.
        const purposes = [
            'additional_document',
            'articles_of_association',
            'bank_verification',
            'certified_authorised_signatory',
            'company_ownership',
            'company_verification',
            'financial_verification',
            'identity_verification',
            'proof_of_legality',
            'proof_of_principal_address',
            'shareholder_structure',
            'tax_verification',
            'proof_of_residential_address',
            'proof_of_registration',
        ];
        const sent = [];
        // The entity-scoped file endpoints are called on the main API host.
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/entities/ent_aneh5mtyobxzazriwuevngrz6y/files', (requestBody) => {
                sent.push(requestBody);
                return true;
            })
            .times(purposes.length)
            .reply(200, uploadResponse);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        for (const purpose of purposes) {
            const response = await cko.platforms.uploadAFile('ent_aneh5mtyobxzazriwuevngrz6y', { purpose });
            expect(response).to.deep.equal(uploadResponse);
        }

        expect(sent).to.deep.equal(purposes.map((purpose) => ({ purpose })));
    });

    it('retrieveAFile returns the PlatformsFileRetrieveResponse spec example unchanged', async () => {
        // PlatformsFileRetrieveResponse, built from the spec field examples.
        const retrieveResponse = {
            id: 'file_6lbss42ezvoufcb2beo76rvwly',
            status: 'invalid',
            status_reasons: ['InvalidMimeType'],
            size: 1024,
            mime_type: 'application/pdf',
            uploaded_on: '2020-12-01T15:01:01.0000000+00:00',
            purpose: 'identity_verification',
            _links: {
                download: {
                    href: 'https://s3.eu-west-1.amazonaws.com/mp-files-api-clean-prod/ent_ociwguf5a5fe3ndmpnvpnwsi3e/file_6lbss42ezvoufcb2beo76rvwly?X-Amz-Expires=3600&x-amz-security-token=some_token',
                },
                self: {
                    href: 'https://files.checkout.com/files/file_6lbss42ezvoufcb2beo76rvwly',
                },
            },
        };
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/entities/ent_aneh5mtyobxzazriwuevngrz6y/files/file_6lbss42ezvoufcb2beo76rvwly')
            .reply(200, retrieveResponse);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const file = await cko.platforms.retrieveAFile('ent_aneh5mtyobxzazriwuevngrz6y', 'file_6lbss42ezvoufcb2beo76rvwly');

        expect(file).to.deep.equal(retrieveResponse);
        // The seven-digit fraction and offset come back as the same string; nothing parses it.
        expect(file.uploaded_on).to.equal('2020-12-01T15:01:01.0000000+00:00');
    });

    it('should send the proof purposes for representative documents in the multipart upload', async () => {
        // One token request per upload.
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').times(2).reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'files',
        });
        const sentPurposes = [];
        nock('https://files.sandbox.checkout.com')
            .post(/.*/)
            .times(2)
            .reply(201, (uri, body) => {
                // nock hands a multipart body over hex-encoded.
                const text = /^[0-9a-f]+$/i.test(body) ? Buffer.from(body, 'hex').toString() : String(body);
                const match = /name="purpose"\r\n\r\n([a-z_]+)\r\n/.exec(text);
                sentPurposes.push(match && match[1]);
                return { id: 'file_awonj5x6qhhreojffryekdy65a' };
            });
        const cko = new Checkout(platforms_secret, {
            client: platforms_ack,
            scope: ['files'],
            environment: 'sandbox',
            subdomain: '123456789',
        });

        for (const purpose of ['proof_of_residential_address', 'proof_of_registration']) {
            const file = await cko.platforms.uploadFile(purpose, fs.createReadStream('./test/platforms/evidence.jpg'));
            expect(file.id).to.equal('file_awonj5x6qhhreojffryekdy65a');
        }
        expect(sentPurposes).to.deep.equal(['proof_of_residential_address', 'proof_of_registration']);
    });
});
