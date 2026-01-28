/**
 * EnvironmentSubdomain class - handles environment URLs with subdomain support
 * Similar to Java SDK EnvironmentSubdomain class
 * Takes an Environment and applies subdomain transformation
 */

import Environment from './Environment.js';

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
     * Applies subdomain transformation to any given URL.
     * If the subdomain is valid (alphanumeric pattern), prepends it to the host.
     * Otherwise, returns the original URL unchanged.
     * 
     * @param {string} originalUrl - the original URL to transform
     * @param {string} subdomain - the subdomain to prepend  
     * @return {string} the transformed URL with subdomain, or original URL if subdomain is invalid
     */
    static createUrlWithSubdomain(originalUrl, subdomain) {
        if (!EnvironmentSubdomain.isValidSubdomain(subdomain)) {
            return originalUrl;
        }

        try {
            const url = new URL(originalUrl);
            const newHost = subdomain + '.' + url.host;
            url.host = newHost;
            const result = url.toString().trim();
            // Only remove trailing slash if the URL ends with just a slash
            return result.endsWith('/') ? result.slice(0, -1) : result;
        } catch (error) {
            return originalUrl;
        }
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
        const pattern = /^[0-9a-z]+$/;
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