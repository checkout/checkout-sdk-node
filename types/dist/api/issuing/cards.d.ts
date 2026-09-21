import { config } from '../../Checkout';

export default class Cards {
    constructor(config: config);

    createCard(body: object, idempotencyKey?: string): Promise<object>;
    getCardDetails(id: string): Promise<object>;
    /**
     * Update a card. Pass `headers` to request the encrypted credentials: set
     * `return-encrypted-cvv` to "true" together with an `Encryption-Key`.
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
