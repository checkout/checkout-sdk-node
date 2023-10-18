import { config } from '../../Checkout';

export default class Issuing {
    constructor(config: config);

    createCardholder: (body: Object) => Promise<Object>;
    getCardholder: (id: string) => Promise<Object>;
    getCardholderCards: (id: string) => Promise<Object>;
    createCard: (body: Object) => Promise<Object>;
    getCardDetails: (id: string) => Promise<Object>;
    enrollThreeDS: (id: string, body: Object) => Promise<Object>;
    updateThreeDS: (id: string, body: Object) => Promise<Object>;
    getThreeDSDetails: (id: string) => Promise<Object>;
    activateCard: (id: string) => Promise<Object>;
    getCardCredentials: (id: string, body: Object) => Promise<Object>;
    revokeCard: (id: string, body: Object) => Promise<Object>;
    suspendCard: (id: string, body: Object) => Promise<Object>;
    createCardControl: (body: Object) => Promise<Object>;
    getCardControls: (params: Object) => Promise<Object>;
    getCardControlDetails: (id: string) => Promise<Object>;
    updateCardControl: (id: string, body: Object) => Promise<Object>;
    deleteCardControl: (id: string) => Promise<Object>;
    simulateAuthorization: (body: Object) => Promise<Object>;
}