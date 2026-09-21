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
     * Pass `headers` to request the encrypted credentials: set `return-encrypted-cvv` to `true`
     * together with an `Encryption-Key`. The key must have its `-----BEGIN PUBLIC KEY-----` and
     * `-----END PUBLIC KEY-----` markers and every newline removed, encoded as Base64. Supplying
     * the flag without the key returns a 422 with error code `encryption_key_required`.
     */
    updateCard(id: string, body: object, headers?: object): Promise<object>;
    enrollThreeDS(id: string, body: object): Promise<object>;
    updateThreeDS(id: string, body: object): Promise<object>;
    getThreeDSDetails(id: string): Promise<object>;
    activateCard(id: string): Promise<object>;
    getCardCredentials(id: string, body: object): Promise<object>;
    renewCard(id: string, body: object): Promise<object>;
    revokeCard(id: string, body: object): Promise<object>;
    suspendCard(id: string, body: object): Promise<object>;
}
