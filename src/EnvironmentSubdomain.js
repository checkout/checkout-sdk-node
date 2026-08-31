/**
 * EnvironmentSubdomain class - handles environment URLs with subdomain support
 * Similar to Java SDK EnvironmentSubdomain class
 * Takes an Environment and applies subdomain transformation
 */

import Environment from './Environment.js';
import { ValueError } from './services/errors.js';

export default class EnvironmentSubdomain {
    constructor(environment, subdomain) {
        this.environment = environment;
        this.subdomain = subdomain;
        
        // Apply subdomain transformation to both URLs
        this.checkoutApi = EnvironmentSubdomain.createUrlWithSubdomain(environment.getCheckoutApi(), subdomain);
        this.oAuthAuthorizationApi = EnvironmentSubdomain.createUrlWithSubdomain(environment.getOAuthAuthorizationApi(), subdomain);
    }

    getCheckoutApi() {
        return this.checkoutApi;
    }

    getOAuthAuthorizationApi() {
        return this.oAuthAuthorizationApi;
    }

    /**
     * Applies subdomain transformation to any given URL by prepending the subdomain to the host.
     *
     * @param {string} originalUrl - the original URL to transform
     * @param {string} subdomain - the subdomain to prepend
     * @return {string} the transformed URL with subdomain
     * @throws {ValueError} if the subdomain is not a valid merchant-specific subdomain
     */
    static createUrlWithSubdomain(originalUrl, subdomain) {
        if (!EnvironmentSubdomain.isValidSubdomain(subdomain)) {
            throw new ValueError(
                'invalid environment subdomain - provide your merchant-specific subdomain, ' +
                    'typically your client ID excluding the cli_ prefix, see ' +
                    'https://api-reference.checkout.com/#section/Base-URLs'
            );
        }

        const url = new URL(originalUrl);
        const newHost = subdomain + '.' + url.host;
        url.host = newHost;
        const result = url.toString().trim();
        // Only remove trailing slash if the URL ends with just a slash
        return result.endsWith('/') ? result.slice(0, -1) : result;
    }

    /**
     * Validates if a subdomain string follows the required pattern.
     * Must be alphanumeric (lowercase letters and numbers only).
     * 
     * @param {string} subdomain - the subdomain to validate
     * @return {boolean} true if valid, false otherwise
     */
    static isValidSubdomain(subdomain) {
        if (!subdomain || typeof subdomain !== 'string') {
            return false;
        }
        const pattern = /^(?:pl-)?[a-z0-9]+$/;
        return pattern.test(subdomain);
    }

    // Factory methods for easy creation
    static sandbox(subdomain) {
        return new EnvironmentSubdomain(Environment.sandbox(), subdomain);
    }

    static live(subdomain) {
        return new EnvironmentSubdomain(Environment.live(), subdomain);
    }
}