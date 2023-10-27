import { Checkout } from '../../src/index';
import { expect } from 'chai';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('MBC', () => {
    it('should initialize with key and default config', () => {
        const cko = new Checkout(SK);
        expect(cko).to.be.instanceOf(Checkout);
        expect(cko.config.sk).to.equal(SK);
        expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');
        expect(cko.config.timeout).to.equal(15000);
        expect(cko.config.agent).to.be.undefined;
    });

    it('should initialize with key and custom config', () => {
        const fakeAgent = {};
        const cko = new Checkout(SK, {
            host: 'https:/test.com',
            timeout: 9000,
            agent: fakeAgent,
        });
        expect(cko.config.sk).to.equal(SK);
        expect(cko.config.host).to.equal('https:/test.com');
        expect(cko.config.timeout).to.equal(9000);
        expect(cko.config.agent).to.equal(fakeAgent);
    });

    it('should initialize with key and custom httpClient', () => {
        const cko = new Checkout(SK, {
            timeout: 9000,
            httpClient: 'axios',
        });
        expect(cko.config.sk).to.equal(SK);
        expect(cko.config.timeout).to.equal(9000);
        expect(cko.config.httpClient).to.equal('axios');
    });

    it('should set the public key', () => {
        const cko = new Checkout(SK);
        const pk = 'pk_123';
        cko.config.pk = pk;
        expect(cko.config.pk).to.equal(pk);
    });

    it('should set the public key in constructor', () => {
        const cko = new Checkout(SK, { pk: 'pk_123' });
        expect(cko.config.pk).to.equal('pk_123');
    });

    it('should read env variables', () => {
        process.env.CKO_SECRET_KEY = SK;
        process.env.CKO_PUBLIC_KEY = 'pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73';

        const cko = new Checkout();
        expect(cko.config.sk).to.equal(SK);
        expect(cko.config.pk).to.equal('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73');
        delete process.env.CKO_SECRET_KEY;
        delete process.env.CKO_PUBLIC_KEY;
    });

    it('should set the live environment based on env key', () => {
        process.env.CKO_SECRET_KEY = 'sk_fghjovernsi764jybiuogokg7xz';
        const cko = new Checkout();
        expect(cko.config.host).to.equal('https://api.checkout.com');
        delete process.env.CKO_SECRET_KEY;
    });

    it('should set the sandbox environment based on env key', () => {
        process.env.CKO_SECRET_KEY = SK;
        const cko = new Checkout();
        expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');
        delete process.env.CKO_SECRET_KEY;
    });

    it('should determine sandbox environemnt based on key', () => {
        const cko = new Checkout(SK);
        expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');
    });

    it('should determine live environemnt based on key', () => {
        const cko = new Checkout('sk_43ed9a7f-4799-461d-b201-a70507878b51');
        expect(cko.config.host).to.equal('https://api.checkout.com');
    });
});

describe('NAS static keys', () => {
    it('should should append the Bearer prefix for sandbox NAS secret keys', () => {
        const cko = new Checkout('sk_sbox_fghjovernsi764jybiuogokg7xz');
        expect(cko).to.be.instanceOf(Checkout);
        expect(cko.config.sk).to.equal('Bearer sk_sbox_fghjovernsi764jybiuogokg7xz');
        expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');
        expect(cko.config.agent).to.be.undefined;
    });

    it('should cater for the checksum character', () => {
        const cko = new Checkout('sk_fghjovernsi764jybiuogokg7x*');
        expect(cko.config.host).to.equal('https://api.checkout.com');
    });

    it('should should append the Bearer prefix for live NAS secret keys', () => {
        const cko = new Checkout('sk_fghjovernsi764jybiuogokg7xz');
        expect(cko).to.be.instanceOf(Checkout);
        expect(cko.config.sk).to.equal('Bearer sk_fghjovernsi764jybiuogokg7xz');
        expect(cko.config.host).to.equal('https://api.checkout.com');
        expect(cko.config.agent).to.be.undefined;
    });

    it('it accepts NAS live sk and it sets the environment accordingly', () => {
        const cko = new Checkout('sk_fghjovernsi764jybiuogokg7xz');
        expect(cko.config.host).to.equal('https://api.checkout.com');
    });

    it('it accepts NAS sandbox sk and it sets the environment accordingly', () => {
        const cko = new Checkout('sk_sbox_fghjovernsi764jybiuogokg7xz');
        expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');
    });

    it('it accepts NAS sandbox pk and appends keeps the Bearer prefix', async () => {
        const cko = new Checkout('sk_sbox_fghjovernsi764jybiuogokg7xz', {
            pk: 'Bearer pk_sbox_xg66bnn6tpspd6pt3psc7otrqa=',
        });
        expect(cko.config.pk).to.equal('Bearer pk_sbox_xg66bnn6tpspd6pt3psc7otrqa=');
    });
});

describe('NAS oAuth', () => {
    it('should initialize with oAuth credentials', () => {
        const cko = new Checkout('2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-', {
            client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
            scope: ['gateway'],
            environment: 'sandbox',
        });
        expect(cko).to.be.instanceOf(Checkout);
        expect(cko.config.client).to.equal('ack_vvzhoai466su3j3vbxb47ts5oe');
        expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');
        expect(cko.config.scope[0]).to.equal('gateway');
        expect(cko.config.secret).to.equal('2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-');
        expect(cko.config.agent).to.be.undefined;
    });

    it('should default to sandbox  and gateway scope with oAuth credentials', () => {
        const cko = new Checkout('2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-', {
            client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
        });

        expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');
        expect(cko.config.scope).to.equal('gateway');
    });

    it('should default to sandbox  and gateway scope with oAuth credentials from env vars', () => {
        process.env.CKO_SECRET = '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-';
        process.env.CKO_CLIENT = 'ack_vvzhoai466su3j3vbxb47ts5oe';

        const cko = new Checkout();

        expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');
        expect(cko.config.scope).to.equal('gateway');

        delete process.env.CKO_SECRET;
        delete process.env.CKO_CLIENT;
    });

    it('should set live environment', () => {
        const cko = new Checkout('2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-', {
            client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
            scope: ['gateway'],
            environment: 'prod',
        });
        expect(cko.config.host).to.equal('https://api.checkout.com');
    });

    it('should set live environment from env variable', () => {
        process.env.CKO_SECRET = '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-';
        process.env.CKO_CLIENT = 'ack_vvzhoai466su3j3vbxb47ts5oe';
        process.env.CKO_SCOPE = 'gateway';
        process.env.CKO_ENVIRONMENT = 'prod';

        const cko = new Checkout();

        expect(cko.config.host).to.equal('https://api.checkout.com');

        delete process.env.CKO_SECRET;
        delete process.env.CKO_CLIENT;
        delete process.env.SCOPE;
        delete process.env.ENVIRONMENT;
    });

    it('should set sandbox environment from env variable', () => {
        process.env.CKO_SECRET = '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-';
        process.env.CKO_CLIENT = 'ack_vvzhoai466su3j3vbxb47ts5oe';
        process.env.CKO_SCOPE = 'gateway';
        process.env.CKO_ENVIRONMENT = 'sandbox';

        const cko = new Checkout();

        expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');

        delete process.env.CKO_SECRET;
        delete process.env.CKO_CLIENT;
        delete process.env.SCOPE;
        delete process.env.ENVIRONMENT;
    });

    it('should cater for the checksum character', () => {
        const cko = new Checkout('sk_fghjovernsi764jybiuogokg7x*');
        expect(cko.config.host).to.equal('https://api.checkout.com');
    });

    it('should should append the Bearer prefix for live NAS secret keys', () => {
        const cko = new Checkout('sk_fghjovernsi764jybiuogokg7xz');
        expect(cko).to.be.instanceOf(Checkout);
        expect(cko.config.sk).to.equal('Bearer sk_fghjovernsi764jybiuogokg7xz');
        expect(cko.config.host).to.equal('https://api.checkout.com');
        expect(cko.config.agent).to.be.undefined;
    });

    it('should accept sandbox NAS secret keys with the Bearer prefix', () => {
        const cko = new Checkout('Bearer sk_sbox_n2dvcqjweokrqm4q7hlfcfqtn4m');
        expect(cko).to.be.instanceOf(Checkout);
        expect(cko.config.sk).to.equal('Bearer sk_sbox_n2dvcqjweokrqm4q7hlfcfqtn4m');
        expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');
        expect(cko.config.agent).to.be.undefined;
    });

    it('it accepts NAS live sk and it sets the environment accordingly', () => {
        const cko = new Checkout('sk_fghjovernsi764jybiuogokg7xz');
        expect(cko.config.host).to.equal('https://api.checkout.com');
    });

    it('it accepts NAS sandbox sk and it sets the environment accordingly', () => {
        const cko = new Checkout('sk_sbox_fghjovernsi764jybiuogokg7xz');
        expect(cko.config.host).to.equal('https://api.sandbox.checkout.com');
    });
});
