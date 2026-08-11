import * as CONFIG from './config.js';
import Environment from './Environment.js';
import EnvironmentSubdomain from './EnvironmentSubdomain.js';
import { ValueError } from './services/errors.js';

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

        this.validateDomainOptions(key, options);

        const environmentSubdomain = options?.subdomain
            ? new EnvironmentSubdomain(environment, options.subdomain)
            : null;

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

        // A custom host replaces the base URL outright, so the merchant has already said
        // where requests go and neither option is required here. A subdomain that is provided
        // anyway still has to be well formed, rather than being silently dropped.
        this.validateSubdomainFormat(options?.subdomain);

        const environmentSubdomain = options?.subdomain
            ? new EnvironmentSubdomain(environment, options.subdomain)
            : null;

        return {
            host: options.host,
            environment,
            environmentSubdomain,
        };
    }

    /**
     * The merchant-specific subdomain is mandatory. Callers must either set `subdomain`, or
     * opt out explicitly with `useLegacyDomain: true`, which keeps requests on the shared
     * hosts (api.checkout.com and access.checkout.com, or their sandbox equivalents).
     *
     * `useLegacyDomain` is deprecated from its first release: it exists for the rare case
     * where the subdomain cannot be used, and will be removed.
     *
     * The Previous (ABC) platform predates merchant-specific subdomains, so keys of that
     * shape are exempt.
     *
     * @throws {ValueError} if both options are set, if neither is set, or if the subdomain is
     * not a valid merchant-specific subdomain
     */
    static validateDomainOptions(key, options) {
        const subdomain = options?.subdomain;
        const useLegacyDomain = options?.useLegacyDomain === true;

        if (subdomain && useLegacyDomain) {
            throw new ValueError(
                'subdomain and useLegacyDomain cannot both be set - provide only your ' +
                    'merchant-specific subdomain'
            );
        }

        this.validateSubdomainFormat(subdomain);

        if (!subdomain && !useLegacyDomain && !this.isPreviousPlatform(key, options)) {
            throw new ValueError(
                'subdomain is required - provide your merchant-specific subdomain (the first 8 ' +
                    'characters of your client ID, see ' +
                    'https://api-reference.checkout.com/#section/Base-URLs), or set ' +
                    'useLegacyDomain: true to opt out only if merchant specific sub domains are ' +
                    'causing issues'
            );
        }
    }

    /**
     * A subdomain that is set at all must be a valid merchant-specific subdomain. Invalid values
     * used to be dropped back to the shared host without a word.
     *
     * @throws {ValueError} if the subdomain is set and malformed
     */
    static validateSubdomainFormat(subdomain) {
        if (subdomain && !EnvironmentSubdomain.isValidSubdomain(subdomain)) {
            throw new ValueError(
                'invalid environment subdomain - provide your merchant-specific subdomain, the ' +
                    'first 8 characters of your client ID (see ' +
                    'https://api-reference.checkout.com/#section/Base-URLs)'
            );
        }
    }

    /**
     * Whether these credentials belong to the Previous (ABC) platform, which predates
     * merchant-specific subdomains and is therefore exempt from requiring one.
     */
    static isPreviousPlatform(key, options) {
        if (options?.client || process.env.CKO_SECRET) {
            return false;
        }
        const authKey = key || process.env.CKO_SECRET_KEY || '';
        const cleanKey = authKey.startsWith('Bearer')
            ? authKey.replace('Bearer', '').trim()
            : authKey;
        return CONFIG.PREVIOUS_SECRET_KEY_REGEX.test(cleanKey);
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
