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
                pk: determinePublicKey(options),
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
            access: undefined,
            agent: options && options.agent ? options.agent : undefined,
            headers: options && options.headers ? options.headers : {},
            timeout: options && options.timeout ? options.timeout : CONFIG.DEFAULT_TIMEOUT,
        };

        this.access = new ENDPOINTS.Access(this.config);
        this.applePay = new ENDPOINTS.ApplePay(this.config);
        this.boleto = new ENDPOINTS.Boleto(this.config);
        this.baloto = new ENDPOINTS.Baloto(this.config);
        this.balances = new ENDPOINTS.Balances(this.config);
        this.cardMetadata = new ENDPOINTS.CardMetadata(this.config);
        this.customers = new ENDPOINTS.Customers(this.config);
        this.disputes = new ENDPOINTS.Disputes(this.config);
        this.events = new ENDPOINTS.Events(this.config);
        this.fawry = new ENDPOINTS.Fawry(this.config);
        this.files = new ENDPOINTS.Files(this.config);
        this.financial = new ENDPOINTS.Financial(this.config);
        this.forex = new ENDPOINTS.Forex(this.config);
        this.giropay = new ENDPOINTS.Giropay(this.config);
        this.hostedPayments = new ENDPOINTS.HostedPayments(this.config);
        this.ideal = new ENDPOINTS.Ideal(this.config);
        this.instruments = new ENDPOINTS.Instruments(this.config);
        this.klarna = new ENDPOINTS.Klarna(this.config);
        this.oxxo = new ENDPOINTS.Oxxo(this.config);
        this.pagoFacil = new ENDPOINTS.PagoFacil(this.config);
        this.payments = new ENDPOINTS.Payments(this.config);
        this.paymentLinks = new ENDPOINTS.PaymentLinks(this.config);
        this.platforms = new ENDPOINTS.Platforms(this.config);
        this.rapipago = new ENDPOINTS.Rapipago(this.config);
        this.reconciliation = new ENDPOINTS.Reconciliation(this.config);
        this.reports = new ENDPOINTS.Reports(this.config);
        this.risk = new ENDPOINTS.Risk(this.config);
        this.sepa = new ENDPOINTS.Sepa(this.config);
        this.sessions = new ENDPOINTS.Sessions(this.config);
        this.sources = new ENDPOINTS.Sources(this.config);
        this.tokens = new ENDPOINTS.Tokens(this.config);
        this.transfers = new ENDPOINTS.Transfers(this.config);
        this.workflows = new ENDPOINTS.Workflows(this.config);
        this.webhooks = new ENDPOINTS.Webhooks(this.config);
    }

    accessClient(config) {
        this.access = new ENDPOINTS.Access(config);
        return this;
    }

    applePayClient(config) {
        this.applePay = new ENDPOINTS.ApplePay(config);
    }

    boletoClient(config) {
        this.boleto = new ENDPOINTS.Boleto(config);
    }

    balotoClient(config) {
        this.baloto = new ENDPOINTS.Baloto(config);
    }

    balancesClient(config) {
        this.balances = new ENDPOINTS.Balances(config);
    }

    cardMetadataClient(config) {
        this.cardMetadata = new ENDPOINTS.CardMetadata(config);
    }

    customerClient(config) {
        this.customers = new ENDPOINTS.Customers(config);
    }

    disputesClient(config) {
        this.disputes = new ENDPOINTS.Disputes(config);
    }

    eventsClient(config) {
        this.events = new ENDPOINTS.Events(config);
    }

    fawryClient(config) {
        this.fawry = new ENDPOINTS.Fawry(config);
    }

    filesClient(config) {
        this.files = new ENDPOINTS.Files(config);
    }

    financialClient(config) {
        this.financial = new ENDPOINTS.Financial(config);
    }

    forexClient(config) {
        this.forex = new ENDPOINTS.Forex(config);
    }

    giropayClient(config) {
        this.giropay = new ENDPOINTS.Giropay(config);
    }

    hostedPaymentsClient(config) {
        this.hostedPayments = new ENDPOINTS.HostedPayments(config);
    }

    idealClient(config) {
        this.ideal = new ENDPOINTS.Ideal(config);
    }

    instrumentsClient(config) {
        this.instruments = new ENDPOINTS.Instruments(config);
    }

    klarnaClient(config) {
        this.klarna = new ENDPOINTS.Klarna(config);
    }

    oxxoClient(config) {
        this.oxxo = new ENDPOINTS.Oxxo(config);
    }

    pagoFacilClient(config) {
        this.pagoFacil = new ENDPOINTS.PagoFacil(config);
    }
    paymentsClient(config) {
        this.payments = new ENDPOINTS.Payments(config);
    }
    paymentLinksClient(config) {
        this.paymentLinks = new ENDPOINTS.PaymentLinks(config);
    }
    platformsClient(config) {
        this.platforms = new ENDPOINTS.Platforms(config);
    }
    rapipagoClient(config) {
        this.rapipago = new ENDPOINTS.Rapipago(config);
    }
    reconciliationClient(config) {
        this.reconciliation = new ENDPOINTS.Reconciliation(config);
    }
    reportsClient(config) {
        this.reports = new ENDPOINTS.Reports(config);
    }
    riskClient(config) {
        this.risk = new ENDPOINTS.Risk(config);
    }
    sepaClient(config) {
        this.sepa = new ENDPOINTS.Sepa(config);
    }
    sessionsClient(config) {
        this.sessions = new ENDPOINTS.Sessions(config);
    }
    sourcesClient(config) {
        this.sources = new ENDPOINTS.Sources(config);
    }
    tokensClient(config) {
        this.tokens = new ENDPOINTS.Tokens(config);
    }
    transfersClient(config) {
        this.transfers = new ENDPOINTS.Transfers(config);
    }
    workflowsClient(config) {
        this.workflows = new ENDPOINTS.Workflows(config);
    }
    webhooksClient(config) {
        this.webhooks = new ENDPOINTS.Webhooks(config);
    }

    build() {
        return {
            config: this.config,
            access: this.access,
            applePay: this.applePay,
            boleto: this.boleto,
            baloto: this.baloto,
            balances: this.balances,
            cardMetadata: this.cardMetadata,
            customers: this.customers,
            disputes: this.disputes,
            events: this.events,
            fawry: this.fawry,
            files: this.files,
            financial: this.financial,
            forex: this.forex,
            giropay: this.giropay,
            hostedPayments: this.hostedPayments,
            ideal: this.ideal,
            instruments: this.instruments,
            klarna: this.klarna,
            oxxo: this.oxxo,
            pagoFacil: this.pagoFacil,
            payments: this.payments,
            paymentLinks: this.paymentLinks,
            platforms: this.platforms,
            rapipago: this.rapipago,
            reconciliation: this.reconciliation,
            reports: this.reports,
            risk: this.risk,
            sepa: this.sepa,
            sessions: this.sessions,
            sources: this.sources,
            tokens: this.tokens,
            transfers: this.transfers,
            workflows: this.workflows,
            webhooks: this.webhooks
        }
    }

}
