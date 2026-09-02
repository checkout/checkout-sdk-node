import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';

/**
 * Class dealing with the /apms/bacs endpoints
 *
 * @export
 * @class Bacs
 */
export default class Bacs {
    constructor(config) {
        this.config = config;
    }

    /**
     * Sends a Bacs Direct Debit pre-notification (advance notice) to a payer ahead of
     * collecting funds from their account.
     *
     * Request fields (swagger BacsNotificationRequest, 2026-07-30):
     *  - body.source_id — **required.** The ID of the Bacs Direct Debit instrument to
     *    notify against. Pattern `^(src)_(\w{26})$`.
     *  - body.notification_type — **required.** The type of pre-notification being sent
     *    to the payer. One value only: `advance_notice`.
     *  - body.collection_date — **required.** The date the funds will be collected from
     *    the payer's account, in the format `yyyy-MM-dd`.
     *  - body.amount — **required.** The amount to be collected, in the currency's minor
     *    unit. Minimum `1`.
     *  - body.currency — **required.** The three-letter ISO 4217 currency code of the
     *    collection. Exactly 3 characters.
     *  - body.billing_descriptor — **required.** The billing descriptor that appears on
     *    the payer's bank statement. Max 25 characters.
     *  - body.customer_email — **required.** The email address of the payer that the
     *    pre-notification is sent to. Format `email`.
     *  - body.support_email — **required.** The support email address included in the
     *    pre-notification. Format `email`.
     *  - body.reference — optional. A reference you can use to identify the collection.
     *    Max 50 characters.
     *  - body.support_phone — optional. The support phone number included in the
     *    pre-notification, in E.164 format.
     *
     * Response fields (swagger BacsNotificationResponse):
     *  - event_id — the unique identifier of the notification event.
     *
     * @memberof Bacs
     * @param {Object} body Bacs Direct Debit notification request body.
     * @return {Promise<Object>} A promise to the Bacs pre-notification response.
     */
    async sendNotification(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/apms/bacs/notifications`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
