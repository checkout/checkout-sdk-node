import { expect } from 'chai';
import { ValueError } from '../../src/services/errors.js';
import { buildQueryParams, encodePathSegment } from '../../src/services/utils.js';

describe('Service Utils - buildQueryParams', () => {
    it('appends the params as a query string', () => {
        expect(buildQueryParams('u', { skip: 10, limit: 5 })).to.equal('u?skip=10&limit=5');
    });

    // skip defaults to 0 server side, but an explicit 0 is a meaningful offset and has to survive.
    it('keeps an explicit zero skip', () => {
        expect(buildQueryParams('u', { skip: 0, limit: 10 })).to.equal('u?skip=0&limit=10');
    });

    it('adds no query string for undefined params', () => {
        expect(buildQueryParams('u', undefined)).to.equal('u');
    });

    // An empty object used to produce a bare "u?". Nothing reached it before the 2026-09-02 row,
    // because every caller either passed real params or passed nothing, but routing the four
    // list-attempts endpoints through this helper made it reachable.
    it('adds no bare question mark for an empty params object', () => {
        expect(buildQueryParams('u', {})).to.equal('u');
    });

    it('encodes keys and values', () => {
        expect(buildQueryParams('u', { 'a b': 'c&d' })).to.equal('u?a%20b=c%26d');
    });
});

describe('Service Utils - encodePathSegment', () => {
    it('keeps a valid id unchanged', () => {
        expect(encodePathSegment('pay_abc123', 'id')).to.equal('pay_abc123');
    });

    it('turns a number into its string form', () => {
        expect(encodePathSegment(123, 'id')).to.equal('123');
    });

    // Values with reserved characters, which the SDK percent-encodes.
    [
        ['%2e%2e', '%252e%252e'],
        ['a?b', 'a%3Fb'],
        ['a#b', 'a%23b'],
        ['a\u{1F600}b', 'a%F0%9F%98%80b'],
    ].forEach(([value, expected]) => {
        it(`encodes ${value}`, () => {
            expect(encodePathSegment(value, 'id')).to.equal(expected);
        });
    });

    // "/", "\\" and ASCII control characters are rejected rather than encoded.
    ['../x', '%2e%2e/x', 'x/y', '..\\x', 'a\\b', 'a\u0000b', 'a\nb', 'a\rb', 'a\tb', 'a\u001fb', 'a\u007fb'].forEach((value) => {
        it(`rejects ${JSON.stringify(value)}`, () => {
            expect(() => encodePathSegment(value, 'id')).to.throw(
                ValueError,
                'Invalid id: must not contain "/", "\\" or ASCII control characters.'
            );
        });
    });

    // Text with an unpaired surrogate is rejected with the same error type.
    ['a\uD800b', 'a\uDC00b', '\uDC00\uD800', 'a\uD83D'].forEach((value) => {
        it(`rejects ${JSON.stringify(value)}`, () => {
            expect(() => encodePathSegment(value, 'id')).to.throw(
                ValueError,
                'Invalid id: must be valid text (no unpaired surrogates).'
            );
        });
    });

    it('names the parameter but not the value in the error message', () => {
        ['sk_secret/x', 'sk_secret\u0000', 'sk_secret\uD800'].forEach((value) => {
            let error;
            try {
                encodePathSegment(value, 'id');
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceOf(ValueError);
            expect(error.message).to.include('id');
            expect(error.message).to.not.include('sk_secret');
        });
    });

    // encodeURIComponent leaves "." and ".." unchanged, so they are rejected.
    [undefined, null, '', '.', '..'].forEach((value) => {
        it(`rejects ${JSON.stringify(value) ?? 'undefined'}`, () => {
            expect(() => encodePathSegment(value, 'id')).to.throw(
                ValueError,
                'Invalid id: must not be undefined, null, empty, "." or "..".'
            );
        });
    });
});
