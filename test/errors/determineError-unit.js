import {
    ActionNotAllowed,
    ApiError,
    ApiTimeout,
    AuthenticationError,
    BadGateway,
    determineError,
    ErrorWithBody,
    NotFoundError,
    TooManyRequestsError,
    UrlAlreadyRegistered,
    ValidationError,
} from '../../src/services/errors.js';
import { expect } from 'chai';

describe('determineError', () => {
    describe('returns an SDK error unchanged', () => {
        const errors = [
            new AuthenticationError({ status: 307 }, 'Unexpected token response status'),
            new ActionNotAllowed({ a: 1 }),
            new UrlAlreadyRegistered({ a: 1 }),
            new NotFoundError({ a: 1 }),
            new ValidationError({ a: 1 }),
            new TooManyRequestsError({ a: 1 }),
            new ErrorWithBody(418, { a: 1 }, 'Teapot'),
            new BadGateway(),
            new ApiError(0, 'request to https://example.com failed, reason: socket hang up'),
        ];

        errors.forEach((error) => {
            it(`${error.constructor.name}`, async () => {
                expect(await determineError(error)).to.equal(error);
            });
        });

        it('ApiTimeout', async () => {
            const error = new ApiTimeout();
            expect(await determineError(error)).to.equal(error);
        });
    });

    describe('maps a thrown status object as before', () => {
        it('400 invalid_client to AuthenticationError', async () => {
            const err = await determineError({ status: 400, json: { error: 'invalid_client' } });
            expect(err).to.be.instanceOf(AuthenticationError);
            expect(err.body).to.deep.equal({ error: 'invalid_client' });
        });

        it('400 without an OAuth error to ApiError 400', async () => {
            const err = await determineError({ status: 400, json: { error_codes: ['x'] } });
            expect(err).to.be.instanceOf(ApiError);
            expect(err.http_code).to.equal(400);
        });

        it('422 to ValidationError', async () => {
            const err = await determineError({ status: 422, json: { error_codes: ['x'] } });
            expect(err).to.be.instanceOf(ValidationError);
        });

        it('a plain Error to ApiError without http_code, the message as body', async () => {
            const err = await determineError(new Error('request to https://x failed, reason: boom'));
            expect(err).to.be.instanceOf(ApiError);
            expect(err.http_code).to.equal(undefined);
            expect(err.body).to.equal('request to https://x failed, reason: boom');
        });
    });
});
