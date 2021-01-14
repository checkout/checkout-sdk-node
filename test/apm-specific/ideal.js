import { AuthenticationError } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('iDEal', () => {
    it('should get iDeal details', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/ideal-external')
            .reply(200, {
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/ideal-external/',
                    },
                    curies: [
                        {
                            name: 'ideal',
                            href:
                                'https://api.sandbox.checkout.com/ideal-external/relations/ideal/{rel}',
                            templated: true,
                        },
                    ],
                    'ideal:issuers': {
                        href: 'https://api.sandbox.checkout.com/ideal-external/issuers',
                    },
                },
            });

        const cko = new Checkout(SK);

        const ideal = await cko.ideal.get();
        expect(ideal._links.curies[0].name).to.equal('ideal');
    });

    it('should throw Authentication error trying to get iDeal details', async () => {
        nock('https://api.sandbox.checkout.com').get('/ideal-external').reply(401);

        const cko = new Checkout(SK);

        try {
            const ideal = await cko.ideal.get();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get iDeal issuers', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/ideal-external/issuers')
            .reply(200, {
                countries: [
                    {
                        name: 'Nederland',
                        issuers: [
                            {
                                bic: 'INGBNL2A',
                                name: 'Issuer Simulation V3 - ING',
                            },
                            {
                                bic: 'RABONL2U',
                                name: 'Issuer Simulation V3 - RABO',
                            },
                        ],
                    },
                ],
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/ideal-external/issuers',
                    },
                },
            });

        const cko = new Checkout(SK);

        const issuers = await cko.ideal.getIssuers();
        expect(issuers.countries[0].name).to.equal('Nederland');
    });

    it('should throw Authentication error trying to get iDeal issuers', async () => {
        nock('https://api.sandbox.checkout.com').get('/ideal-external/issuers').reply(401);

        const cko = new Checkout(SK);

        try {
            const issuers = await cko.ideal.getIssuers();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
