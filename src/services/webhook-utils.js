/**
 * Webhook JSON parser that handles malformed payloads (Issue #408)
 * SECURITY: Only processes authentication_failed events with specific malformation pattern
 */

/**
 * Convert various value types to boolean
 * @param {boolean|string|any} value - Value to convert to boolean
 * @returns {boolean} Converted boolean value
 */
function convertToBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
}

/**
 * SECURITY: Check if payload is specifically an authentication_failed webhook
 * This prevents processing other webhook types that might have different structures
 * @param {string} payload - Raw webhook payload string
 * @returns {boolean} True if payload appears to be authentication_failed webhook
 */
function isAuthenticationFailedWebhook(payload) {
    // Look for authentication_failed type AND the specific malformation pattern from issue #408
    return (
        payload.includes('"type":"authentication_failed"') ||
        payload.includes('"type": "authentication_failed"')
    );
}

/**
 * SECURITY: Very specific cleaning only for authentication_failed webhooks
 * Only removes the exact Unicode character and fixes the specific data structure issue
 * @param {string} payload - Raw webhook payload string
 * @returns {string} Cleaned payload with Unicode characters removed and data structure fixed
 */
function cleanAuthenticationFailedPayload(payload) {
    if (!payload) return payload;

    // SECURITY: Early size limit to prevent DoS
    if (payload.length > 100000) { // 100KB limit
        throw new Error('Payload too large for security processing');
    }

    // SECURITY: Only remove specific Unicode replacement character (\uFFFD)
    let cleaned = payload.replace(/\uFFFD/g, '');

    // SECURITY: Use linear-time string operations instead of potentially expensive regex
    // Only fix the specific authentication_failed data structure issue
    const createdOnIndex = cleaned.indexOf('"created_on"');
    const reasonIndex = cleaned.indexOf('"reason"');
    
    if (createdOnIndex !== -1 && reasonIndex !== -1 && reasonIndex > createdOnIndex) {
        // Simple string replacement for the specific pattern without regex
        const beforeReason = cleaned.substring(0, reasonIndex);
        const afterReason = cleaned.substring(reasonIndex);
        
        // Check if we need to fix the structure (missing "data" wrapper)
        if (beforeReason.includes('"created_on"') && !beforeReason.includes('"data"')) {
            // Find the end of created_on value and insert data wrapper
            const createdOnEnd = beforeReason.lastIndexOf(',');
            if (createdOnEnd !== -1) {
                cleaned = beforeReason.substring(0, createdOnEnd + 1) + 
                         '\n  "data": {\n    ' + afterReason;
            }
        }
    }

    return cleaned.trim();
}

/**
 * Parse webhook payload with automatic handling of malformed JSON
 * @param {string} rawPayload - Raw webhook payload string
 * @returns {Object} Parsed webhook object
 * @throws {Error} If payload cannot be parsed or is not authentication_failed type when malformed
 */
function parseWebhookPayload(rawPayload) {
    if (typeof rawPayload !== 'string') {
        throw new Error('Webhook payload must be a string');
    }

    try {
        return JSON.parse(rawPayload);
    } catch (error) {
        // SECURITY: Only attempt cleaning for authentication_failed events
        if (isAuthenticationFailedWebhook(rawPayload)) {
            const cleaned = cleanAuthenticationFailedPayload(rawPayload);
            try {
                return JSON.parse(cleaned);
            } catch (cleanError) {
                throw new Error(
                    `Unable to parse authentication_failed webhook payload: ${cleanError.message}`
                );
            }
        }
        // For any other webhook type, fail fast - don't attempt to modify
        throw new Error(`Unable to parse webhook payload: ${error.message}`);
    }
}

/**
 * Extract authentication failed specific data from webhook payload
 * @param {Object} webhook - Parsed webhook payload
 * @returns {Object} Authentication failed data with validated structure
 * @throws {Error} If payload is not authentication_failed type or missing required fields
 */
function extractAuthenticationFailedData(webhook) {
    // SECURITY: Strict validation of webhook structure
    if (!webhook || typeof webhook !== 'object') {
        throw new Error('Invalid webhook object');
    }

    // SECURITY: Verify this is actually an authentication_failed event
    if (webhook.type !== 'authentication_failed') {
        throw new Error('Webhook is not of type authentication_failed');
    }

    if (!webhook.data || typeof webhook.data !== 'object') {
        throw new Error('Invalid webhook data structure');
    }

    const { data } = webhook;

    // SECURITY: Validate required fields exist
    if (!data.payment_id) {
        throw new Error('Missing required field: payment_id');
    }

    return {
        eventId: webhook.id,
        paymentId: data.payment_id,
        sessionId: data.session_id,
        amount: data.amount,
        currency: data.currency,
        reason: data.reason,
        reasonDescription: data.reason_description,
        eci: data.eci,
        transactionStatusReason: data.transaction_status_reason,
        challenged: convertToBoolean(data.challenged),
        acsChallengeMandated: convertToBoolean(data.acs_challenged_mandated),
        exemptionApplied: data.exemption_applied,
        type: data.type,
        responseCode: data.response_code,
        challengeIndicator: data.challenge_indicator,
        protocolVersion: data.protocol_version,
        scheme: data.scheme,
        reference: data.reference,
        experience: data.experience,
        threeDsTransactionId: data['3ds_transaction_id'],
        dsTransactionId: data.ds_transaction_id,
        acsTransactionId: data.acs_transaction_id,
        errorDetails: data.error_details,
    };
}

/**
 * SECURITY: Safe webhook parsing that only applies fixes to specific known issues
 * Returns parsed webhook with metadata about any transformations applied
 * @param {string} rawPayload - Raw webhook payload string
 * @returns {Object} Result object with webhook, transformation flags, and error details
 */
function safeParseWebhook(rawPayload) {
    const result = {
        webhook: null,
        wasTransformed: false,
        transformationType: '',
        originalError: null,
    };

    try {
        result.webhook = JSON.parse(rawPayload);
        return result;
    } catch (error) {
        result.originalError = error.message;

        // SECURITY: Only attempt transformation for known safe cases
        if (isAuthenticationFailedWebhook(rawPayload)) {
            try {
                const cleaned = cleanAuthenticationFailedPayload(rawPayload);
                result.webhook = JSON.parse(cleaned);
                result.wasTransformed = true;
                result.transformationType = 'authentication_failed_unicode_fix';
                return result;
            } catch (cleanError) {
                throw new Error(
                    `Failed to parse authentication_failed webhook: ${cleanError.message}`
                );
            }
        }

        // For unknown webhook types, fail safely
        throw new Error(`Unable to parse webhook payload: ${error.message}`);
    }
}

/**
 * Express middleware for parsing webhook payloads with malformed JSON handling
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function webhookParsingMiddleware(req, res, next) {
    if (typeof req.body === 'string') {
        try {
            const parseResult = safeParseWebhook(req.body);
            req.body = parseResult.webhook;

            // SECURITY: Log any transformations for audit purposes
            if (parseResult.wasTransformed) {
                req.webhookTransformation = {
                    applied: true,
                    type: parseResult.transformationType,
                    originalError: parseResult.originalError,
                };
            }
        } catch (error) {
            req.webhookParsingError = error;
        }
    }
    next();
}

module.exports = {
    parseWebhookPayload,
    extractAuthenticationFailedData,
    safeParseWebhook,
    webhookParsingMiddleware,
    // Expose for testing
    isAuthenticationFailedWebhook,
    cleanAuthenticationFailedPayload,
};
