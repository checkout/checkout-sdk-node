import * as CONFIG from './config.js';
import { AuthBuilder } from './auth-builder.js';
import { calculateSpecialUrls } from './special-urls.js';
import { createEndpoints } from './endpoints-factory.js';

/**
 * Main Checkout.com SDK class
 *
 * @export
 * @class Checkout
 */
export default class Checkout {
    /**
     * Creates an instance of Checkout.com's SDK.
     *
     * Determines the environment based on the key
     *
     * @constructor
     * @param {string} [key] Secret Key /^(sk)
     * @param {Object}  [options] Configuration options
     * @memberof Payments
     */
    constructor(key, options) {
        // Build authentication configuration
        const auth = AuthBuilder.build(key, options);
        
        // Calculate special service URLs based on environment
        const specialUrls = calculateSpecialUrls(auth.environment);
        
        // Build final configuration
        this.config = {
            ...auth,
            ...specialUrls,
            timeout: options?.timeout ?? CONFIG.DEFAULT_TIMEOUT,
            agent: options?.agent,
            headers: options?.headers ?? {},
            access: undefined,
            httpClient: options?.httpClient,
            subdomain: options?.subdomain,
        };

        // Initialize all API endpoints
        Object.assign(this, createEndpoints(this.config));
    }
}
