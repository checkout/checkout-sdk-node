import { expect } from "chai";
import { createEntity, generateFutureDate } from '../utils.js';
import Checkout from '../../src/Checkout.js';
import nock from "nock";

describe('Integration::Platforms::Reserve Rules', () => {
    const cko_platforms = new Checkout(process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_SECRET, {
        client: process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_ID,
        scope: ['accounts'],
        environment: 'sandbox',
    });

    let entityId;
    let reserveRuleId;

    before(async () => {
        entityId = await createEntity();
    });

    it('should add a reserve rule', async () => {
        const response = await cko_platforms.platforms.addReserveRule(entityId, {
            type: 'rolling',
            valid_from: generateFutureDate(),
            rolling: {
                percentage: 10,
                holding_duration: {
                    weeks: 2
                }
            }
        });

        expect(response).to.not.be.null;
        expect(response.id).to.not.be.null;
        reserveRuleId = response.id;
    });

    it('should query reserve rules', async () => {
        const response = await cko_platforms.platforms.queryReserveRules(entityId);

        expect(response).to.not.be.null;
        expect(response.data).to.be.an('array');
        expect(response.data[0].id).to.equal(reserveRuleId);
    });

    it('should get reserve rule details', async () => {
        const response = await cko_platforms.platforms.getReserveRuleDetails(entityId, reserveRuleId);

        expect(response).to.not.be.null;
        expect(response.id).to.equal(reserveRuleId);
        expect(response.rolling.percentage).to.equal(10);
    });

    it('should fail to update a reserve rule due to invalid If-Match header', async () => {
      nock(cko_platforms.config.host)
        .put(`/accounts/entities/${entityId}/reserve-rules/${reserveRuleId}`)
        .reply(412, {
            error: 'Precondition Failed',
        }, {
            'If-Match': 'invalid-header-value',
        });
        
      try {
          await cko_platforms.platforms.updateReserveRule(
              entityId,
              reserveRuleId,
              {
                  type: 'rolling',
                  valid_from: generateFutureDate(),
                  rolling: {
                      percentage: 15,
                      holding_duration: {
                          weeks: 4,
                      },
                  },
              },
              'invalid-header-value'
          );
      } catch (err) {
          expect(err.http_code).to.equal(412);
          expect(err.body.error).to.equal('Precondition Failed');
      }
      expect(nock.isDone()).to.be.true;
  });
});
