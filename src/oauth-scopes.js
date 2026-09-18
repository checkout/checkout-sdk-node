/**
 * OAuth 2.0 client credentials scopes.
 *
 * Mirrors components.securitySchemes.OAuth.flows.clientCredentials.scopes in the Checkout.com API
 * specification, plus the scopes that appear only in per-operation security requirements and are
 * never declared in that map: compliance-requests, compliance-requests:read,
 * compliance-requests:respond, vault:gpayme-enrollment and vault:tokens-metadata.
 *
 * Passing scopes as plain strings still works and is not deprecated -- these constants exist so the
 * wire values are written down once, spell-checked by the type declarations, and kept in step with
 * the other Checkout SDKs.
 *
 * Keys are ordered alphabetically. Note that PAYMENT_CONTEXT and GATEWAY_PAYMENT_CONTEXTS are
 * different scopes: the specification requires the former for GET /payment-contexts/{id} and the
 * latter for POST /payment-contexts. 'Payment Context' is the only scope whose wire value contains
 * a space and a capital letter, which looks like a specification authoring defect; it is mirrored
 * verbatim regardless, because that is the value the authorization server is documented to accept.
 */
const OAuthScopes = Object.freeze({
    ACCOUNTS: 'accounts',
    AGENTIC_INVENTORY: 'agentic:inventory',
    BALANCES: 'balances',
    BALANCES_TOP_UP_INSTRUCTIONS: 'balances:top-up-instructions',
    BALANCES_VIEW: 'balances:view',
    CARD_MANAGEMENT: 'card-management',
    COMPLIANCE_REQUESTS: 'compliance-requests',
    COMPLIANCE_REQUESTS_READ: 'compliance-requests:read',
    COMPLIANCE_REQUESTS_RESPOND: 'compliance-requests:respond',
    DISPUTES: 'disputes',
    DISPUTES_ACCEPT: 'disputes:accept',
    DISPUTES_PROVIDE_EVIDENCE: 'disputes:provide-evidence',
    DISPUTES_SCHEME_FILES: 'disputes:scheme-files',
    DISPUTES_VIEW: 'disputes:view',
    FILES: 'files',
    FILES_DOWNLOAD: 'files:download',
    FILES_RETRIEVE: 'files:retrieve',
    FILES_UPLOAD: 'files:upload',
    FINANCIAL_ACTIONS: 'financial-actions',
    FINANCIAL_ACTIONS_VIEW: 'financial-actions:view',
    FLOW: 'flow',
    FLOW_EVENTS: 'flow:events',
    FLOW_REFLOW: 'flow:reflow',
    FLOW_WORKFLOWS: 'flow:workflows',
    FORWARD: 'forward',
    FORWARD_SECRETS: 'forward:secrets',
    FX: 'fx',
    GATEWAY: 'gateway',
    GATEWAY_PAYMENT: 'gateway:payment',
    GATEWAY_PAYMENT_AUTHORIZATION: 'gateway:payment-authorizations',
    GATEWAY_PAYMENT_CANCELLATIONS: 'gateway:payment-cancellations',
    GATEWAY_PAYMENT_CAPTURES: 'gateway:payment-captures',
    GATEWAY_PAYMENT_CONTEXTS: 'gateway:payment-contexts',
    GATEWAY_PAYMENT_DETAILS: 'gateway:payment-details',
    GATEWAY_PAYMENT_REFUNDS: 'gateway:payment-refunds',
    GATEWAY_PAYMENT_VOIDS: 'gateway:payment-voids',
    IDENTITY_VERIFICATION: 'identity-verification',
    ISSUING_CARD_MANAGEMENT_READ: 'issuing:card-management-read',
    ISSUING_CARD_MANAGEMENT_WRITE: 'issuing:card-management-write',
    ISSUING_CONTROLS_READ: 'issuing:controls-read',
    ISSUING_CONTROLS_WRITE: 'issuing:controls-write',
    ISSUING_DISPUTES: 'issuing-disputes',
    ISSUING_DISPUTES_READ: 'issuing:disputes-read',
    ISSUING_DISPUTES_WRITE: 'issuing:disputes-write',
    ISSUING_TRANSACTIONS_READ: 'issuing:transactions-read',
    ISSUING_TRANSACTIONS_WRITE: 'issuing:transactions-write',
    MIDDLEWARE: 'middleware',
    MIDDLEWARE_MERCHANTS_PUBLIC: 'middleware:merchants-public',
    MIDDLEWARE_MERCHANTS_SECRET: 'middleware:merchants-secret',
    PAYMENT_CONTEXT: 'Payment Context',
    PAYMENT_SESSIONS: 'payment-sessions',
    PAYMENTS_SEARCH: 'payments:search',
    PAYOUTS_BANK_DETAILS: 'payouts:bank-details',
    REPORTS: 'reports',
    REPORTS_VIEW: 'reports:view',
    SESSIONS_APP: 'sessions:app',
    SESSIONS_BROWSER: 'sessions:browser',
    TRANSACTIONS: 'transactions',
    TRANSFERS: 'transfers',
    TRANSFERS_CREATE: 'transfers:create',
    TRANSFERS_VIEW: 'transfers:view',
    VAULT: 'vault',
    VAULT_APME_ENROLLMENT: 'vault:apme-enrollment',
    VAULT_CARD_METADATA: 'vault:card-metadata',
    VAULT_CUSTOMERS: 'vault:customers',
    VAULT_GPAYME_ENROLLMENT: 'vault:gpayme-enrollment',
    VAULT_INSTRUMENTS: 'vault:instruments',
    VAULT_NETWORK_TOKENS: 'vault:network-tokens',
    VAULT_REAL_TIME_ACCOUNT_UPDATER: 'vault:real-time-account-updater',
    VAULT_TOKENIZATION: 'vault:tokenization',
    VAULT_TOKENS_METADATA: 'vault:tokens-metadata',
});

export default OAuthScopes;
