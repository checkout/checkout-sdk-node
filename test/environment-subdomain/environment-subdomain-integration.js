import { Checkout } from '../../src/index.js';
import Environment from '../../src/Environment.js';
import EnvironmentSubdomain from '../../src/EnvironmentSubdomain.js';
import { expect } from 'chai';

describe('SDK Subdomain Integration', () => {
    const CLIENT_ID = 'ack_vvzhoai466su3j3vbxb47ts5oe';
    const SECRET_KEY = '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-';

    describe('OAuth initialization with subdomains', () => {
        it('should initialize with OAuth credentials and valid short subdomain for sandbox', () => {
            const cko = new Checkout(SECRET_KEY, {
                client: CLIENT_ID,
                scope: ['gateway'],
                environment: 'sandbox',
                subdomain: 'ab123456'
            });

            expect(cko).to.be.instanceOf(Checkout);
            expect(cko.config.client).to.equal(CLIENT_ID);
            expect(cko.config.host).to.equal('https://ab123456.api.sandbox.checkout.com');
            expect(cko.config.scope[0]).to.equal('gateway');
            expect(cko.config.secret).to.equal(SECRET_KEY);
            expect(cko.config.environment).to.be.instanceOf(Environment);
            expect(cko.config.environmentSubdomain).to.be.instanceOf(EnvironmentSubdomain);
            expect(cko.config.environmentSubdomain.subdomain).to.equal('ab123456');
        });

        it('should initialize with OAuth credentials and valid long subdomain for sandbox', () => {
            const cko = new Checkout(SECRET_KEY, {
                client: CLIENT_ID,
                scope: ['gateway'],
                environment: 'sandbox',
                subdomain: 'longmerchant'
            });

            expect(cko.config.host).to.equal('https://longmerchant.api.sandbox.checkout.com');
            expect(cko.config.environment.environment).to.equal('SANDBOX');
            expect(cko.config.environmentSubdomain.subdomain).to.equal('longmerchant');
            expect(cko.config.environmentSubdomain.getOAuthAuthorizationApi()).to.equal('https://longmerchant.access.sandbox.checkout.com/connect/token');
        });

        it('should initialize with OAuth credentials and valid subdomain for live', () => {
            const cko = new Checkout(SECRET_KEY, {
                client: CLIENT_ID,
                scope: ['gateway'],
                environment: 'live',
                subdomain: 'prodmerch1'
            });

            expect(cko.config.host).to.equal('https://prodmerch1.api.checkout.com');
            expect(cko.config.environment.environment).to.equal('LIVE');
            expect(cko.config.environmentSubdomain.subdomain).to.equal('prodmerch1');
            expect(cko.config.environmentSubdomain.getOAuthAuthorizationApi()).to.equal('https://prodmerch1.access.checkout.com/connect/token');
        });

        it('should fail when the subdomain is invalid', () => {
            expect(
                () =>
                    new Checkout(SECRET_KEY, {
                        client: CLIENT_ID,
                        scope: ['gateway'],
                        environment: 'sandbox',
                        subdomain: 'INVALID' // uppercase, rejected
                    })
            ).to.throw('invalid environment subdomain');
        });

        it('should initialize with short subdomain', () => {
            const cko = new Checkout(SECRET_KEY, {
                client: CLIENT_ID,
                scope: ['gateway'],
                environment: 'sandbox',
                subdomain: 'ab'  // short subdomain, should now work
            });

            expect(cko.config.host).to.equal('https://ab.api.sandbox.checkout.com');
            expect(cko.config.environmentSubdomain.subdomain).to.equal('ab');
        });

        it('should fail when the subdomain is empty and the legacy domain is not requested', () => {
            expect(
                () =>
                    new Checkout(SECRET_KEY, {
                        client: CLIENT_ID,
                        scope: ['gateway'],
                        environment: 'sandbox',
                        subdomain: ''
                    })
            ).to.throw('subdomain is required');
        });

        it('should use the shared hosts with the legacy domain opt-out', () => {
            const cko = new Checkout(SECRET_KEY, {
                client: CLIENT_ID,
                scope: ['gateway'],
                environment: 'sandbox',
                useLegacyDomain: true
            });

            expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');
            expect(cko.config.environment).to.be.instanceOf(Environment);
            expect(cko.config.environmentSubdomain).to.be.null;
        });

        it('should fail when both the subdomain and the legacy domain are set', () => {
            expect(
                () =>
                    new Checkout(SECRET_KEY, {
                        client: CLIENT_ID,
                        scope: ['gateway'],
                        environment: 'sandbox',
                        subdomain: 'configtest',
                        useLegacyDomain: true
                    })
            ).to.throw('cannot both be set');
        });
    });

    describe('Environment variables with subdomains', () => {
        beforeEach(() => {
            // Clean up any existing environment variables
            delete process.env.CKO_SECRET;
            delete process.env.CKO_CLIENT;
            delete process.env.CKO_ENVIRONMENT;
        });

        afterEach(() => {
            // Clean up environment variables after each test
            delete process.env.CKO_SECRET;
            delete process.env.CKO_CLIENT;
            delete process.env.CKO_ENVIRONMENT;
        });

        it('should initialize with environment variables and subdomain for sandbox', () => {
            process.env.CKO_SECRET = SECRET_KEY;
            process.env.CKO_CLIENT = CLIENT_ID;
            process.env.CKO_ENVIRONMENT = 'sandbox';

            const cko = new Checkout(null, {
                subdomain: 'envtest123'
            });

            expect(cko.config.host).to.equal('https://envtest123.api.sandbox.checkout.com');
            expect(cko.config.secret).to.equal(SECRET_KEY);
            expect(cko.config.client).to.equal(CLIENT_ID);
            expect(cko.config.environmentSubdomain.subdomain).to.equal('envtest123');
        });

        it('should initialize with environment variables and subdomain for live', () => {
            process.env.CKO_SECRET = SECRET_KEY;
            process.env.CKO_CLIENT = CLIENT_ID;
            process.env.CKO_ENVIRONMENT = 'live';

            const cko = new Checkout(null, {
                subdomain: 'livetest99'
            });

            expect(cko.config.host).to.equal('https://livetest99.api.checkout.com');
            expect(cko.config.environment.environment).to.equal('LIVE');
            expect(cko.config.environmentSubdomain.subdomain).to.equal('livetest99');
        });
    });

    describe('Static key initialization with subdomains', () => {
        const SANDBOX_SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';
        const LIVE_SK = 'sk_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

        it('should initialize with sandbox static key and subdomain', () => {
            const cko = new Checkout(SANDBOX_SK, {
                subdomain: 'statictest'
            });

            expect(cko.config.host).to.equal('https://statictest.api.sandbox.checkout.com');
            expect(cko.config.sk).to.equal(SANDBOX_SK);
            expect(cko.config.environment.environment).to.equal('SANDBOX');
            expect(cko.config.environmentSubdomain.subdomain).to.equal('statictest');
        });

        it('should initialize with live static key and subdomain', () => {
            const cko = new Checkout(LIVE_SK, {
                subdomain: 'livestatic'
            });

            expect(cko.config.host).to.equal('https://livestatic.api.checkout.com');
            expect(cko.config.sk).to.equal(LIVE_SK);
            expect(cko.config.environment.environment).to.equal('LIVE');
            expect(cko.config.environmentSubdomain.subdomain).to.equal('livestatic');
        });
    });

    describe('Custom host with subdomains', () => {
        it('should use custom host but still determine environment and subdomain for sandbox-like host', () => {
            const customHost = 'https://custom-sandbox.example.com';
            const cko = new Checkout(SECRET_KEY, {
                host: customHost,
                subdomain: 'customtest'
            });

            expect(cko.config.host).to.equal(customHost);
            expect(cko.config.environment.environment).to.equal('SANDBOX'); // determined from host containing 'sandbox'
            expect(cko.config.environmentSubdomain.subdomain).to.equal('customtest');
        });

        it('should use custom host but still determine environment and subdomain for live-like host', () => {
            const customHost = 'https://custom-live.example.com';
            const cko = new Checkout(SECRET_KEY, {
                host: customHost,
                subdomain: 'customlive'
            });

            expect(cko.config.host).to.equal(customHost);
            expect(cko.config.environment.environment).to.equal('LIVE'); // determined from host NOT containing 'sandbox'
            expect(cko.config.environmentSubdomain.subdomain).to.equal('customlive');
        });

        it('should still reject a malformed subdomain with a custom host', () => {
            expect(
                () =>
                    new Checkout(SECRET_KEY, {
                        host: 'https://custom.example.com',
                        subdomain: 'INVALID!'
                    })
            ).to.throw('invalid environment subdomain');
        });

        it('should not require a subdomain with a custom host', () => {
            const customHost = 'https://custom.example.com';
            const cko = new Checkout(SECRET_KEY, {
                host: customHost
            });

            expect(cko.config.host).to.equal(customHost);
            expect(cko.config.environmentSubdomain).to.be.null;
        });
    });

    describe('Configuration object structure', () => {
        it('should have correct config structure with subdomain', () => {
            const cko = new Checkout(SECRET_KEY, {
                client: CLIENT_ID,
                environment: 'sandbox',
                subdomain: 'configtest'
            });

            // Check that config has all expected properties
            expect(cko.config).to.have.property('host');
            expect(cko.config).to.have.property('environment');
            expect(cko.config).to.have.property('environmentSubdomain');
            expect(cko.config).to.have.property('client');
            expect(cko.config).to.have.property('secret');
            expect(cko.config).to.have.property('subdomain');

            // Check types
            expect(cko.config.environment).to.be.instanceOf(Environment);
            expect(cko.config.environmentSubdomain).to.be.instanceOf(EnvironmentSubdomain);
            expect(typeof cko.config.host).to.equal('string');
            expect(typeof cko.config.subdomain).to.equal('string');
        });

        it('should have correct config structure with the legacy domain opt-out', () => {
            const cko = new Checkout(SECRET_KEY, {
                client: CLIENT_ID,
                environment: 'sandbox',
                useLegacyDomain: true
            });

            expect(cko.config).to.have.property('environment');
            expect(cko.config.environmentSubdomain).to.be.null;
            expect(cko.config.environment).to.be.instanceOf(Environment);
        });

        it('should fail without a subdomain and without the legacy domain opt-out', () => {
            expect(
                () =>
                    new Checkout(SECRET_KEY, {
                        client: CLIENT_ID,
                        environment: 'sandbox'
                    })
            ).to.throw('subdomain is required');
        });
    });

    describe('Subdomain validation edge cases', () => {
        it('should reject a whitespace-only subdomain', () => {
            expect(
                () =>
                    new Checkout(SECRET_KEY, {
                        client: CLIENT_ID,
                        environment: 'sandbox',
                        subdomain: '   '
                    })
            ).to.throw('invalid environment subdomain');
        });

        it('should handle numeric-only subdomain', () => {
            const cko = new Checkout(SECRET_KEY, {
                client: CLIENT_ID,
                environment: 'sandbox',
                subdomain: '12345678'
            });

            expect(cko.config.host).to.equal('https://12345678.api.sandbox.checkout.com');
            expect(cko.config.environmentSubdomain.subdomain).to.equal('12345678');
        });

        it('should handle letter-only subdomain', () => {
            const cko = new Checkout(SECRET_KEY, {
                client: CLIENT_ID,
                environment: 'sandbox',
                subdomain: 'abcdefgh'
            });

            expect(cko.config.host).to.equal('https://abcdefgh.api.sandbox.checkout.com');
            expect(cko.config.environmentSubdomain.subdomain).to.equal('abcdefgh');
        });
    });
});