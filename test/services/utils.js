import { expect } from 'chai';
import { buildQueryParams } from '../../src/services/utils.js';

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
