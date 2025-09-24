/**
 * Simple example: Fix for GitHub Issue #408
 * Handles malformed authentication_failed webhooks with HTTP clients
 */

import { parseWebhookPayload, extractAuthenticationFailedData } from '../src/services/webhook-utils.js';
import { sanitizeForLog, sanitizePaymentId, sanitizeError, sanitizeAgainstLogInjection } from './utils/security.js';
import http from 'http';

// Use native fetch in Node 18+ only
const fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : undefined;
if (!fetch) {
    console.log('📝 Note: Native fetch is only available in Node 18+. Please upgrade your Node.js version.');
}

// Try to load axios
let axios;
try {
    axios = (await import('axios')).default;
} catch (error) {
    // axios not available, will use simulation
    console.log(`📝 Note: Install with: npm install axios, ${error.message}`);
}

// Example malformed payload from the issue
const malformedPayload = `{
  "id": "evt_ql5mtq624twrdnpkajbkyeqaai",
  "type": "authentication_failed",
  "version": "2.1.0",
  "created_on": "2025-09-15T07:31:18.241Z",
�
{
    "reason": "Declined",
    "payment_id": "pay_xxx",
    "session_id": "sid_xxx",
    "amount": "13606",
    "currency": "EUR",
    "response_code": "N",
    "challenged": true
  }
}`;

console.log('Testing malformed webhook...');

try {
    // This would fail with standard JSON.parse
    console.log('Standard JSON.parse fails');
    JSON.parse(malformedPayload);
} catch (error) {
    console.log('Expected failure:', error.message.substring(0, 50) + '...');
}

try {
    // Our utils handle it
    console.log('\nUsing webhook-utils...');
    const webhook = parseWebhookPayload(malformedPayload);
    const data = extractAuthenticationFailedData(webhook);
    
    console.log('Success! Extracted data:');
    console.log(`Payment ID: ${sanitizeForLog(data.paymentId)}`);
    console.log(`Amount: ${sanitizeForLog(data.amount)} ${sanitizeForLog(data.currency)}`);
    console.log(`Reason: ${sanitizeForLog(data.reason)}`);
    console.log(`Challenged: ${sanitizeForLog(data.challenged)}`);
    
} catch (error) {
    console.error('Failed:', error.message);
}

// === HTTP CLIENT EXAMPLES ===

// Example 1: Using with native fetch (compatible with Node 18+)
async function handleWebhookWithFetch(rawPayload) {
    console.log('\n🌐 Example: Using with native fetch');
    
    try {
        if (!fetch) {
            console.log('📝 Note: Native fetch is only available in Node 18+. Please upgrade your Node.js version.');
        } else {
            console.log('📝 Native fetch available for HTTP requests');
        }
        
        // Process webhook payload (main functionality)
        const webhook = parseWebhookPayload(rawPayload);
        const data = extractAuthenticationFailedData(webhook);
        
        console.log('✅ Processed payment:', sanitizePaymentId(data.paymentId));
        console.log(`   Status: ${fetch ? 'native fetch available' : 'simulation mode'}`);
        
        return data;
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Example 2: Using with axios
async function handleWebhookWithAxios(rawPayload) {
    console.log('\n📡 Example: Using with axios');
    
    try {
        if (!axios) {
            console.log('📝 Note: Install with: npm install axios');
        } else {
            console.log('📝 axios available for HTTP requests');
        }
        
        // Process webhook payload (main functionality)
        const webhook = parseWebhookPayload(rawPayload);
        const data = extractAuthenticationFailedData(webhook);
        
        console.log('✅ Processed payment:', sanitizePaymentId(data.paymentId));
        console.log(`   Status: ${axios ? 'axios available' : 'simulation mode'}`);
        
        return data;
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Example 3: Node.js HTTP server (built-in, no dependencies)
function createNodeHttpWebhookServer() {
    console.log('\n🌐 Example: Node.js HTTP server');
    
    const server = http.createServer((req, res) => {
        if (req.method === 'POST' && req.url === '/webhooks/auth-failed') {
            let rawPayload = '';
            
            req.on('data', chunk => {
                rawPayload += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const webhook = parseWebhookPayload(rawPayload);
                    
                    if (webhook.type === 'authentication_failed') {
                        const data = extractAuthenticationFailedData(webhook);
                        
                        console.log(`🔄 Received auth failure: ${sanitizePaymentId(data.paymentId)}`);
                        processAuthFailure(data);
                        
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ received: true, paymentId: sanitizePaymentId(data.paymentId) }));
                    } else {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Unexpected webhook type' }));
                    }
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Processing failed' }));
                    console.error('❌ Processing error:', sanitizeError(error.message));
                }
            });
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    });
    
    console.log('📝 Ready: POST /webhooks/auth-failed');
    return server;
}

// Business logic function
function processAuthFailure(authData) {
    const actions = [];
    
    if (authData.challenged) {
        actions.push('Customer challenged but failed');
    }
    
    if (parseInt(authData.amount) > 10000) {
        actions.push('High value - manual review');
    }
    
    actions.push('Notify customer', 'Log for analysis');
    console.log('📋 Actions:', actions.join(', '));
    
    return actions;
}

// Usage in webhook handler (generic)
function webhookHandler(rawPayload) {
    try {
        const webhook = parseWebhookPayload(rawPayload);
        
        if (webhook.type === 'authentication_failed') {
            const data = extractAuthenticationFailedData(webhook);
            
            console.log(`\n🔄 Processing auth failure: ${sanitizePaymentId(data.paymentId)}`);
            if (data.challenged) {
                console.log('   Customer challenged but failed');
            }
            
            return { success: true, paymentId: sanitizePaymentId(data.paymentId) };
        }
        
        return { success: false, reason: 'Not auth_failed event' };
    } catch (error) {
        return { success: false, error: sanitizeError(error.message) };
    }
}

console.log('\n--- Testing webhook handler ---');
const result = webhookHandler(malformedPayload);
console.log('Result:', result);

// Demo examples
handleWebhookWithFetch(malformedPayload);
handleWebhookWithAxios(malformedPayload);

console.log('\n--- HTTP Server ---');
createNodeHttpWebhookServer();

// Demonstration of Log Injection Protection
console.log('\n--- Log Injection Protection Demo ---\n');

console.log('�️  Testing Log Injection Protection:');

// Simulate malicious inputs that could be injected into logs
const maliciousInputs = [
    'normal_user\n2024-01-01 00:00:00 ADMIN login successful',
    'user<script>alert("xss")</script>input',
    'user${process.exit()}input',
    'user javascript:alert(1) input',
    'user onclick="malicious()" input',
    'user/* hidden code */input',
    'user/../../../etc/passwd'
];

maliciousInputs.forEach((input, i) => {
    const sanitized = sanitizeAgainstLogInjection(input);
    console.log(`${i + 1}. Input:  ${sanitizeForLog(input.slice(0, 30))}...`);
    console.log(`   Output: ${sanitized}`);
});

console.log('\n�💡 Usage Tips:');
console.log('1. Use parseWebhookPayload() for malformed JSON');
console.log('2. Works with node-fetch, axios, or native http');
console.log('3. Handles Unicode issues automatically');
console.log('4. sanitizeAgainstLogInjection() prevents advanced log attacks');

export { 
    webhookHandler, 
    handleWebhookWithFetch, 
    handleWebhookWithAxios,
    createNodeHttpWebhookServer,
    processAuthFailure
};
