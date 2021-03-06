
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
    PaymentLinks
} from './index';

export type config = {
    host: string;
    sk: string;
    pk: string;
    timeout: number;
    agent?: http.Agent;
    headers?: Record<string, string>;
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
    config: config;

    constructor(key?: string, options?: options);
}
