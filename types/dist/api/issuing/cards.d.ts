import { config } from '../../Checkout';

export default class Cards {
    constructor(config: config);

    createCard(body: object, idempotencyKey?: string): Promise<object>;
    getCardDetails(id: string): Promise<object>;
    /**
     * Update a card.
     *
     * Only the fields you provide values for are updated. Passing `null` for a field removes its
     * existing value.
     *
     * The response is the update-card-response; it does not include `encrypted_cvv`.
     * For virtual cards only (`type` is `virtual`), it may also include `is_single_use`.
     */
    updateCard(id: string, body: object): Promise<object>;
    /**
     * @deprecated The API no longer documents these headers (`return-encrypted-cvv`,
     * `Encryption-Key`); use the method without headers. Will be removed in the next major
     * version. When set, the headers are still sent unchanged.
     */
    updateCard(id: string, body: object, headers?: object): Promise<object>;
    enrollThreeDS(id: string, body: object): Promise<object>;
    updateThreeDS(id: string, body: object): Promise<object>;
    getThreeDSDetails(id: string): Promise<object>;
    activateCard(id: string): Promise<object>;
    getCardCredentials(id: string, body: object): Promise<object>;
    renewCard(id: string, body: object): Promise<object>;
    revokeCard(id: string, body?: object): Promise<object>;
    suspendCard(id: string, body?: object): Promise<object>;
}
