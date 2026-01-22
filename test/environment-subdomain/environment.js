import Environment from '../../src/Environment.js';
import { expect } from 'chai';

describe('Environment', () => {
    describe('sandbox environment', () => {
        it('should create sandbox environment with correct URLs', () => {
            const environment = Environment.sandbox();
            
            expect(environment).to.be.instanceOf(Environment);
            expect(environment.environment).to.equal('SANDBOX');
            expect(environment.getCheckoutApi()).to.equal('https://api.sandbox.checkout.com');
            expect(environment.getOAuthAuthorizationApi()).to.equal('https://access.sandbox.checkout.com/connect/token');
        });
        
        it('should return same instance for multiple sandbox calls', () => {
            const env1 = Environment.sandbox();
            const env2 = Environment.sandbox();
            
            expect(env1.environment).to.equal(env2.environment);
            expect(env1.getCheckoutApi()).to.equal(env2.getCheckoutApi());
            expect(env1.getOAuthAuthorizationApi()).to.equal(env2.getOAuthAuthorizationApi());
        });
    });

    describe('live environment', () => {
        it('should create live environment with correct URLs', () => {
            const environment = Environment.live();
            
            expect(environment).to.be.instanceOf(Environment);
            expect(environment.environment).to.equal('LIVE');
            expect(environment.getCheckoutApi()).to.equal('https://api.checkout.com');
            expect(environment.getOAuthAuthorizationApi()).to.equal('https://access.checkout.com/connect/token');
        });
        
        it('should return same instance for multiple live calls', () => {
            const env1 = Environment.live();
            const env2 = Environment.live();
            
            expect(env1.environment).to.equal(env2.environment);
            expect(env1.getCheckoutApi()).to.equal(env2.getCheckoutApi());
            expect(env1.getOAuthAuthorizationApi()).to.equal(env2.getOAuthAuthorizationApi());
        });
    });

    describe('constructor', () => {
        it('should create environment with SANDBOX', () => {
            const environment = new Environment('SANDBOX');
            
            expect(environment.environment).to.equal('SANDBOX');
            expect(environment.checkoutApi).to.equal('https://api.sandbox.checkout.com');
            expect(environment.oAuthAuthorizationApi).to.equal('https://access.sandbox.checkout.com/connect/token');
        });
        
        it('should create environment with LIVE', () => {
            const environment = new Environment('LIVE');
            
            expect(environment.environment).to.equal('LIVE');
            expect(environment.checkoutApi).to.equal('https://api.checkout.com');
            expect(environment.oAuthAuthorizationApi).to.equal('https://access.checkout.com/connect/token');
        });
    });
});