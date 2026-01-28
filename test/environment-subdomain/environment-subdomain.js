import Environment from '../../src/Environment.js';
import EnvironmentSubdomain from '../../src/EnvironmentSubdomain.js';
import { expect } from 'chai';

describe('EnvironmentSubdomain', () => {
    let sandboxEnvironment;
    let liveEnvironment;

    beforeEach(() => {
        sandboxEnvironment = Environment.sandbox();
        liveEnvironment = Environment.live();
    });

    describe('constructor', () => {
        it('should create environment subdomain with valid subdomain for sandbox', () => {
            const envSubdomain = new EnvironmentSubdomain(sandboxEnvironment, 'testmerchant');
            
            expect(envSubdomain).to.be.instanceOf(EnvironmentSubdomain);
            expect(envSubdomain.environment).to.equal(sandboxEnvironment);
            expect(envSubdomain.subdomain).to.equal('testmerchant');
            expect(envSubdomain.getCheckoutApi()).to.equal('https://testmerchant.api.sandbox.checkout.com');
            expect(envSubdomain.getOAuthAuthorizationApi()).to.equal('https://testmerchant.access.sandbox.checkout.com/connect/token');
        });

        it('should create environment subdomain with valid subdomain for live', () => {
            const envSubdomain = new EnvironmentSubdomain(liveEnvironment, 'merchant123');
            
            expect(envSubdomain.environment).to.equal(liveEnvironment);
            expect(envSubdomain.subdomain).to.equal('merchant123');
            expect(envSubdomain.getCheckoutApi()).to.equal('https://merchant123.api.checkout.com');
            expect(envSubdomain.getOAuthAuthorizationApi()).to.equal('https://merchant123.access.checkout.com/connect/token');
            expect(envSubdomain.getOAuthAuthorizationApi()).to.equal('https://merchant123.access.checkout.com/connect/token');
        });
    });

    describe('factory methods', () => {
        describe('sandbox method', () => {
            it('should create sandbox environment subdomain', () => {
                const envSubdomain = EnvironmentSubdomain.sandbox('test123');
                
                expect(envSubdomain).to.be.instanceOf(EnvironmentSubdomain);
                expect(envSubdomain.environment.environment).to.equal('SANDBOX');
                expect(envSubdomain.subdomain).to.equal('test123');
                expect(envSubdomain.getCheckoutApi()).to.equal('https://test123.api.sandbox.checkout.com');
                expect(envSubdomain.getOAuthAuthorizationApi()).to.equal('https://test123.access.sandbox.checkout.com/connect/token');
            });
        });

        describe('live method', () => {
            it('should create live environment subdomain', () => {
                const envSubdomain = EnvironmentSubdomain.live('prod456');
                
                expect(envSubdomain.environment.environment).to.equal('LIVE');
                expect(envSubdomain.subdomain).to.equal('prod456');
                expect(envSubdomain.getCheckoutApi()).to.equal('https://prod456.api.checkout.com');
                expect(envSubdomain.getOAuthAuthorizationApi()).to.equal('https://prod456.access.checkout.com/connect/token');
            });
        });
    });

    describe('createUrlWithSubdomain static method', () => {
        describe('valid subdomains', () => {
            it('should create URL with alphanumeric subdomain', () => {
                const originalUrl = 'https://api.sandbox.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, 'abc12345');
                
                expect(result).to.equal('https://abc12345.api.sandbox.checkout.com');
            });

            it('should create URL with all lowercase letters', () => {
                const originalUrl = 'https://access.checkout.com/connect/token';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, 'abcdefghijk');
                
                expect(result).to.equal('https://abcdefghijk.access.checkout.com/connect/token');
            });

            it('should create URL with all numbers', () => {
                const originalUrl = 'https://api.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, '123456789');
                
                expect(result).to.equal('https://123456789.api.checkout.com');
            });

            it('should create URL with 8-character subdomain', () => {
                const originalUrl = 'https://api.sandbox.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, '12345678');
                
                expect(result).to.equal('https://12345678.api.sandbox.checkout.com');
            });

            it('should create URL with 11-character subdomain', () => {
                const originalUrl = 'https://api.sandbox.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, '12345678901');
                
                expect(result).to.equal('https://12345678901.api.sandbox.checkout.com');
            });
        });

        describe('invalid subdomains', () => {
            it('should return original URL for null subdomain', () => {
                const originalUrl = 'https://api.sandbox.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, null);
                
                expect(result).to.equal(originalUrl);
            });

            it('should return original URL for undefined subdomain', () => {
                const originalUrl = 'https://api.sandbox.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, undefined);
                
                expect(result).to.equal(originalUrl);
            });

            it('should return original URL for empty subdomain', () => {
                const originalUrl = 'https://api.sandbox.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, '');
                
                expect(result).to.equal(originalUrl);
            });

            it('should return original URL for subdomain with uppercase letters', () => {
                const originalUrl = 'https://api.sandbox.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, 'ABC123');
                
                expect(result).to.equal(originalUrl);
            });

            it('should return original URL for subdomain with special characters', () => {
                const originalUrl = 'https://api.sandbox.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, 'test-123');
                
                expect(result).to.equal(originalUrl);
            });

            it('should return original URL for subdomain with spaces', () => {
                const originalUrl = 'https://api.sandbox.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, 'test 123');
                
                expect(result).to.equal(originalUrl);
            });

            it('should create URL with short subdomain (2 chars)', () => {
                const originalUrl = 'https://api.sandbox.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, 'ab');
                
                expect(result).to.equal('https://ab.api.sandbox.checkout.com');
            });

            it('should create URL with long subdomain (12+ chars)', () => {
                const originalUrl = 'https://api.sandbox.checkout.com';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, 'verylongsubdomain123');
                
                expect(result).to.equal('https://verylongsubdomain123.api.sandbox.checkout.com');
            });
        });

        describe('error handling', () => {
            it('should return original URL for malformed URLs', () => {
                const originalUrl = 'not-a-valid-url';
                const result = EnvironmentSubdomain.createUrlWithSubdomain(originalUrl, 'test1234');
                
                expect(result).to.equal(originalUrl);
            });
        });
    });

    describe('isValidSubdomain static method', () => {
        describe('valid subdomains', () => {
            it('should validate alphanumeric subdomain', () => {
                expect(EnvironmentSubdomain.isValidSubdomain('abc12345')).to.be.true;
            });

            it('should validate all lowercase letters', () => {
                expect(EnvironmentSubdomain.isValidSubdomain('abcdefghijk')).to.be.true;
            });

            it('should validate all numbers', () => {
                expect(EnvironmentSubdomain.isValidSubdomain('123456789')).to.be.true;
            });

            it('should validate 8-character subdomain', () => {
                expect(EnvironmentSubdomain.isValidSubdomain('12345678')).to.be.true;
            });

            it('should validate 11-character subdomain', () => {
                expect(EnvironmentSubdomain.isValidSubdomain('12345678901')).to.be.true;
            });
        });

        describe('invalid subdomains', () => {
            it('should reject null subdomain', () => {
                expect(EnvironmentSubdomain.isValidSubdomain(null)).to.be.false;
            });

            it('should reject undefined subdomain', () => {
                expect(EnvironmentSubdomain.isValidSubdomain(undefined)).to.be.false;
            });

            it('should reject empty subdomain', () => {
                expect(EnvironmentSubdomain.isValidSubdomain('')).to.be.false;
            });

            it('should reject subdomain with uppercase letters', () => {
                expect(EnvironmentSubdomain.isValidSubdomain('ABC12345')).to.be.false;
            });

            it('should reject subdomain with special characters', () => {
                expect(EnvironmentSubdomain.isValidSubdomain('test-123')).to.be.false;
                expect(EnvironmentSubdomain.isValidSubdomain('test_123')).to.be.false;
                expect(EnvironmentSubdomain.isValidSubdomain('test@123')).to.be.false;
                expect(EnvironmentSubdomain.isValidSubdomain('test.123')).to.be.false;
            });

            it('should reject subdomain with spaces', () => {
                expect(EnvironmentSubdomain.isValidSubdomain('test 123')).to.be.false;
                expect(EnvironmentSubdomain.isValidSubdomain('  test123')).to.be.false;
                expect(EnvironmentSubdomain.isValidSubdomain('test123  ')).to.be.false;
            });

            it('should validate short subdomain (2 chars)', () => {
                expect(EnvironmentSubdomain.isValidSubdomain('ab')).to.be.true;
            });

            it('should validate long subdomain (12+ chars)', () => {
                expect(EnvironmentSubdomain.isValidSubdomain('123456789012')).to.be.true;
            });

            it('should reject non-string types', () => {
                expect(EnvironmentSubdomain.isValidSubdomain(123456789)).to.be.false;
                expect(EnvironmentSubdomain.isValidSubdomain({})).to.be.false;
                expect(EnvironmentSubdomain.isValidSubdomain([])).to.be.false;
                expect(EnvironmentSubdomain.isValidSubdomain(true)).to.be.false;
            });
        });
    });

    describe('URL transformation consistency', () => {
        it('should maintain consistency between API and OAuth URLs for sandbox', () => {
            const envSubdomain = EnvironmentSubdomain.sandbox('consistent');
            
            expect(envSubdomain.getCheckoutApi()).to.include('consistent.api.sandbox.checkout.com');
            expect(envSubdomain.getOAuthAuthorizationApi()).to.include('consistent.access.sandbox.checkout.com');
        });

        it('should maintain consistency between API and OAuth URLs for live', () => {
            const envSubdomain = EnvironmentSubdomain.live('merchant99');
            
            expect(envSubdomain.getCheckoutApi()).to.include('merchant99.api.checkout.com');
            expect(envSubdomain.getOAuthAuthorizationApi()).to.include('merchant99.access.checkout.com');
        });

        it('should ensure no trailing slash in URLs', () => {
            const envSubdomain = EnvironmentSubdomain.sandbox('notrailing');
            
            expect(envSubdomain.getCheckoutApi()).not.to.match(/\/$/);
            expect(envSubdomain.getOAuthAuthorizationApi()).to.match(/\/connect\/token$/);
        });
    });

    describe('integration with Environment class', () => {
        it('should properly compose with sandbox environment', () => {
            const environment = Environment.sandbox();
            const envSubdomain = new EnvironmentSubdomain(environment, 'integration');
            
            expect(envSubdomain.environment).to.equal(environment);
            expect(envSubdomain.getCheckoutApi()).to.equal('https://integration.api.sandbox.checkout.com');
            expect(envSubdomain.getOAuthAuthorizationApi()).to.equal('https://integration.access.sandbox.checkout.com/connect/token');
        });

        it('should properly compose with live environment', () => {
            const environment = Environment.live();
            const envSubdomain = new EnvironmentSubdomain(environment, 'integration');
            
            expect(envSubdomain.environment).to.equal(environment);
            expect(envSubdomain.getCheckoutApi()).to.equal('https://integration.api.checkout.com');
            expect(envSubdomain.getOAuthAuthorizationApi()).to.equal('https://integration.access.checkout.com/connect/token');
        });
    });
});