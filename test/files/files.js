import { AuthenticationError, ValidationError } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import fs from 'fs';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Files', () => {
    it('should upload file', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/files')
            .reply(200, {
                id: 'file_zna32sccqbwevd3ldmejtplbhu',
                _links: {
                    self: {
                        href:
                            'https://123456789.api.sandbox.checkout.com/files/file_zna32sccqbwevd3ldmejtplbhu',
                    },
                },
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });

        const file = await cko.files.upload({
            path: fs.createReadStream('./test/files/evidence.jpg'),
            purpose: 'dispute_evidence',
        });
        expect(file.id)
            .to.be.a('string')
            .and.satisfy((msg) => msg.startsWith('file_'));
    }).timeout(120000);

    it('should upload file from the external source', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/files')
            .reply(200, {
                id: 'file_qzhaicujhxme3fe5g75sscmqme',
                _links: {
                    self: {
                        href:
                            'https://123456789.api.sandbox.checkout.com/files/file_qzhaicujhxme3fe5g75sscmqme',
                    },
                },
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });

        const file = await cko.files.upload({
            file: 'https://media.ethicalads.io/media/images/2020/12/ethicalads_2.jpg',
            purpose: 'dispute_evidence',
        });

        expect(file.id)
            .to.be.a('string')
            .and.satisfy((msg) => msg.startsWith('file_'));
    }).timeout(120000);

    it('should throw ValidationError when trying to upload file', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/files')
            .reply(422, {
                request_id: '0HM3QH3MKNCKA:00000001',
                error_type: 'request_unprocessable',
                error_codes: ['file_required'],
            });
        const cko = new Checkout(SK, { subdomain: '123456789' });

        try {
            const file = await cko.files.upload({
                path: '',
                purpose: 'dispute_evidence',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should get file', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/files')
            .reply(200, {
                id: 'file_zna32sccqbwevd3ldmejtplbhu',
                _links: {
                    self: {
                        href:
                            'https://123456789.api.sandbox.checkout.com/files/file_zna32sccqbwevd3ldmejtplbhu',
                    },
                },
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/files/file_zna32sccqbwevd3ldmejtplbhu')
            .reply(200, {
                id: 'file_zna32sccqbwevd3ldmejtplbhu',
                filename: 'evidence.jpg',
                purpose: 'dispute_evidence',
                size: 4307,
                uploaded_on: '2020-04-27T05:17:37Z',
                _links: {
                    self: {
                        href:
                            'https://123456789.api.sandbox.checkout.com/files/file_zna32sccqbwevd3ldmejtplbhu',
                    },
                    download: {
                        href: 'https://example.com/evidence.jpg',
                    },
                },
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });

        const file = await cko.files.upload({
            path: fs.createReadStream('./test/files/evidence.jpg'),
            purpose: 'dispute_evidence',
        });
        expect(file.id)
            .to.be.a('string')
            .and.satisfy((msg) => msg.startsWith('file_'));

        const getFile = await cko.files.getFile(file.id);
        expect(getFile.id).to.equal(file.id);
    }).timeout(120000);

    it('should upload file with different purpose values', async () => {
        const purposes = ['additional_document', 'bank_verification', 'identity_verification'];

        for (const purpose of purposes) {
            let capturedBody = null;
            nock('https://123456789.api.sandbox.checkout.com')
                .matchHeader('content-type', /^multipart\/form-data; boundary=/)
                .post('/files', (body) => {
                    capturedBody = body;
                    return true;
                })
                .reply(200, {
                    id: 'file_test_' + purpose,
                    _links: {
                        self: {
                            href: `https://123456789.api.sandbox.checkout.com/files/file_test_${purpose}`,
                        },
                    },
                });

            const cko = new Checkout(SK, { subdomain: '123456789' });

            const file = await cko.files.upload({
                path: fs.createReadStream('./test/files/evidence.jpg'),
                purpose: purpose,
            });

            expect(file.id).to.equal('file_test_' + purpose);
            expect(capturedBody).to.match(
                new RegExp(`name="purpose"\\r\\n\\r\\n${purpose}\\r\\n`),
                `purpose field "${purpose}" must appear in multipart body`
            );
            expect(capturedBody).to.match(
                /name="file"; filename=/,
                'file field must appear in multipart body'
            );
        }
    }).timeout(120000);

    // Regression test for https://github.com/checkout/checkout-sdk-node/issues/418
    // The bug: native fetch string-coerced the form-data v4 instance, sending the literal
    // text "[object FormData]" as a text/plain body. The API never saw the purpose field
    // and returned purpose_required / purpose_invalid.
    it('should send a properly framed multipart body with purpose in form-data (regression #418)', async () => {
        let capturedHeaders = null;
        let capturedBody = null;

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/files', (body) => {
                capturedBody = body;
                return true;
            })
            .reply(function () {
                capturedHeaders = this.req.headers;
                return [
                    201,
                    {
                        id: 'file_regression_418',
                        _links: {
                            self: {
                                href: 'https://123456789.api.sandbox.checkout.com/files/file_regression_418',
                            },
                        },
                    },
                ];
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.files.upload({
            path: fs.createReadStream('./test/files/evidence.jpg'),
            purpose: 'dispute_evidence',
        });

        const contentType =
            capturedHeaders && (capturedHeaders['content-type'] || capturedHeaders['Content-Type']);
        expect(contentType).to.match(
            /^multipart\/form-data; boundary=/,
            'Content-Type must be multipart/form-data with a boundary'
        );

        expect(capturedBody).to.not.include(
            '[object FormData]',
            'body must not contain the string "[object FormData]" — that means the form-data instance was string-coerced instead of serialized'
        );
        expect(capturedBody).to.match(
            /name="purpose"\r\n\r\ndispute_evidence\r\n/,
            'purpose field must be present in the multipart body'
        );
        expect(capturedBody).to.match(
            /name="file"; filename=/,
            'file field must be present in the multipart body'
        );
    }).timeout(120000);

    it('should throw ValidationError when purpose is missing', async () => {
        const cko = new Checkout(SK, { subdomain: '123456789' });

        try {
            const file = await cko.files.upload({
                path: fs.createReadStream('./test/files/evidence.jpg'),
                // missing purpose parameter
            });
        } catch (err) {
            // Should throw an error when purpose is missing
            expect(err).to.exist;
        }
    });

    it('should throw Authentication error', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/files/file_zna32sccqbwevd3ldmejtplbhu')
            .reply(401);
        const cko = new Checkout('invalid_key', { subdomain: '123456789' });

        try {
            const disputes = await cko.files.getFile('file_zna32sccqbwevd3ldmejtplbhu');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
