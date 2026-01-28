/**
 * Environment class - handles basic environment URLs
 * Provides the base URLs for different environments without subdomain logic
 */
export default class Environment {
    constructor(environment: string);
    
    environment: string;
    checkoutApi: string;
    oAuthAuthorizationApi: string;

    getCheckoutApi(): string;
    getOAuthAuthorizationApi(): string;

    static sandbox(): Environment;
    static live(): Environment;
}
