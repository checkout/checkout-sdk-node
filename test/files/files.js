import {
    BadGateway,
    TooManyRequestsError,
    ValidationError,
    ValueError,
    AuthenticationError,
    NotFoundError,
    ActionNotAllowed
} from '../../src/services/errors';
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
                            'https://api.sandbox.checkout.com/files/file_zna32sccqbwevd3ldmejtplbhu'
                    }
                }
            });

        const cko = new Checkout(SK);

        const file = await cko.files.upload({
            path: fs.createReadStream('./test/files/evidence.jpg'),
            purpose: 'dispute_evidence'
        });
        expect(file.id)
            .to.be.a('string')
            .and.satisfy(msg => msg.startsWith('file_'));
    }).timeout(120000);

    it('should get file', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/files')
            .reply(200, {
                id: 'file_zna32sccqbwevd3ldmejtplbhu',
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/files/file_zna32sccqbwevd3ldmejtplbhu'
                    }
                }
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
                            'https://api.sandbox.checkout.com/files/file_zna32sccqbwevd3ldmejtplbhu'
                    },
                    download: {
                        href:
                            'https://cabinet-upload-sb.s3.eu-west-2.amazonaws.com/f4baeaa/7bsaeaa/6kkr4vjwii5ulolnmwjhgxcxzy?X-Amz-Expires=3600&x-amz-security-token=IQoJb3JpZ2luX2VjEI3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMiJGMEQCIHcJQfr7NCWvhbUL%2FEdHJzSHvyTte6JDqZrxpzXES5anAiASvJ1CFrTZmCTVnu%2FV%2BiO3Y7kdeIVnn%2BB4QrVKLoYXvir%2FAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAEaDDY3OTA0NTY5MDA5MSIMGaZvqgr2fzkU3PqGKtMDXyBUarr1XP23zgFWezwf0Y5n4huS63%2FM6UQX5dxvdtamGjv2PoOPBRoc3kT3EIFtep6de1CMvdCjKXMM%2FBDkGqYrXISD5tY1YdPK9OpSvdwi3CqSXrcy5Id%2FCIciPksUXGzErFg3zAL6Zfq17XT%2Fs0f5zeE2SIDRGp%2FQJ%2FLaRSLIdCBM%2BDUhxpp8C0u2lAKen1vWuRaxQ7H%2B6eVjd1NgsfxarGty4YzgczozSHdTKK1ZnLo6niuWpC1OUZe4Fvd1alMMBtvkGUDkWWBh5dzHgYUVLgIHDMerp7PVTRDh1OfkpQPoLSMuRO7DNSRbbdrVMG5yAT6u%2BAIeFe8jLoo0eMImlOxnfUBrvo27p9S6Zm0wunv%2FkzNVtBDHoAeMEYBlobFQ2SNAqFMdJwEZK%2BaYHN2p5rXnwVHBUvIYMQK0Lj%2BTXpS3nrikM9Q3JAuTzAlCcmI%2FdA9lxr9KWoIxG2vMqdoTiUMb3gzm8u%2BCxodHJ6Zm5IZH9EG%2FUQxsR0rylCueoHOcW%2BnnWG6ZOLF5pSS1gqTstdMQza1fymU%2F7xtQ6ILOefjSRg2IFNjHLjia4rYP54ZH%2BpggLhvJZjsUrLkrNU9q46hQ2H7ARlCJPEuR%2B%2Fye4m8w8bqZ9QU68AGlc3LyGA0UgIIWnk6Fdj8EHbSYeOXsMmTLd44VUGsQAoxjULlpVcoimYc1utZCPR%2BNG3MNRAfr2Nia6I2dxk6zz7RxMmw%2BBB4BQL8WNbU5f7whB9WzpVNg%2BC%2ByIpw1IO8Sm9N%2B9hBLu3uRCvJMwCpN%2FCHrIWnTL579DkM2UB3OsCE2HjFN4BI9MSsyTXSkj2Ht3te7mmgkWQzZLs6Og6itPsxTwvJ5mvrcp0wW%2BGk6mpVoGbdKpldJY1qXQ4VbV9dLR3qdbmqrpwzdJAoPY4S0Drj7rDvMhF5DxOlEgzCvKzIw8JWD7PA1Ka2a68UEnOM%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAZ4GSG6LV6H7NWOH6/20200427/eu-west-2/s3/aws4_request&X-Amz-Date=20200427T051737Z&X-Amz-SignedHeaders=host;x-amz-security-token&X-Amz-Signature=c5c1104da360491f7bfc00ef83d650ac54a0310bf1f3c30fb4602825ff993929'
                    }
                }
            });

        const cko = new Checkout(SK);

        const file = await cko.files.upload({
            path: fs.createReadStream('./test/files/evidence.jpg'),
            purpose: 'dispute_evidence'
        });
        expect(file.id)
            .to.be.a('string')
            .and.satisfy(msg => msg.startsWith('file_'));

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
