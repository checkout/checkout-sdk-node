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
} from './index';

export type config = {
    host: string;
    sk: string;
    pk: string;
    timeout: number;
    agent?: http.Agent;
};

type options = {
    pk: string;
    timeout?: number;
    agent?: http.Agent;
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
    config: config;

    constructor(key?: string, options?: options);
}
