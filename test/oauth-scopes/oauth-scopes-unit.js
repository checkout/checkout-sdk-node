import { OAuthScopes } from '../../src/index.js';
import { expect } from 'chai';

/**
 * The constants are the only place these wire values are written down, and http.js sends them
 * verbatim as the space-joined `scope` form field. The token endpoint rejects the whole request
 * when one requested scope is undefined, so a typo costs the caller every other scope it asked for
 * alongside the bad one.
 *
 * Values come from components.securitySchemes.OAuth.flows.clientCredentials.scopes in
 * shared/swagger-latest.json.
 */
describe('OAuthScopes', () => {
    it('should expose the documented balances scope values', () => {
        expect(OAuthScopes.BALANCES).to.equal('balances');
        expect(OAuthScopes.BALANCES_VIEW).to.equal('balances:view');
        expect(OAuthScopes.BALANCES_TOP_UP_INSTRUCTIONS).to.equal('balances:top-up-instructions');
    });

    it('should expose the scopes the spec only references from operations', () => {
        // These five are not declared in clientCredentials.scopes at all: they appear only in the
        // per-operation security requirements of GET/POST /compliance-requests/{payment_id}, the
        // /googlepay/enrollments operations and GET /tokens/{tokenId}/metadata.
        expect(OAuthScopes.COMPLIANCE_REQUESTS).to.equal('compliance-requests');
        expect(OAuthScopes.COMPLIANCE_REQUESTS_READ).to.equal('compliance-requests:read');
        expect(OAuthScopes.COMPLIANCE_REQUESTS_RESPOND).to.equal('compliance-requests:respond');
        expect(OAuthScopes.VAULT_GPAYME_ENROLLMENT).to.equal('vault:gpayme-enrollment');
        expect(OAuthScopes.VAULT_TOKENS_METADATA).to.equal('vault:tokens-metadata');
    });

    it('should keep the two payment context scopes distinct', () => {
        // These read alike but are unrelated: the spec requires the former for
        // GET /payment-contexts/{id} and the latter for POST /payment-contexts.
        //
        // 'Payment Context' is the only scope whose value contains a space and a capital letter,
        // which is almost certainly a spec authoring defect -- asserted verbatim because that is
        // the value the authorization server is documented to accept.
        expect(OAuthScopes.PAYMENT_CONTEXT).to.equal('Payment Context');
        expect(OAuthScopes.GATEWAY_PAYMENT_CONTEXTS).to.equal('gateway:payment-contexts');
    });

    it('should retain the legacy scopes the spec omits', () => {
        // These five appear nowhere in the spec -- not in the scope map and not in any operation's
        // security requirement -- so a sweep driven by the spec alone would drop them. They are
        // kept deliberately: the authorization server still grants them and callers still request
        // them. marketplace is the proof: the sandbox payouts client is provisioned for it and
        // answers a request for accounts with {"error":"invalid_scope"}.
        expect(OAuthScopes.ISSUING_CARD_MGMT).to.equal('issuing:card-mgmt');
        expect(OAuthScopes.ISSUING_CLIENT).to.equal('issuing:client');
        expect(OAuthScopes.MARKETPLACE).to.equal('marketplace');
        expect(OAuthScopes.MIDDLEWARE_GATEWAY).to.equal('middleware:gateway');
        expect(OAuthScopes.MIDDLEWARE_PAYMENT_CONTEXT).to.equal('middleware:payment-context');
    });

    it('should give every constant a non-blank wire value', () => {
        // A blank value is not caught by the assertions above, which only read the keys they name.
        // http.js joins the requested scopes with a space, so a blank constant would be sent as an
        // empty entry and the token endpoint would reject the whole request.
        const blank = Object.entries(OAuthScopes).filter(
            ([, value]) => typeof value !== 'string' || value.trim() === ''
        );
        expect(blank).to.deep.equal([]);
    });

    it('should not reuse a wire value across constants', () => {
        // A duplicate means one of the two keys is a copy-paste error. The consequence is silent in
        // both directions: a caller selecting the mistyped key requests a scope it did not ask for,
        // and the scope that key was supposed to carry is left with no key at all, so it becomes
        // unreachable through this object.
        const values = Object.values(OAuthScopes);
        const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
        expect(duplicates).to.deep.equal([]);
    });

    it('should declare keys in alphabetical order', () => {
        // Keys are kept alphabetical so the next spec sync produces a readable diff, and so the
        // ordering matches the other Checkout SDKs. Underscores are ignored when comparing, which
        // is what puts PAYMENT_CONTEXT, PAYMENT_SESSIONS and PAYMENTS_SEARCH in that order.
        //
        // Object.keys returns insertion order for string keys, which for an object literal is
        // declaration order.
        const declared = Object.keys(OAuthScopes).map((key) => key.replace(/_/g, '').toLowerCase());
        expect(declared).to.deep.equal([...declared].sort());
    });

    it('should be frozen so a caller cannot corrupt a shared scope value', () => {
        // The object is a module-level singleton shared by every Checkout instance in the process,
        // so without freezing, one caller assigning to OAuthScopes.GATEWAY would change the scope
        // every other caller requests. Object.freeze makes the write a no-op instead.
        expect(Object.isFrozen(OAuthScopes)).to.equal(true);
        expect(() => {
            OAuthScopes.GATEWAY = 'tampered';
        }).to.throw(TypeError);
        expect(OAuthScopes.GATEWAY).to.equal('gateway');
    });
});
