export interface WebhookPayload {
    id: string;
    type: string;
    version?: string;
    created_on?: string;
    data?: any;
    _links?: {
        self: {
            href: string;
        };
    };
}

export interface AuthenticationFailedErrorDetails {
    error_code?: string;
    error_description?: string;
    error_detail?: string;
    error_component?: string;
}

export interface AuthenticationFailedData {
    payment_id: string;
    session_id?: string;
    amount?: string;
    currency?: string;
    reason?: string;
    reason_description?: string;
    eci?: string;
    transaction_status_reason?: string;
    challenged?: boolean | string;
    acs_challenged_mandated?: boolean | string;
    exemption_applied?: string;
    type?: string;
    response_code?: string;
    challenge_indicator?: string;
    protocol_version?: string;
    scheme?: string;
    reference?: string;
    experience?: string;
    "3ds_transaction_id"?: string;
    ds_transaction_id?: string;
    acs_transaction_id?: string;
    error_details?: AuthenticationFailedErrorDetails;
}

export interface AuthenticationFailedWebhook extends WebhookPayload {
    type: 'authentication_failed';
    data: AuthenticationFailedData;
}

export interface ExtractedAuthenticationFailedData {
    eventId: string;
    paymentId: string;
    sessionId?: string;
    amount?: string;
    currency?: string;
    reason?: string;
    reasonDescription?: string;
    eci?: string;
    transactionStatusReason?: string;
    challenged: boolean;
    acsChallengeMandated: boolean;
    exemptionApplied?: string;
    type?: string;
    responseCode?: string;
    challengeIndicator?: string;
    protocolVersion?: string;
    scheme?: string;
    reference?: string;
    experience?: string;
    threeDsTransactionId?: string;
    dsTransactionId?: string;
    acsTransactionId?: string;
    errorDetails?: AuthenticationFailedErrorDetails;
}

export interface SafeParseResult {
    webhook: WebhookPayload | null;
    wasTransformed: boolean;
    transformationType: string;
    originalError: string | null;
}

export interface WebhookTransformation {
    applied: boolean;
    type: string;
    originalError: string;
}

export interface WebhookRequest extends Request {
    webhookTransformation?: WebhookTransformation;
    webhookParsingError?: Error;
}

/**
 * Parse webhook payload with automatic handling of malformed JSON
 * @param rawPayload - Raw webhook payload string
 * @returns Parsed webhook object
 * @throws Error if payload cannot be parsed or is not authentication_failed type
 */
export function parseWebhookPayload(rawPayload: string): WebhookPayload;

/**
 * Extract and validate authentication failure data from webhook
 * @param webhook - Parsed webhook object
 * @returns Structured authentication failure data with type conversion
 * @throws Error if webhook is not authentication_failed type or missing required fields
 */
export function extractAuthenticationFailedData(webhook: AuthenticationFailedWebhook): ExtractedAuthenticationFailedData;

/**
 * Safe webhook parsing with audit metadata
 * @param rawPayload - Raw webhook payload string
 * @returns Parse result with transformation metadata for audit purposes
 * @throws Error if payload cannot be parsed
 */
export function safeParseWebhook(rawPayload: string): SafeParseResult;

/**
 * Express.js middleware for automatic webhook parsing
 * @param req - Express request object (modified in place)
 * @param res - Express response object
 * @param next - Express next function
 */
export function webhookParsingMiddleware(req: WebhookRequest, res: Response, next: Function): void;

/**
 * Check if payload is an authentication_failed webhook (for security validation)
 * @param payload - Raw webhook payload string
 * @returns True if payload appears to be authentication_failed webhook
 */
export function isAuthenticationFailedWebhook(payload: string): boolean;

/**
 * Clean malformed authentication_failed webhook payload (security-focused)
 * @param payload - Raw webhook payload string
 * @returns Cleaned payload with Unicode characters removed and data structure fixed
 */
export function cleanAuthenticationFailedPayload(payload: string): string;
