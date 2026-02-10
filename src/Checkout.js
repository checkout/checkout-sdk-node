import * as CONFIG from './config.js';
import * as ENDPOINTS from './index.js';
import Environment from './Environment.js';
import EnvironmentSubdomain from './EnvironmentSubdomain.js';

const setupConfig = (key, options) => {
    // If specified, use the custom host
    if (options && options.host) {
        // For custom hosts, we still need to determine environment from the host
        const isLive = !options.host.includes('sandbox');
        const environment = isLive ? Environment.live() : Environment.sandbox();
        const environmentSubdomain = (options && options.subdomain && EnvironmentSubdomain.isValidSubdomain(options.subdomain)) 
            ? new EnvironmentSubdomain(environment, options.subdomain) 
            : null;
        
        return {
            host: options.host,
            environment,
            environmentSubdomain
        };
    }

    // Determine environment first
    let isLive = false;
    
    // Priority 1: oAuth environment vars
    if (process.env.CKO_SECRET) {
        isLive = (process.env.CKO_ENVIRONMENT &&
            ['prod', 'production', 'live'].includes(process.env.CKO_ENVIRONMENT.toLowerCase().trim()));
    }
    // Priority 2: oAuth declared vars  
    else if (options && options.client) {
        isLive = (options.environment && 
            ['prod', 'production', 'live'].includes(options.environment.toLowerCase().trim()));
    }
    // Priority 3: MBC or NAS static keys
    else {
        const cleanKey = key.startsWith('Bearer') ? key.replace('Bearer', '').trim() : key;
        isLive = CONFIG.MBC_LIVE_SECRET_KEY_REGEX.test(cleanKey) || CONFIG.NAS_LIVE_SECRET_KEY_REGEX.test(cleanKey);
    }

    // Create appropriate environment
    const environment = isLive ? Environment.live() : Environment.sandbox();
    
    // Create EnvironmentSubdomain if subdomain provided, otherwise null
    const environmentSubdomain = (options && options.subdomain && EnvironmentSubdomain.isValidSubdomain(options.subdomain)) 
        ? new EnvironmentSubdomain(environment, options.subdomain) 
        : null;
    
    // Determine host URL using the appropriate environment/environmentSubdomain
    const host = environmentSubdomain ? environmentSubdomain.getCheckoutApi() : environment.getCheckoutApi();
    
    return {
        host,
        environment,
        environmentSubdomain
    };
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
            const { host, environment, environmentSubdomain } = setupConfig(null, options);
            auth = {
                secret: process.env.CKO_SECRET,
                client: process.env.CKO_CLIENT,
                scope: process.env.CKO_SCOPE || 'gateway',
                host,
                environment,
                environmentSubdomain,
                access: null,
            };
        } else if (process.env.CKO_SECRET_KEY) {
            // For MBC or NAS with static keys from environment vars
            const { host, environment, environmentSubdomain } = setupConfig(determineSecretKey(key), options);
            auth = {
                sk: determineSecretKey(process.env.CKO_SECRET_KEY),
                pk: determinePublicKey(process.env.CKO_PUBLIC_KEY),
                host,
                environment,
                environmentSubdomain,
            };
        } else if (options && options.client) {
            // For NAS with declared vars
            const { host, environment, environmentSubdomain } = setupConfig(null, options);
            auth = {
                secret: key,
                pk: determinePublicKey(options),
                client: options.client,
                scope: options.scope || 'gateway',
                host,
                environment,
                environmentSubdomain,
                access: null,
            };
        } else {
            // For MBC or NAS with static keys with declared vars
            const { host, environment, environmentSubdomain } = setupConfig(determineSecretKey(key), options);
            auth = {
                sk: determineSecretKey(key),
                pk: determinePublicKey(options),
                host,
                environment,
                environmentSubdomain,
            };
        }
        
        this.config = {
            ...auth,
            timeout: options && options.timeout ? options.timeout : CONFIG.DEFAULT_TIMEOUT,
            agent: options && options.agent ? options.agent : undefined,
            headers: options && options.headers ? options.headers : {},
            access: undefined,
            httpClient: options && options.httpClient ? options.httpClient : undefined,
            subdomain: options && options.subdomain ? options.subdomain : undefined,
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
        this.sessions = new ENDPOINTS.Sessions(this.config);
        this.workflows = new ENDPOINTS.Workflows(this.config);
        this.platforms = new ENDPOINTS.Platforms(this.config);
        this.transfers = new ENDPOINTS.Transfers(this.config);
        this.balances = new ENDPOINTS.Balances(this.config);
        this.cardMetadata = new ENDPOINTS.CardMetadata(this.config);
        this.reports = new ENDPOINTS.Reports(this.config);
        this.financial = new ENDPOINTS.Financial(this.config);
        this.issuing = new ENDPOINTS.Issuing(this.config);
        this.paymentContexts = new ENDPOINTS.PaymentContexts(this.config);
        this.paymentSessions = new ENDPOINTS.PaymentSessions(this.config);
        this.paymentSetups = new ENDPOINTS.PaymentSetups(this.config);
        this.forward = new ENDPOINTS.Forward(this.config);
        this.paymentMethods = new ENDPOINTS.PaymentMethods(this.config);
        this.networkTokens = new ENDPOINTS.NetworkTokens(this.config);
        this.identities = new ENDPOINTS.Identities(this.config);
        this.accountUpdater = new ENDPOINTS.AccountUpdater(this.config);
    }
}
