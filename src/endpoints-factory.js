import * as ENDPOINTS from './index.js';

/**
 * Factory for creating all API endpoint instances
 * Centralizes endpoint initialization for better maintainability
 */
export function createEndpoints(config) {
    return {
        access: new ENDPOINTS.Access(config),
        accountUpdater: new ENDPOINTS.AccountUpdater(config),
        applePay: new ENDPOINTS.ApplePay(config),
        balances: new ENDPOINTS.Balances(config),
        baloto: new ENDPOINTS.Baloto(config),
        boleto: new ENDPOINTS.Boleto(config),
        cardMetadata: new ENDPOINTS.CardMetadata(config),
        customers: new ENDPOINTS.Customers(config),
        disputes: new ENDPOINTS.Disputes(config),
        events: new ENDPOINTS.Events(config),
        fawry: new ENDPOINTS.Fawry(config),
        files: new ENDPOINTS.Files(config),
        financial: new ENDPOINTS.Financial(config),
        forex: new ENDPOINTS.Forex(config),
        forward: new ENDPOINTS.Forward(config),
        giropay: new ENDPOINTS.Giropay(config),
        hostedPayments: new ENDPOINTS.HostedPayments(config),
        ideal: new ENDPOINTS.Ideal(config),
        identities: new ENDPOINTS.Identities(config),
        instruments: new ENDPOINTS.Instruments(config),
        issuing: new ENDPOINTS.Issuing(config),
        klarna: new ENDPOINTS.Klarna(config),
        networkTokens: new ENDPOINTS.NetworkTokens(config),
        oxxo: new ENDPOINTS.Oxxo(config),
        pagoFacil: new ENDPOINTS.PagoFacil(config),
        paymentContexts: new ENDPOINTS.PaymentContexts(config),
        paymentLinks: new ENDPOINTS.PaymentLinks(config),
        paymentMethods: new ENDPOINTS.PaymentMethods(config),
        paymentSessions: new ENDPOINTS.PaymentSessions(config),
        paymentSetups: new ENDPOINTS.PaymentSetups(config),
        payments: new ENDPOINTS.Payments(config),
        platforms: new ENDPOINTS.Platforms(config),
        rapipago: new ENDPOINTS.Rapipago(config),
        reconciliation: new ENDPOINTS.Reconciliation(config),
        reports: new ENDPOINTS.Reports(config),
        risk: new ENDPOINTS.Risk(config),
        sepa: new ENDPOINTS.Sepa(config),
        sessions: new ENDPOINTS.Sessions(config),
        sources: new ENDPOINTS.Sources(config),
        tokens: new ENDPOINTS.Tokens(config),
        transfers: new ENDPOINTS.Transfers(config),
        webhooks: new ENDPOINTS.Webhooks(config),
        workflows: new ENDPOINTS.Workflows(config),
    };
}
