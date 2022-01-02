import * as CONFIG from './config';
import * as ENDPOINTS from './index';

const determineHost = (key, options) => {
    // If specified, use the custom host
    if (options && options.host) {
        return options.host;
    }

    // Priority 1: oAuth environment vars
    if (process.env.CKO_SECRET) {
        if (
            (process.env.CKO_ENVIRONMENT &&
                process.env.CKO_ENVIRONMENT.toLowerCase().trim() === 'prod') ||
            (process.env.CKO_ENVIRONMENT &&
                process.env.CKO_ENVIRONMENT.toLowerCase().trim() === 'production') ||
            (process.env.CKO_ENVIRONMENT &&
                process.env.CKO_ENVIRONMENT.toLowerCase().trim() === 'live')
        ) {
            return CONFIG.LIVE_BASE_URL;
        }
        return CONFIG.SANDBOX_BASE_URL;
    }
    // Priority 2: oAuth declared vars
    if (options && options.client) {
        if (
            (options.environment && options.environment.toLowerCase().trim() === 'prod') ||
            (options.environment && options.environment.toLowerCase().trim() === 'production') ||
            (options.environment && options.environment.toLowerCase().trim() === 'live')
        ) {
            return CONFIG.LIVE_BASE_URL;
        }
        return CONFIG.SANDBOX_BASE_URL;
    }

    // Priority 3: MBC or NAS static keys
    if (key.startsWith('Bearer')) {
        // eslint-disable-next-line no-param-reassign
        key = key.replace('Bearer', '').trim();
    }
    return CONFIG.MBC_LIVE_SECRET_KEY_REGEX.test(key) || CONFIG.NAS_LIVE_SECRET_KEY_REGEX.test(key)
        ? CONFIG.LIVE_BASE_URL
        : CONFIG.SANDBOX_BASE_URL;
};

const determineSecretKey = (key) => {
    // Unless specified, check environment variables for the key
    let authKey = !key ? process.env.CKO_SECRET_KEY || '' : key;

    // In case of NAS static keys, append the Bearer prefix
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
};

const determinePublicKey = (options) => {
    // Unless specified, check environment variables for the key
    let pk;
    if (options && options.pk) {
        pk = options.pk;
    } else {
        pk = process.env.CKO_PUBLIC_KEY || '';
    }

    // In case of NAS static keys, append the Bearer prefix
    if (CONFIG.NAS_LIVE_PUBLIC_KEY_REGEX.test(pk) || CONFIG.NAS_SANDBOX_PUBLIC_KEY_REGEX.test(pk)) {
        pk = pk.startsWith('Bearer') || pk.startsWith('bearer') ? pk : `Bearer ${pk}`;
    }

    return pk;
};

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
        let auth;
        if (process.env.CKO_SECRET) {
            // For NAS with environment vars
            auth = {
                secret: process.env.CKO_SECRET,
                client: process.env.CKO_CLIENT,
                scope: process.env.CKO_SCOPE || 'gateway',
                host: determineHost(null, options),
                access: null,
            };
        } else if (process.env.CKO_SECRET_KEY) {
            // For MBC or NAS with static keys from environment vars
            auth = {
                sk: determineSecretKey(process.env.CKO_SECRET_KEY),
                pk: determinePublicKey(process.env.CKO_PUBLIC_KEY),
                host: determineHost(determineSecretKey(key), options),
            };
        } else if (options && options.client) {
            // For NAS with declared vars
            auth = {
                secret: key,
                client: options.client,
                scope: options.scope || 'gateway',
                host: determineHost(null, options),
                access: null,
            };
        } else {
            // For MBC or NAS with static keys with declared vars
            auth = {
                sk: determineSecretKey(key, options),
                pk: determinePublicKey(options),
                host: determineHost(determineSecretKey(key), options),
            };
        }

        this.config = {
            ...auth,
            timeout: options && options.timeout ? options.timeout : CONFIG.DEFAULT_TIMEOUT,
            agent: options && options.agent ? options.agent : undefined,
            headers: options && options.headers ? options.headers : {},
            access: undefined,
        };

        this.payments = new ENDPOINTS.Payments(this.config);
        this.sources = new ENDPOINTS.Sources(this.config);
        this.tokens = new ENDPOINTS.Tokens(this.config);
        this.instruments = new ENDPOINTS.Instruments(this.config);
        this.webhooks = new ENDPOINTS.Webhooks(this.config);
        this.events = new ENDPOINTS.Events(this.config);
        this.disputes = new ENDPOINTS.Disputes(this.config);
        this.files = new ENDPOINTS.Files(this.config);
        this.reconciliation = new ENDPOINTS.Reconciliation(this.config);
        this.customers = new ENDPOINTS.Customers(this.config);
        this.hostedPayments = new ENDPOINTS.HostedPayments(this.config);
        this.giropay = new ENDPOINTS.Giropay(this.config);
        this.ideal = new ENDPOINTS.Ideal(this.config);
        this.fawry = new ENDPOINTS.Fawry(this.config);
        this.pagoFacil = new ENDPOINTS.PagoFacil(this.config);
        this.rapipago = new ENDPOINTS.Rapipago(this.config);
        this.boleto = new ENDPOINTS.Boleto(this.config);
        this.baloto = new ENDPOINTS.Baloto(this.config);
        this.oxxo = new ENDPOINTS.Oxxo(this.config);
        this.klarna = new ENDPOINTS.Klarna(this.config);
        this.sepa = new ENDPOINTS.Sepa(this.config);
        this.paymentLinks = new ENDPOINTS.PaymentLinks(this.config);
        this.risk = new ENDPOINTS.Risk(this.config);
        this.access = new ENDPOINTS.Access(this.config);
        this.forex = new ENDPOINTS.Forex(this.config);
        this.applePay = new ENDPOINTS.ApplePay(this.config);
    }
}
