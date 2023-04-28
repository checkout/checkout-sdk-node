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
    constructor(key?: string, options?: any);
    config: {
        timeout: any;
        agent: any;
        headers: any;
        access: any;
        secret: string;
        client: string;
        scope: string;
        host: any;
    } | {
        timeout: any;
        agent: any;
        headers: any;
        access: any;
        secret: string;
        pk: any;
        client: any;
        scope: any;
        host: any;
    } | {
        timeout: any;
        agent: any;
        headers: any;
        access: any;
        sk: any;
        pk: any;
        host: any;
    };
    payments: ENDPOINTS.Payments;
    sources: ENDPOINTS.Sources;
    tokens: ENDPOINTS.Tokens;
    instruments: ENDPOINTS.Instruments;
    webhooks: ENDPOINTS.Webhooks;
    events: ENDPOINTS.Events;
    disputes: ENDPOINTS.Disputes;
    files: ENDPOINTS.Files;
    reconciliation: ENDPOINTS.Reconciliation;
    customers: ENDPOINTS.Customers;
    hostedPayments: ENDPOINTS.HostedPayments;
    giropay: ENDPOINTS.Giropay;
    ideal: ENDPOINTS.Ideal;
    fawry: ENDPOINTS.Fawry;
    pagoFacil: ENDPOINTS.PagoFacil;
    rapipago: ENDPOINTS.Rapipago;
    boleto: ENDPOINTS.Boleto;
    baloto: ENDPOINTS.Baloto;
    oxxo: ENDPOINTS.Oxxo;
    klarna: ENDPOINTS.Klarna;
    sepa: ENDPOINTS.Sepa;
    paymentLinks: ENDPOINTS.PaymentLinks;
    risk: ENDPOINTS.Risk;
    access: ENDPOINTS.Access;
    forex: ENDPOINTS.Forex;
    applePay: ENDPOINTS.ApplePay;
    sessions: ENDPOINTS.Sessions;
    workflows: ENDPOINTS.Workflows;
    platforms: ENDPOINTS.Platforms;
    transfers: ENDPOINTS.Transfers;
    balances: ENDPOINTS.Balances;
    cardMetadata: ENDPOINTS.CardMetadata;
    reports: ENDPOINTS.Reports;
    financial: ENDPOINTS.Financial;
    issuing: ENDPOINTS.Issuing;
}
import * as ENDPOINTS from './index';
//# sourceMappingURL=Checkout.d.ts.map