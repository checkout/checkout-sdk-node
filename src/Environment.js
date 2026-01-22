/**
 * Environment class - handles basic environment URLs
 * Similar to Java SDK Environment class
 * Provides the base URLs for different environments without subdomain logic
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