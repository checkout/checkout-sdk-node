import * as CONFIG from './config.js';

/**
 * Calculates special service URLs based on environment
 * Some services (files, transfers, forward, etc.) use different base URLs
 */
export function calculateSpecialUrls(environment) {
    const isSandbox = environment.isSandbox;

    return {
        filesUrl: isSandbox
            ? CONFIG.PLATFORMS_FILES_SANDBOX_URL
            : CONFIG.PLATFORMS_FILES_LIVE_URL,
        transfersUrl: isSandbox ? CONFIG.TRANSFERS_SANDBOX_URL : CONFIG.TRANSFERS_LIVE_URL,
        forwardUrl: isSandbox ? CONFIG.FORWARD_SANDBOX_URL : CONFIG.FORWARD_LIVE_URL,
        balancesUrl: isSandbox ? CONFIG.BALANCES_SANDBOX_URL : CONFIG.BALANCES_LIVE_URL,
        identityVerificationUrl: isSandbox
            ? CONFIG.IDENTITY_VERIFICATION_SANDBOX_URL
            : CONFIG.IDENTITY_VERIFICATION_LIVE_URL,
    };
}
