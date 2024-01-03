//@ts-ignore
import * as http from 'http';

import {
    Access,
    ApplePay,
    Balances,
    Baloto,
    Boleto,
    CardMetadata,
    Customers,
    Disputes,
    Events,
    Fawry,
    Files,
    Financial,
    Forex,
    Giropay,
    HostedPayments,
    Ideal,
    Instruments,
    Issuing,
    Klarna,
    Oxxo,
    PagoFacil,
    PaymentContexts,
    PaymentLinks,
    PaymentSessions,
    Payments,
    Platforms,
    Rapipago,
    Reconciliation,
    Reports,
    Sepa,
    Sessions,
    Sources,
    Tokens,
    Transfers,
    Webhooks,
    Workflows,
} from './index';

export type access = {
    token: string;
    type: string;
    scope: string;
    expires: Date;
};

export type config = {
    host: string;
    sk: string;
    pk: string;
    timeout: number;
    agent?: http.Agent;
    headers?: Record<string, string>;
    access?: access;
    scope?: Array<string>;
    client?: string;
};

type options = {
    host?: string;
    timeout?: number;
    agent?: http.Agent;
    headers?: Record<string, string>;
    httpClient?: string;
} & (staticKeyOptions | oauthOptions);

type staticKeyOptions = {
    pk: string;
};

type oauthOptions = {
    client: string;
    scope?: Array<string>;
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
    config: config;

    constructor(key?: string, options?: options);
}
