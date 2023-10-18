import { AuthenticationError, } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

describe('Apple Pay', () => {
    it('should generate a certificate signing request', async () => {
        nock('https://api.sandbox.checkout.com').post('/applepay/signing-requests').reply(201, {
            content:
                '-----BEGIN CERTIFICATE REQUEST-----MIIBSTCB8AIBADCBjzELMAkGA1UEBhMCR0IxDzANBgNVBAgMBkxvbmRvbjEPMA0GA1UEBwwGTG9uZG9uMRUwEwYDVQQKDAxDaGVja291dC5jb20xCzAJBgNVBA8MAklUMRUwEwYDVQQDDAxjaGVja291dC5jb20xIzAhBgkqhkiG9w0BCQEWFHN1cHBvcnRAY2hlY2tvdXQuY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEX7NLQlhOnep5cXxaX62yrkaWAiMaY1TdDYg6CD0CNv9fuFa6zK3yZYuaAIIRwiFFwKJ9EKUNXD0/pixMu1WPszAKBggqhkjOPQQDAgNIADBFAiEAlZC6APP0zinbM7p3mVjjc6H8Hcf2rkhH0S+1oBAl8LcCIHdE2UgEXJrJpgXTLfFo05LXbquQgZmUq9gYVx7fsAno-----END CERTIFICATE REQUEST-----',
        });

        let cko = new Checkout('sk_sbox_n2dvcqjweokrqm4q7hlfcfqtn4m', {
            pk: 'pk_sbox_xg66bnn6tpspd6pt3psc7otrqa=',
        });

        const apple = await cko.applePay.generate();

        expect(apple.content).to.exist;
    });

    it('should upload a payment processing certificate', async () => {
        nock('https://api.sandbox.checkout.com').post('/applepay/certificates').reply(201, {
            id: 'aplc_edyp2wgokuyubfan5bnmei6q6m',
            public_key_hash: 'qTDHUJQKEEkvjOiLp1mCPWXUrZIJRv+6EPavTzSQZN4=',
            valid_from: '2022-01-02T12:27:28Z',
            valid_until: '2024-02-01T12:27:27Z',
        });

        let cko = new Checkout('sk_sbox_n2dvcqjweokrqm4q7hlfcfqtn4m', {
            pk: 'pk_sbox_xg66bnn6tpspd6pt3psc7otrqa=',
        });

        const apple = await cko.applePay.upload({
            content:
                'MIIEbDCCBBGgAwIBAgIIWIhVDKOv0OgwCgYIKoZIzj0EAwIwgYAxNDAyBgNVBAMM\r\nK0FwcGxlIFdvcmxkd2lkZSBEZXZlbG9wZXIgUmVsYXRpb25zIENBIC0gRzIxJjAk\r\nBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MRMwEQYDVQQKDApB\r\ncHBsZSBJbmMuMQswCQYDVQQGEwJVUzAeFw0yMjAxMDIxMjI3MjhaFw0yNDAyMDEx\r\nMjI3MjdaMIGcMSUwIwYKCZImiZPyLGQBAQwVbWVyY2hhbnQubm9kZS50ZXN0aW5n\r\nMTswOQYDVQQDDDJBcHBsZSBQYXkgUGF5bWVudCBQcm9jZXNzaW5nOm1lcmNoYW50\r\nLm5vZGUudGVzdGluZzETMBEGA1UECwwKODI2RjZNVko5ODEUMBIGA1UECgwLSW9h\r\nbiBHaGlzb2kxCzAJBgNVBAYTAlVTMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE\r\nX7NLQlhOnep5cXxaX62yrkaWAiMaY1TdDYg6CD0CNv9fuFa6zK3yZYuaAIIRwiFF\r\nwKJ9EKUNXD0/pixMu1WPs6OCAlUwggJRMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgw\r\nFoAUhLaEzDqGYnIWWZToGqO9SN863wswRwYIKwYBBQUHAQEEOzA5MDcGCCsGAQUF\r\nBzABhitodHRwOi8vb2NzcC5hcHBsZS5jb20vb2NzcDA0LWFwcGxld3dkcmNhMjAx\r\nMIIBHQYDVR0gBIIBFDCCARAwggEMBgkqhkiG92NkBQEwgf4wgcMGCCsGAQUFBwIC\r\nMIG2DIGzUmVsaWFuY2Ugb24gdGhpcyBjZXJ0aWZpY2F0ZSBieSBhbnkgcGFydHkg\r\nYXNzdW1lcyBhY2NlcHRhbmNlIG9mIHRoZSB0aGVuIGFwcGxpY2FibGUgc3RhbmRh\r\ncmQgdGVybXMgYW5kIGNvbmRpdGlvbnMgb2YgdXNlLCBjZXJ0aWZpY2F0ZSBwb2xp\r\nY3kgYW5kIGNlcnRpZmljYXRpb24gcHJhY3RpY2Ugc3RhdGVtZW50cy4wNgYIKwYB\r\nBQUHAgEWKmh0dHA6Ly93d3cuYXBwbGUuY29tL2NlcnRpZmljYXRlYXV0aG9yaXR5\r\nLzA2BgNVHR8ELzAtMCugKaAnhiVodHRwOi8vY3JsLmFwcGxlLmNvbS9hcHBsZXd3\r\nZHJjYTIuY3JsMB0GA1UdDgQWBBS7PqGnrAu+MN4hbIXf2j+gOT6sEjAOBgNVHQ8B\r\nAf8EBAMCAygwTwYJKoZIhvdjZAYgBEIMQDc3NTY0Q0QyN0QyNjYyNUQyMTEzOUI2\r\nMDc5NTIyNERFNzIxNjEzMjEzMzUxRUFBRTYwRjUzOTJEM0I5NTEwODYwCgYIKoZI\r\nzj0EAwIDSQAwRgIhAIrybJP4daLvUc41KFe+vUbAwRdUar66Qd3B1cnb3FwyAiEA\r\n+nsP+eKmXJcccoQzMe+hFvXN9uhOpPrVJ663+s3lzSM=',
        });

        expect(apple.public_key_hash).to.exist;
    });

    it('should throw AuthenticationError creating the certificate', async () => {
        nock('https://api.sandbox.checkout.com').post('/applepay/signing-requests').reply(401);

        try {
            let cko = new Checkout('sk_sbox_n2dvcqjweokrqm4q7hlfcfqtn4m', {
                pk: 'pk_sbox_xg66bnn6tpspd6pt3psc7otrqa=',
            });

            const apple = await cko.applePay.generate();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw AuthenticationError uploading the certificate', async () => {
        nock('https://api.sandbox.checkout.com').post('/applepay/certificates').reply(401);

        try {
            let cko = new Checkout('sk_sbox_n2dvcqjweokrqm4q7hlfcfqtn4m', {
                pk: 'pk_sbox_xg66bnn6tpspd6pt3psc7otrqa=',
            });

            const apple = await cko.applePay.upload({
                content:
                    'MIIEbDCCBBGgAwIBAgIIWIhVDKOv0OgwCgYIKoZIzj0EAwIwgYAxNDAyBgNVBAMM\r\nK0FwcGxlIFdvcmxkd2lkZSBEZXZlbG9wZXIgUmVsYXRpb25zIENBIC0gRzIxJjAk\r\nBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MRMwEQYDVQQKDApB\r\ncHBsZSBJbmMuMQswCQYDVQQGEwJVUzAeFw0yMjAxMDIxMjI3MjhaFw0yNDAyMDEx\r\nMjI3MjdaMIGcMSUwIwYKCZImiZPyLGQBAQwVbWVyY2hhbnQubm9kZS50ZXN0aW5n\r\nMTswOQYDVQQDDDJBcHBsZSBQYXkgUGF5bWVudCBQcm9jZXNzaW5nOm1lcmNoYW50\r\nLm5vZGUudGVzdGluZzETMBEGA1UECwwKODI2RjZNVko5ODEUMBIGA1UECgwLSW9h\r\nbiBHaGlzb2kxCzAJBgNVBAYTAlVTMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE\r\nX7NLQlhOnep5cXxaX62yrkaWAiMaY1TdDYg6CD0CNv9fuFa6zK3yZYuaAIIRwiFF\r\nwKJ9EKUNXD0/pixMu1WPs6OCAlUwggJRMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgw\r\nFoAUhLaEzDqGYnIWWZToGqO9SN863wswRwYIKwYBBQUHAQEEOzA5MDcGCCsGAQUF\r\nBzABhitodHRwOi8vb2NzcC5hcHBsZS5jb20vb2NzcDA0LWFwcGxld3dkcmNhMjAx\r\nMIIBHQYDVR0gBIIBFDCCARAwggEMBgkqhkiG92NkBQEwgf4wgcMGCCsGAQUFBwIC\r\nMIG2DIGzUmVsaWFuY2Ugb24gdGhpcyBjZXJ0aWZpY2F0ZSBieSBhbnkgcGFydHkg\r\nYXNzdW1lcyBhY2NlcHRhbmNlIG9mIHRoZSB0aGVuIGFwcGxpY2FibGUgc3RhbmRh\r\ncmQgdGVybXMgYW5kIGNvbmRpdGlvbnMgb2YgdXNlLCBjZXJ0aWZpY2F0ZSBwb2xp\r\nY3kgYW5kIGNlcnRpZmljYXRpb24gcHJhY3RpY2Ugc3RhdGVtZW50cy4wNgYIKwYB\r\nBQUHAgEWKmh0dHA6Ly93d3cuYXBwbGUuY29tL2NlcnRpZmljYXRlYXV0aG9yaXR5\r\nLzA2BgNVHR8ELzAtMCugKaAnhiVodHRwOi8vY3JsLmFwcGxlLmNvbS9hcHBsZXd3\r\nZHJjYTIuY3JsMB0GA1UdDgQWBBS7PqGnrAu+MN4hbIXf2j+gOT6sEjAOBgNVHQ8B\r\nAf8EBAMCAygwTwYJKoZIhvdjZAYgBEIMQDc3NTY0Q0QyN0QyNjYyNUQyMTEzOUI2\r\nMDc5NTIyNERFNzIxNjEzMjEzMzUxRUFBRTYwRjUzOTJEM0I5NTEwODYwCgYIKoZI\r\nzj0EAwIDSQAwRgIhAIrybJP4daLvUc41KFe+vUbAwRdUar66Qd3B1cnb3FwyAiEA\r\n+nsP+eKmXJcccoQzMe+hFvXN9uhOpPrVJ663+s3lzSM=',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
