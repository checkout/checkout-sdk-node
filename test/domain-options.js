/**
 * Every client the suite builds has to choose a domain now that the merchant-specific subdomain
 * is mandatory, so they all spread these options.
 *
 * The subdomain is used when CHECKOUT_MERCHANT_SUBDOMAIN is set, otherwise the client falls back
 * to the shared hosts. CI does not export that variable, and it would not help if it did: the
 * sandbox OAuth clients are not provisioned for the subdomain, so pointing the token request at
 * {subdomain}.access.sandbox.checkout.com returns invalid_client. Until those clients are bound to
 * the subdomain, the suite has to be able to run on the legacy hosts.
 */
export const domainOptions = () => {
    const subdomain = process.env.CHECKOUT_MERCHANT_SUBDOMAIN;
    return subdomain && subdomain.trim() !== ''
        ? { subdomain }
        : { useLegacyDomain: true };
};
