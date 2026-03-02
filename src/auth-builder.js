import * as CONFIG from './config.js';
import Environment from './Environment.js';
import EnvironmentSubdomain from './EnvironmentSubdomain.js';

/**
 * Builds authentication configuration based on keys and options
 * Handles OAuth, static keys, environment variables, and custom hosts
 */
export class AuthBuilder {
    /**
     * Main entry point - determines auth strategy and builds config
     */
    static build(key, options) {
        if (process.env.CKO_SECRET) {
            return this.buildFromOAuthEnvVars(options);
        } else if (process.env.CKO_SECRET_KEY) {
            return this.buildFromStaticKeyEnvVars(key, options);
        } else if (options?.client) {
            return this.buildFromOAuthOptions(key, options);
        } else {
            return this.buildFromStaticKeyOptions(key, options);
        }
    }

    /**
     * OAuth with environment variables
     */
    static buildFromOAuthEnvVars(options) {
        const { host, environment, environmentSubdomain } = this.setupConfig(null, options);
        return {
            secret: process.env.CKO_SECRET,
            client: process.env.CKO_CLIENT,
            scope: process.env.CKO_SCOPE || 'gateway',
            host,
            environment,
            environmentSubdomain,
            access: null,
        };
    }

    /**
     * Static keys with environment variables
     */
    static buildFromStaticKeyEnvVars(key, options) {
        const { host, environment, environmentSubdomain } = this.setupConfig(
            this.determineSecretKey(key),
            options
        );
        return {
            sk: this.determineSecretKey(process.env.CKO_SECRET_KEY),
            pk: this.determinePublicKey(options),
            host,
            environment,
            environmentSubdomain,
        };
    }

    /**
     * OAuth with declared options
     */
    static buildFromOAuthOptions(key, options) {
        const { host, environment, environmentSubdomain } = this.setupConfig(null, options);
        return {
            secret: key,
            pk: this.determinePublicKey(options),
            client: options.client,
            scope: options.scope || 'gateway',
            host,
            environment,
            environmentSubdomain,
            access: null,
        };
    }

    /**
     * Static keys with declared options
     */
    static buildFromStaticKeyOptions(key, options) {
        const { host, environment, environmentSubdomain } = this.setupConfig(
            this.determineSecretKey(key),
            options
        );
        return {
            sk: this.determineSecretKey(key),
            pk: this.determinePublicKey(options),
            host,
            environment,
            environmentSubdomain,
        };
    }

    /**
     * Setup configuration: determines environment, subdomain, and host URL
     */
    static setupConfig(key, options) {
        // If custom host specified, use it directly
        if (options?.host) {
            return this.setupCustomHost(options);
        }

        // Determine environment based on priority
        const isLive = this.determineEnvironment(key, options);
        const environment = isLive ? Environment.live() : Environment.sandbox();

        // Create EnvironmentSubdomain if subdomain provided and valid
        const environmentSubdomain =
            options?.subdomain && EnvironmentSubdomain.isValidSubdomain(options.subdomain)
                ? new EnvironmentSubdomain(environment, options.subdomain)
                : null;

        // Emit deprecation warning if subdomain is not provided
        if (!environmentSubdomain) {
            console.warn(
                '[DEPRECATION WARNING] Initializing Checkout SDK without a subdomain is deprecated and will be removed in a future version. ' +
                'Please provide your account-specific subdomain using the "subdomain" option. ' +
                'You can find your subdomain in Dashboard → Developers → Overview. ' +
                'Example: new Checkout(key, { subdomain: "your-prefix" })'
            );
        }

        // Determine host URL
        const host = environmentSubdomain
            ? environmentSubdomain.getCheckoutApi()
            : environment.getCheckoutApi();

        return { host, environment, environmentSubdomain };
    }

    /**
     * Setup for custom host
     */
    static setupCustomHost(options) {
        const isLive = !options.host.includes('sandbox');
        const environment = isLive ? Environment.live() : Environment.sandbox();
        const environmentSubdomain =
            options?.subdomain && EnvironmentSubdomain.isValidSubdomain(options.subdomain)
                ? new EnvironmentSubdomain(environment, options.subdomain)
                : null;

        // Emit deprecation warning if subdomain is not provided with custom host
        if (!environmentSubdomain) {
            console.warn(
                '[DEPRECATION WARNING] Initializing Checkout SDK without a subdomain is deprecated and will be removed in a future version. ' +
                'Please provide your account-specific subdomain using the "subdomain" option. ' +
                'You can find your subdomain in Dashboard → Developers → Overview. ' +
                'Example: new Checkout(key, { host: "your-host", subdomain: "your-prefix" })'
            );
        }

        return {
            host: options.host,
            environment,
            environmentSubdomain,
        };
    }

    /**
     * Determine if environment is live or sandbox
     */
    static determineEnvironment(key, options) {
        // Priority 1: OAuth environment vars
        if (process.env.CKO_SECRET) {
            return (
                process.env.CKO_ENVIRONMENT &&
                ['prod', 'production', 'live'].includes(
                    process.env.CKO_ENVIRONMENT.toLowerCase().trim()
                )
            );
        }

        // Priority 2: OAuth declared vars
        if (options?.client) {
            return (
                options.environment &&
                ['prod', 'production', 'live'].includes(options.environment.toLowerCase().trim())
            );
        }

        // Priority 3: MBC or NAS static keys
        const cleanKey = key?.startsWith('Bearer') ? key.replace('Bearer', '').trim() : key;
        return (
            CONFIG.MBC_LIVE_SECRET_KEY_REGEX.test(cleanKey) ||
            CONFIG.NAS_LIVE_SECRET_KEY_REGEX.test(cleanKey)
        );
    }

    /**
     * Determine and format secret key
     */
    static determineSecretKey(key) {
        let authKey = key || process.env.CKO_SECRET_KEY || '';

        // Append Bearer prefix for NAS static keys
        if (
            CONFIG.NAS_LIVE_SECRET_KEY_REGEX.test(authKey) ||
            CONFIG.NAS_SANDBOX_SECRET_KEY_REGEX.test(authKey)
        ) {
            authKey =
                authKey.startsWith('Bearer') || authKey.startsWith('bearer')
                    ? authKey
                    : `Bearer ${authKey}`;
        }

        return authKey;
    }

    /**
     * Determine public key
     */
    static determinePublicKey(options) {
        return options?.pk || process.env.CKO_PUBLIC_KEY || '';
    }
}
