import { ApiError, AuthenticationError, ValidationError } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import fs from 'fs';
import { expect } from 'chai';
import nock from 'nock';
import fetch from 'node-fetch';
const FormData = require('form-data');

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Files', () => {
    it('should upload file', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/files')
            .reply(200, {
                id: 'file_zna32sccqbwevd3ldmejtplbhu',
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/files/file_zna32sccqbwevd3ldmejtplbhu',
                    },
                },
            });

        const cko = new Checkout(SK);

        const file = await cko.files.upload({
            path: fs.createReadStream('./test/files/evidence.jpg'),
            purpose: 'dispute_evidence',
        });
        expect(file.id)
            .to.be.a('string')
            .and.satisfy((msg) => msg.startsWith('file_'));
    }).timeout(120000);

    it('should throw ValidationError when trying to upload file', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/files')
            .reply(422, {
                request_id: '0HM3QH3MKNCKA:00000001',
                error_type: 'request_unprocessable',
                error_codes: ['file_required'],
            });
        const cko = new Checkout(SK);

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
        nock('https://api.sandbox.checkout.com')
            .post('/files')
            .reply(200, {
                id: 'file_zna32sccqbwevd3ldmejtplbhu',
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/files/file_zna32sccqbwevd3ldmejtplbhu',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
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
                            'https://api.sandbox.checkout.com/files/file_zna32sccqbwevd3ldmejtplbhu',
                    },
                    download: {
                        href: 'https://example.com/evidence.jpg',
                    },
                },
            });

        const cko = new Checkout(SK);

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

    it('should throw Authentication error', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/files/file_zna32sccqbwevd3ldmejtplbhu')
            .reply(401);
        const cko = new Checkout();

        try {
            const disputes = await cko.files.getFile('file_zna32sccqbwevd3ldmejtplbhu');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
