
//@ts-ignore
import * as http from "http";

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
    PaymentLinks,
    Access,
    Forex,
    ApplePay,
    Sessions,
    Workflows,
    Marketplace
} from './index';

export type access = {
    token:string,
    type: string,
    scope: string,
    expires: Date
}

export type config = {
    host: string;
    sk: string;
    pk: string;
    timeout: number;
    agent?: http.Agent;
    headers?: Record<string, string>;
    access?:access,
    scope?: Array<string>,
    client?: string,
};

type options = {
    pk: string;
    timeout?: number;
    agent?: http.Agent;
    headers?: Record<string, string>;
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
    paymentLinks:PaymentLinks;
    access:Access;
    forex:Forex;
    applePay:ApplePay;
    sessions:Sessions;
    workflows:Workflows;
    marketplace:Marketplace;
    config: config;

    constructor(key?: string, options?: options);
}
