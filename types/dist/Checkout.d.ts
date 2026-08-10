//@ts-ignore
import * as http from 'http';

import {
    Access,
    AccountUpdater,
    AgenticCommerce,
    ApplePay,
    Balances,
    Baloto,
    Boleto,
    CardMetadata,
    ComplianceRequests,
    Customers,
    Disputes,
    Events,
    Fawry,
    Files,
    Financial,
    Forex,
    Forward,
    Giropay,
    GooglePay,
    HostedPayments,
    Ideal,
    Identities,
    Instruments,
    Issuing,
    Klarna,
    NetworkTokens,
    OnboardingSimulator,
    Oxxo,
    PagoFacil,
    PaymentContexts,
    PaymentLinks,
    PaymentMethods,
    PaymentSessions,
    PaymentSetups,
    Payments,
    Platforms,
    Rapipago,
    Reconciliation,
    Reports,
    Risk,
    Sepa,
    Sessions,
    Sources,
    Tokens,
    Transfers,
    Webhooks,
    Workflows,
} from './index';

import Environment from './Environment';
import EnvironmentSubdomain from './EnvironmentSubdomain';

export type access = {
    token: string;
    type: string;
    scope: string;
    expires: Date;
};

export type config = {
    host: string;
    sk?: string;
    pk?: string;
    secret?: string;
    client?: string;
    scope?: string | Array<string>;
    timeout: number;
    agent?: http.Agent;
    headers?: Record<string, string>;
    access?: access;
    httpClient?: string;
    subdomain?: string;
    /** @deprecated emergency fallback only, see the README. Use `subdomain` instead. */
    useLegacyDomain?: boolean;
    environment?: Environment;
    environmentSubdomain?: EnvironmentSubdomain;
};

type options = {
    host?: string;
    timeout?: number;
    agent?: http.Agent;
    headers?: Record<string, string>;
    httpClient?: string;
    /**
     * Your merchant-specific subdomain (MSSD): the first 8 characters of your client ID.
     * Required, unless you explicitly opt out with `useLegacyDomain`.
     */
    subdomain?: string;
    /**
     * Sends every request to the shared hosts instead of your merchant-specific subdomain.
     *
     * @deprecated this is an emergency fallback for the rare case where the subdomain cannot
     * be used, and will be removed in a future release. Set `subdomain` instead.
     * See https://api-reference.checkout.com/#section/Base-URLs
     */
    useLegacyDomain?: boolean;
} & (staticKeyOptions | oauthOptions);

type staticKeyOptions = {
    pk?: string;
};

type oauthOptions = {
    client: string;
    scope?: string | Array<string>;
    environment?: string;
};

export default class Checkout {
    payments: Payments;
    sources: Sources;
    tokens: Tokens;
    instruments: Instruments;
    webhooks: Webhooks;
    events: Events;
    disputes: Disputes;
    files: Files;
    reconciliation: Reconciliation;
    customers: Customers;
    hostedPayments: HostedPayments;
    giropay: Giropay;
    ideal: Ideal;
    fawry: Fawry;
    pagoFacil: PagoFacil;
    rapipago: Rapipago;
    boleto: Boleto;
    baloto: Baloto;
    oxxo: Oxxo;
    klarna: Klarna;
    sepa: Sepa;
    paymentLinks: PaymentLinks;
    access: Access;
    forex: Forex;
    applePay: ApplePay;
    sessions: Sessions;
    workflows: Workflows;
    platforms: Platforms;
    transfers: Transfers;
    balances: Balances;
    cardMetadata: CardMetadata;
    reports: Reports;
    financial: Financial;
    issuing: Issuing;
    paymentContexts: PaymentContexts;
    paymentSessions: PaymentSessions;
    paymentSetups: PaymentSetups;
    forward: Forward;
    paymentMethods: PaymentMethods;
    networkTokens: NetworkTokens;
    identities: Identities;
    accountUpdater: AccountUpdater;
    risk: Risk;
    agenticCommerce: AgenticCommerce;
    complianceRequests: ComplianceRequests;
    googlePay: GooglePay;
    onboardingSimulator: OnboardingSimulator;
    config: config;

    constructor(key?: string, options?: options);
}
