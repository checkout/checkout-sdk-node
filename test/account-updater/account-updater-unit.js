import nock from "nock";
import { expect } from "chai";
import Checkout from "../../src/Checkout.js";
import { AuthenticationError, NotFoundError } from "../../src/services/errors.js";

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Unit::AccountUpdater', () => {
    it('should retrieve updated card details', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/account-updater/cards')
            .reply(200, {
                card: {
                    expiry_month: 12,
                    expiry_year: 2025,
                    last4: "4242"
                },
                update_status: "updated"
            });

        const cko = new Checkout(SK);

        const response = await cko.accountUpdater.retrieveUpdatedCardDetails({
            card_token: "tok_ubfj2q76miwundwlk72vxt2i7q"
        });

        expect(response).to.not.be.null;
        expect(response.update_status).to.equal("updated");
        expect(response.card.last4).to.equal("4242");
    });

    it('should throw when retrieving updated card details with invalid token', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/account-updater/cards')
            .reply(404);

        const cko = new Checkout('sk_123');

        try {
            await cko.accountUpdater.retrieveUpdatedCardDetails({
                card_token: "invalid_token"
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
