/**
 * Environment class - handles basic environment URLs
 * Provides the base URLs for different environments without subdomain logic.
 *
 * Per API Reference (https://api-reference.checkout.com/#section/Base-URLs) and swagger-spec.json
 * servers, the canonical base URLs are unique per account and include a {prefix}:
 *   Sandbox:    https://{prefix}.api.sandbox.checkout.com
 *   Production: https://{prefix}.api.checkout.com
 * The prefix is the first 8 characters of the client_id (excluding "cli_").
 * When the user passes the `subdomain` option, EnvironmentSubdomain applies this prefix to these URLs.
 * Without subdomain, these legacy host-only URLs are used for backward compatibility.
 */

const ENVIRONMENTS = {
    SANDBOX: {
        checkoutApi: 'https://api.sandbox.checkout.com',
        oAuthAuthorizationApi: 'https://access.sandbox.checkout.com/connect/token'
    },
    LIVE: {
        checkoutApi: 'https://api.checkout.com',
        oAuthAuthorizationApi: 'https://access.checkout.com/connect/token'
    }
};

export default class Environment {
    constructor(environment) {
        this.environment = environment;
        this.isSandbox = environment === 'SANDBOX';
        this.checkoutApi = ENVIRONMENTS[environment].checkoutApi;
        this.oAuthAuthorizationApi = ENVIRONMENTS[environment].oAuthAuthorizationApi;
    }

    getCheckoutApi() {
        return this.checkoutApi;
    }

    getOAuthAuthorizationApi() {
        return this.oAuthAuthorizationApi;
    }

    static sandbox() {
        return new Environment('SANDBOX');
    }

    static live() {
        return new Environment('LIVE');
    }
}