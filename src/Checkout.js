import { DEFAULT_TIMEOUT, LIVE_BASE_URL, LIVE_SECRET_KEY_REGEX, SANDBOX_BASE_URL } from './config';
import {
    Payments,
    Sources,
    Tokens,
    Instruments,
    Webhooks,
    Events,
    Disputes,
    Files,
    Reconciliation,
    Customers,
    HostedPayments,
    Giropay,
    Ideal,
    Fawry,
    PagoFacil,
    Rapipago,
    Boleto,
    Baloto,
    Oxxo,
    Klarna,
    Sepa,
} from './index';

const determineHost = (key, options) => {
    // Unless specified, determine the hosted based on the secret key
    if (options && options.host) {
        return options.host;
    }
    return LIVE_SECRET_KEY_REGEX.test(key) ? LIVE_BASE_URL : SANDBOX_BASE_URL;
};

const determineSecretKey = (key) => {
    // Unless specified, check environment variables for the key
    return !key ? process.env.CKO_SECRET_KEY || '' : key;
};

const determinePublicKey = (options) => {
    // Unless specified, check environment variables for the key
    if (options && options.pk) {
        return options.pk;
    }
    return process.env.CKO_PUBLIC_KEY || '';
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
        this.config = {
            sk: determineSecretKey(key),
            pk: determinePublicKey(options),
            host: determineHost(key, options),
            timeout: options && options.timeout ? options.timeout : DEFAULT_TIMEOUT,
            agent: options && options.agent ? options.agent : undefined,
        };

        this.payments = new Payments(this.config);
        this.sources = new Sources(this.config);
        this.tokens = new Tokens(this.config);
        this.instruments = new Instruments(this.config);
        this.webhooks = new Webhooks(this.config);
        this.events = new Events(this.config);
        this.disputes = new Disputes(this.config);
        this.files = new Files(this.config);
        this.reconciliation = new Reconciliation(this.config);
        this.customers = new Customers(this.config);
        this.hostedPayments = new HostedPayments(this.config);
        this.giropay = new Giropay(this.config);
        this.ideal = new Ideal(this.config);
        this.fawry = new Fawry(this.config);
        this.pagoFacil = new PagoFacil(this.config);
        this.rapipago = new Rapipago(this.config);
        this.boleto = new Boleto(this.config);
        this.baloto = new Baloto(this.config);
        this.oxxo = new Oxxo(this.config);
        this.klarna = new Klarna(this.config);
        this.sepa = new Sepa(this.config);
    }
}
