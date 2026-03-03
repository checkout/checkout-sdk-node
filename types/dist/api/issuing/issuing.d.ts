import { config } from '../../Checkout';
import Cardholders from './cardholders';
import Cards from './cards';
import Controls from './controls';
import ControlGroups from './control-groups';
import ControlProfiles from './control-profiles';
import DigitalCards from './digital-cards';
import Disputes from './disputes';
import Transactions from './transactions';
import Simulate from './simulate';
import Access from './access';

export default class Issuing {
    constructor(config: config);

    // Submodules
    cardholders: Cardholders;
    cards: Cards;
    controls: Controls;
    controlGroups: ControlGroups;
    controlProfiles: ControlProfiles;
    digitalCards: DigitalCards;
    disputes: Disputes;
    transactions: Transactions;
    simulate: Simulate;
    access: Access;

    // Backwards compatibility - Cardholders
    createCardholder(body: object): Promise<object>;
    getCardholder(id: string): Promise<object>;
    updateCardholder(id: string, body: object): Promise<object>;
    getCardholderCards(id: string): Promise<object>;

    // Backwards compatibility - Cards
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

    // Backwards compatibility - Controls
    createCardControl(body: object): Promise<object>;
    getCardControls(params: object): Promise<object>;
    getCardControlDetails(id: string): Promise<object>;
    updateCardControl(id: string, body: object): Promise<object>;
    deleteCardControl(id: string): Promise<object>;

    // Backwards compatibility - Control Groups
    createControlGroup(body: object): Promise<object>;
    getControlGroupByTarget(params: object): Promise<object>;
    getControlGroup(controlGroupId: string): Promise<object>;
    deleteControlGroup(controlGroupId: string): Promise<object>;

    // Backwards compatibility - Control Profiles
    createControlProfile(body: object): Promise<object>;
    getControlProfilesByTarget(params: object): Promise<object>;
    getControlProfile(controlProfileId: string): Promise<object>;
    updateControlProfile(controlProfileId: string, body: object): Promise<object>;
    deleteControlProfile(controlProfileId: string): Promise<object>;
    addTargetToControlProfile(controlProfileId: string, targetId: string): Promise<object>;
    removeTargetFromControlProfile(controlProfileId: string, targetId: string): Promise<object>;

    // Backwards compatibility - Digital Cards
    getDigitalCard(digitalCardId: string): Promise<object>;

    // Backwards compatibility - Disputes
    createDispute(body: object): Promise<object>;
    getDispute(disputeId: string): Promise<object>;
    cancelDispute(disputeId: string): Promise<object>;
    escalateDispute(disputeId: string): Promise<object>;
    submitDispute(disputeId: string): Promise<object>;

    // Backwards compatibility - Transactions
    getTransactions(params: object): Promise<object>;
    getTransactionById(transactionId: string): Promise<object>;

    // Backwards compatibility - Simulate
    simulateAuthorization(body: object): Promise<object>;
    simulateIncrement(id: string, body: object): Promise<object>;
    simulateClearing(id: string, body: object): Promise<object>;
    simulateRefund(id: string, body: object): Promise<object>;
    simulateReversal(id: string, body: object): Promise<object>;
    simulateOobAuthentication(body: object): Promise<object>;

    // Backwards compatibility - Access
    requestCardholderAccessToken(body: object): Promise<object>;
}