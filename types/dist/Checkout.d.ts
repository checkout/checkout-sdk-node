import { Payments, Sources, Tokens, Instruments, Webhooks } from './index';

export type config = {
    host: string;
    sk: string;
    pk: string;
    timeout: number;
};

type options = {
    timeout: number;
};

export default class Checkout {
    payments: Payments;
    sources: Sources;
    tokens: Tokens;
    instruments: Instruments;
    webhooks: Webhooks;
    config: config;

    constructor(key?: string, options?: options);
}
