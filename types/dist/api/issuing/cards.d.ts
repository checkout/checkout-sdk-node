import { config } from '../../Checkout';

export default class Cards {
    constructor(config: config);

    createCard(body: object, idempotencyKey?: string): Promise<object>;
    getCardDetails(id: string): Promise<object>;
    updateCard(id: string, body: object): Promise<object>;
    enrollThreeDS(id: string, body: object): Promise<object>;
    updateThreeDS(id: string, body: object): Promise<object>;
    getThreeDSDetails(id: string): Promise<object>;
    activateCard(id: string): Promise<object>;
    getCardCredentials(id: string, body: object): Promise<object>;
    renewCard(id: string, body: object): Promise<object>;
    revokeCard(id: string, body: object): Promise<object>;
    scheduleCardRevocation(id: string, body: object): Promise<object>;
    cancelScheduledCardRevocation(id: string): Promise<object>;
    suspendCard(id: string, body: object): Promise<object>;
}
