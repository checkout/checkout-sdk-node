import Environment from './Environment';

/**
 * EnvironmentSubdomain class - handles environment URLs with subdomain support
 * Takes an Environment and applies subdomain transformation
 */
export default class EnvironmentSubdomain {
    constructor(environment: Environment, subdomain: string);
    
    environment: Environment;
    subdomain: string;
    checkoutApi: string;
    oAuthAuthorizationApi: string;

    getCheckoutApi(): string;
    getOAuthAuthorizationApi(): string;

    /**
     * Applies subdomain transformation to any given URL.
     * If the subdomain is valid (alphanumeric pattern), prepends it to the host.
     * Otherwise, returns the original URL unchanged.
     */
    static createUrlWithSubdomain(originalUrl: string, subdomain: string): string;

    /**
     * Validates if a subdomain string follows the required pattern.
     * Must be alphanumeric (lowercase letters and numbers only).
     */
    static isValidSubdomain(subdomain: string): boolean;

    static sandbox(subdomain: string): EnvironmentSubdomain;
    static live(subdomain: string): EnvironmentSubdomain;
}
