/**
 * OAuth 2.0 client credentials scopes.
 *
 * Mirrors components.securitySchemes.OAuth.flows.clientCredentials.scopes in the Checkout.com API
 * specification, plus the five scopes the specification only references from per-operation
 * security requirements.
 *
 * `OAuthScope` is the union of every wire value. The `scope` option stays assignable from plain
 * `string` as well, so adopting these constants is optional and no existing code breaks.
 */
declare const OAuthScopes: {
    readonly ACCOUNTS: 'accounts';
    readonly AGENTIC_INVENTORY: 'agentic:inventory';
    readonly BALANCES: 'balances';
    readonly BALANCES_TOP_UP_INSTRUCTIONS: 'balances:top-up-instructions';
    readonly BALANCES_VIEW: 'balances:view';
    readonly CARD_MANAGEMENT: 'card-management';
    readonly COMPLIANCE_REQUESTS: 'compliance-requests';
    readonly COMPLIANCE_REQUESTS_READ: 'compliance-requests:read';
    readonly COMPLIANCE_REQUESTS_RESPOND: 'compliance-requests:respond';
    readonly DISPUTES: 'disputes';
    readonly DISPUTES_ACCEPT: 'disputes:accept';
    readonly DISPUTES_PROVIDE_EVIDENCE: 'disputes:provide-evidence';
    readonly DISPUTES_SCHEME_FILES: 'disputes:scheme-files';
    readonly DISPUTES_VIEW: 'disputes:view';
    readonly FILES: 'files';
    readonly FILES_DOWNLOAD: 'files:download';
    readonly FILES_RETRIEVE: 'files:retrieve';
    readonly FILES_UPLOAD: 'files:upload';
    readonly FINANCIAL_ACTIONS: 'financial-actions';
    readonly FINANCIAL_ACTIONS_VIEW: 'financial-actions:view';
    readonly FLOW: 'flow';
    readonly FLOW_EVENTS: 'flow:events';
    readonly FLOW_REFLOW: 'flow:reflow';
    readonly FLOW_WORKFLOWS: 'flow:workflows';
    readonly FORWARD: 'forward';
    readonly FORWARD_SECRETS: 'forward:secrets';
    readonly FX: 'fx';
    readonly GATEWAY: 'gateway';
    readonly GATEWAY_PAYMENT: 'gateway:payment';
    readonly GATEWAY_PAYMENT_AUTHORIZATION: 'gateway:payment-authorizations';
    readonly GATEWAY_PAYMENT_CANCELLATIONS: 'gateway:payment-cancellations';
    readonly GATEWAY_PAYMENT_CAPTURES: 'gateway:payment-captures';
    readonly GATEWAY_PAYMENT_CONTEXTS: 'gateway:payment-contexts';
    readonly GATEWAY_PAYMENT_DETAILS: 'gateway:payment-details';
    readonly GATEWAY_PAYMENT_REFUNDS: 'gateway:payment-refunds';
    readonly GATEWAY_PAYMENT_VOIDS: 'gateway:payment-voids';
    readonly IDENTITY_VERIFICATION: 'identity-verification';
    readonly ISSUING_CARD_MANAGEMENT_READ: 'issuing:card-management-read';
    readonly ISSUING_CARD_MANAGEMENT_WRITE: 'issuing:card-management-write';
    readonly ISSUING_CARD_MGMT: 'issuing:card-mgmt'; // not in spec; kept for backward compat
    readonly ISSUING_CLIENT: 'issuing:client'; // not in spec; kept for backward compat
    readonly ISSUING_CONTROLS_READ: 'issuing:controls-read';
    readonly ISSUING_CONTROLS_WRITE: 'issuing:controls-write';
    readonly ISSUING_DISPUTES: 'issuing-disputes';
    readonly ISSUING_DISPUTES_READ: 'issuing:disputes-read';
    readonly ISSUING_DISPUTES_WRITE: 'issuing:disputes-write';
    readonly ISSUING_TRANSACTIONS_READ: 'issuing:transactions-read';
    readonly ISSUING_TRANSACTIONS_WRITE: 'issuing:transactions-write';
    readonly MARKETPLACE: 'marketplace'; // not in spec; kept for backward compat
    readonly MIDDLEWARE: 'middleware';
    readonly MIDDLEWARE_GATEWAY: 'middleware:gateway'; // not in spec; kept for backward compat
    readonly MIDDLEWARE_MERCHANTS_PUBLIC: 'middleware:merchants-public';
    readonly MIDDLEWARE_MERCHANTS_SECRET: 'middleware:merchants-secret';
    readonly MIDDLEWARE_PAYMENT_CONTEXT: 'middleware:payment-context'; // not in spec; kept for backward compat
    readonly PAYMENT_CONTEXT: 'Payment Context';
    readonly PAYMENT_SESSIONS: 'payment-sessions';
    readonly PAYMENTS_SEARCH: 'payments:search';
    readonly PAYOUTS_BANK_DETAILS: 'payouts:bank-details';
    readonly REPORTS: 'reports';
    readonly REPORTS_VIEW: 'reports:view';
    readonly SESSIONS_APP: 'sessions:app';
    readonly SESSIONS_BROWSER: 'sessions:browser';
    readonly TRANSACTIONS: 'transactions';
    readonly TRANSFERS: 'transfers';
    readonly TRANSFERS_CREATE: 'transfers:create';
    readonly TRANSFERS_VIEW: 'transfers:view';
    readonly VAULT: 'vault';
    readonly VAULT_APME_ENROLLMENT: 'vault:apme-enrollment';
    readonly VAULT_CARD_METADATA: 'vault:card-metadata';
    readonly VAULT_CUSTOMERS: 'vault:customers';
    readonly VAULT_GPAYME_ENROLLMENT: 'vault:gpayme-enrollment';
    readonly VAULT_INSTRUMENTS: 'vault:instruments';
    readonly VAULT_NETWORK_TOKENS: 'vault:network-tokens';
    readonly VAULT_REAL_TIME_ACCOUNT_UPDATER: 'vault:real-time-account-updater';
    readonly VAULT_TOKENIZATION: 'vault:tokenization';
    readonly VAULT_TOKENS_METADATA: 'vault:tokens-metadata';
};

export type OAuthScope = (typeof OAuthScopes)[keyof typeof OAuthScopes];

export default OAuthScopes;
