import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Reverse a payment', () => {
  it('should reverse payment with a body', async () => {
    nock('https://api.sandbox.checkout.com')
      .post('/payments')
      .reply(
        201,
        {
          id: 'pay_6ndp5facelxurne7gloxkxm57u',
          action_id: 'act_6ndp5facelxurne7gloxkxm57u',
          amount: 100,
          currency: 'USD',
          approved: true,
          status: 'Authorized',
          auth_code: '277368',
          response_code: '10000',
          response_summary: 'Approved',
          '3ds': undefined,
          risk: { flagged: false },
          source: {
            id: 'src_mtagg5kktcoerkwloibzfuilpy',
            type: 'card',
            expiry_month: 6,
            expiry_year: 2029,
            scheme: 'Visa',
            last4: '4242',
            fingerprint:
              '107A352DFAE35E3EEBA5D0856FCDFB88ECF91E8CFDE4275ABBC791FD9579AB2C',
            bin: '424242',
            card_type: 'Credit',
            card_category: 'Consumer',
            issuer: 'JPMORGAN CHASE BANK NA',
            issuer_country: 'US',
            product_id: 'A',
            product_type: 'Visa Traditional',
            avs_check: 'S',
            cvv_check: 'Y',
          },
          customer: { id: 'cus_leu5pp2zshpuvbt6yjxl5xcrdi' },
          processed_on: '2019-06-09T22:43:54Z',
          reference: undefined,
          eci: '05',
          scheme_id: '638284745624527',
          _links: {
            self: {
              href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u',
            },
            actions: {
              href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/actions',
            },
            capture: {
              href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/captures',
            },
            void: {
              href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/voids',
            },
          },
        },
        {
          'cko-request-id': ['1695a930-09cf-4db0-a91e-a772e6ee076g'],
          'cko-version': ['3.31.4'],
        }
      );

    nock('https://api.sandbox.checkout.com')
      .post(/reversals$/)
      .reply(202, {
        action_id: 'act_y3oqhf46pyzuxjbcn2giaqnb44',
        reference: 'ORD-5023-4E89',
        _links: {
          payment: {
            href: 'https://api.checkout.com/payments/pay_y3oqhf46pyzuxjbcn2giaqnb44',
          },
        },
      });

    const cko = new Checkout(SK);

    const transaction = await cko.payments.request({
      source: {
        number: '4242424242424242',
        expiry_month: 6,
        expiry_year: 2029,
        cvv: '100',
      },
      currency: 'USD',
      capture: false,
      reference: 'ORD-5023-4E89',
      amount: 100,
    });
    const paymentId = transaction.id;
    const reverse = await cko.payments.reverse(paymentId, {
      reference: 'ORD-5023-4E89',
      metadata: {
        coupon_code: 'NY2018',
        partner_id: 123989
      }
    });

    expect(reverse.reference).to.equal('ORD-5023-4E89');
  });

  it('should return void when payment already reversed', async () => {
    nock('https://api.sandbox.checkout.com')
      .post('/payments/pay_7enxra4adw6evgalvfabl6nbaa/reversals')
      .reply(204);

    const cko = new Checkout(SK);
    const reverse = await cko.payments.reverse('pay_7enxra4adw6evgalvfabl6nbaa', {
      reference: 'ORD-5023-4E89',
      metadata: {
        coupon_code: 'NY2018',
        partner_id: 123989
      }
    });

    expect(reverse).to.be.undefined;
  });

  it('should throw AuthenticationError', async () => {
    nock('https://api.sandbox.checkout.com')
      .post('/payments/pay_7enxra4adw6evgalvfabl6nbqy/reversals')
      .reply(401);

    try {
      const cko = new Checkout('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f809');
      await cko.payments.reverse('pay_7enxra4adw6evgalvfabl6nbqy', {
        reference: 'ORD-5023-4E89',
        metadata: {
          coupon_code: 'NY2018',
          partner_id: 123989
        }
      });
    } catch (err) {
      expect(err.name).to.equal('AuthenticationError');
    }
  });

  it('should throw action not allowed error', async () => {
    nock('https://api.sandbox.checkout.com')
      .post('/payments/pay_7enxra4adw6evgalvfabl6nbaa/reversals')
      .reply(403);

    try {
      const cko = new Checkout(SK);
      await cko.payments.reverse('pay_7enxra4adw6evgalvfabl6nbaa', {
        reference: 'ORD-5023-4E89',
        metadata: {
          coupon_code: 'NY2018',
          partner_id: 123989
        }
      });
    } catch (err) {
      expect(err.name).to.equal('ActionNotAllowed');
    }
  });

  it('should throw payment not found error', async () => {
    nock('https://api.sandbox.checkout.com')
      .post('/payments/pay_7enxra4adw6evgalvfabl6nbaa/reversals')
      .reply(404);

    try {
      const cko = new Checkout(SK);
      await cko.payments.reverse('pay_7enxra4adw6evgalvfabl6nbaa', {
        reference: 'ORD-5023-4E89',
        metadata: {
          coupon_code: 'NY2018',
          partner_id: 123989
        }
      });
    } catch (err) {
      expect(err.name).to.equal('NotFoundError');
    }
  });
}); 