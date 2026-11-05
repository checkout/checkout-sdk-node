import { expect } from 'chai';
import nock from 'nock';
import { Checkout } from '../../src/index.js';
import { ValueError } from '../../src/services/errors.js';
import ApmSpecificBaloto from '../../src/api/apm-specific/baloto.js';
import ApmSpecificBoleto from '../../src/api/apm-specific/boleto.js';
import ApmSpecificFawry from '../../src/api/apm-specific/fawry.js';
import ApmSpecificKlarna from '../../src/api/apm-specific/klarna.js';
import ApmSpecificOxxo from '../../src/api/apm-specific/oxxo.js';
import ApmSpecificPagofacil from '../../src/api/apm-specific/pagofacil.js';
import ApmSpecificRapipago from '../../src/api/apm-specific/rapipago.js';
import ApmSpecificSepa from '../../src/api/apm-specific/sepa.js';
import BalancesBalances from '../../src/api/balances/balances.js';
import ComplianceRequestsComplianceRequests from '../../src/api/compliance-requests/compliance-requests.js';
import CustomersCustomers from '../../src/api/customers/customers.js';
import DisputesDisputes from '../../src/api/disputes/disputes.js';
import EventsEvents from '../../src/api/events/events.js';
import FilesFiles from '../../src/api/files/files.js';
import ForwardForward from '../../src/api/forward/forward.js';
import GooglePayGooglePay from '../../src/api/google-pay/google-pay.js';
import HostedPaymentsHostedPayments from '../../src/api/hosted-payments/hosted-payments.js';
import IdentitiesAddressDocumentVerifications from '../../src/api/identities/address-document-verifications.js';
import IdentitiesAmlScreenings from '../../src/api/identities/aml-screenings.js';
import IdentitiesApplicants from '../../src/api/identities/applicants.js';
import IdentitiesFaceAuthentications from '../../src/api/identities/face-authentications.js';
import IdentitiesIdDocumentVerifications from '../../src/api/identities/id-document-verifications.js';
import IdentitiesIdentityVerifications from '../../src/api/identities/identity-verifications.js';
import InstrumentsInstruments from '../../src/api/instruments/instruments.js';
import InventoryInventory from '../../src/api/inventory/inventory.js';
import IssuingCardholders from '../../src/api/issuing/cardholders.js';
import IssuingCards from '../../src/api/issuing/cards.js';
import IssuingControlGroups from '../../src/api/issuing/control-groups.js';
import IssuingControlProfiles from '../../src/api/issuing/control-profiles.js';
import IssuingControls from '../../src/api/issuing/controls.js';
import IssuingDigitalCards from '../../src/api/issuing/digital-cards.js';
import IssuingDisputes from '../../src/api/issuing/disputes.js';
import IssuingSimulate from '../../src/api/issuing/simulate.js';
import IssuingTransactions from '../../src/api/issuing/transactions.js';
import NetworkTokensNetworkTokens from '../../src/api/network-tokens/network-tokens.js';
import OnboardingSimulatorOnboardingSimulator from '../../src/api/onboarding-simulator/onboarding-simulator.js';
import PaymentContextsPaymentContexts from '../../src/api/payment-contexts/payment-contexts.js';
import PaymentSessionsPaymentSessions from '../../src/api/payment-sessions/payment-sessions.js';
import PaymentSetupsPaymentSetups from '../../src/api/payment-setups/payment-setups.js';
import PaymentsLinksPaymentsLinks from '../../src/api/payments-links/payments-links.js';
import PaymentsPayments from '../../src/api/payments/payments.js';
import PlatformsEntityRequirements from '../../src/api/platforms/entity-requirements.js';
import PlatformsFiles from '../../src/api/platforms/files.js';
import PlatformsPaymentInstruments from '../../src/api/platforms/payment-instruments.js';
import PlatformsPayoutSchedules from '../../src/api/platforms/payout-schedules.js';
import PlatformsReserveRules from '../../src/api/platforms/reserve-rules.js';
import PlatformsSubentity from '../../src/api/platforms/subentity.js';
import ReconciliationReconciliation from '../../src/api/reconciliation/reconciliation.js';
import ReportsReports from '../../src/api/reports/reports.js';
import SessionsSessions from '../../src/api/sessions/sessions.js';
import TokensTokens from '../../src/api/tokens/tokens.js';
import TransfersTransfers from '../../src/api/transfers/transfers.js';
import WebhooksWebhooks from '../../src/api/webhooks/webhooks.js';
import WorkflowsWorkflows from '../../src/api/workflows/workflows.js';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';
const VALID = 'abc_123';

// Values with reserved characters, which the SDK percent-encodes.
const RESERVED = ['../x', '%2e%2e/x', '..\\x', 'a?b', 'a#b'];

// encodeURIComponent leaves "." and ".." unchanged, so these are rejected before any request is sent.
const REJECTED = ['..', '.', '', undefined, null];

// One row per SDK method that puts a caller value in the request path: the endpoint class, the
// method, the arguments with every path value set to v, and the path sent for a valid id.
const METHODS = [
    [ApmSpecificBaloto, 'succeed', (v) => [v], '/apms/baloto/payments/abc_123/succeed'],
    [ApmSpecificBaloto, 'expire', (v) => [v], '/apms/baloto/payments/abc_123/expire'],
    [ApmSpecificBoleto, 'succeed', (v) => [v], '/apms/boleto/payments/abc_123/succeed'],
    [ApmSpecificBoleto, 'expire', (v) => [v], '/apms/boleto/payments/abc_123/expire'],
    [ApmSpecificFawry, 'approve', (v) => [v], '/fawry/payments/abc_123/approval'],
    [ApmSpecificFawry, 'cancel', (v) => [v], '/fawry/payments/abc_123/cancellation'],
    [ApmSpecificKlarna, 'getSession', (v) => [v], '/klarna-external/credit-sessions/abc_123'],
    [ApmSpecificKlarna, 'capture', (v) => [v, {}], '/klarna-external/orders/abc_123/captures'],
    [ApmSpecificKlarna, 'void', (v) => [v, {}], '/klarna-external/orders/abc_123/voids'],
    [ApmSpecificOxxo, 'succeed', (v) => [v], '/apms/oxxo/payments/abc_123/succeed'],
    [ApmSpecificOxxo, 'expire', (v) => [v], '/apms/oxxo/payments/abc_123/expire'],
    [ApmSpecificPagofacil, 'succeed', (v) => [v], '/apms/pagofacil/payments/abc_123/succeed'],
    [ApmSpecificPagofacil, 'expire', (v) => [v], '/apms/pagofacil/payments/abc_123/expire'],
    [ApmSpecificRapipago, 'succeed', (v) => [v], '/apms/rapipago/payments/abc_123/succeed'],
    [ApmSpecificRapipago, 'expire', (v) => [v], '/apms/rapipago/payments/abc_123/expire'],
    [ApmSpecificSepa, 'getMandate', (v) => [v], '/sepa-external/mandates/abc_123'],
    [ApmSpecificSepa, 'cancelMandate', (v) => [v], '/sepa-external/mandates/abc_123/cancel'],
    [ApmSpecificSepa, 'getPPROMandate', (v) => [v], '/ppro/sepa-external/mandates/abc_123'],
    [ApmSpecificSepa, 'cancelPPROMandate', (v) => [v], '/ppro/sepa-external/mandates/abc_123/cancel'],
    [BalancesBalances, 'retrieve', (v) => [v, {}], '/balances/abc_123'],
    [BalancesBalances, 'retrieveTopUpInstructions', (v) => [v, v], '/entities/abc_123/currency-accounts/abc_123/top-up-instructions'],
    [ComplianceRequestsComplianceRequests, 'getComplianceRequest', (v) => [v], '/compliance-requests/abc_123'],
    [ComplianceRequestsComplianceRequests, 'respondToComplianceRequest', (v) => [v, {}], '/compliance-requests/abc_123'],
    [CustomersCustomers, 'get', (v) => [v], '/customers/abc_123'],
    [CustomersCustomers, 'update', (v) => [v, {}], '/customers/abc_123'],
    [CustomersCustomers, 'delete', (v) => [v], '/customers/abc_123'],
    [DisputesDisputes, 'getDetails', (v) => [v], '/disputes/abc_123'],
    [DisputesDisputes, 'accept', (v) => [v], '/disputes/abc_123/accept'],
    [DisputesDisputes, 'provideEvidence', (v) => [v, {}], '/disputes/abc_123/evidence'],
    [DisputesDisputes, 'getEvidence', (v) => [v], '/disputes/abc_123/evidence'],
    [DisputesDisputes, 'submit', (v) => [v], '/disputes/abc_123/evidence'],
    [DisputesDisputes, 'getCompiledSubmittedEvidence', (v) => [v], '/disputes/abc_123/evidence/submitted'],
    [DisputesDisputes, 'getDisputeSchemeFiles', (v) => [v], '/disputes/abc_123/schemefiles'],
    [DisputesDisputes, 'submitArbitrationEvidence', (v) => [v], '/disputes/abc_123/evidence/arbitration'],
    [DisputesDisputes, 'getCompiledSubmittedArbitrationEvidence', (v) => [v], '/disputes/abc_123/evidence/arbitration/submitted'],
    [EventsEvents, 'retrieveEvent', (v) => [v], '/events/abc_123'],
    [EventsEvents, 'retrieveEventNotification', (v) => [{ eventId: v, notificationId: v }], '/events/abc_123/notifications/abc_123'],
    [EventsEvents, 'retry', (v) => [{ eventId: v, webhookId: v }], '/events/abc_123/webhooks/abc_123/retry'],
    [EventsEvents, 'retryAll', (v) => [v], '/events/abc_123/webhooks/retry'],
    [FilesFiles, 'getFile', (v) => [v], '/files/abc_123'],
    [ForwardForward, 'get', (v) => [v], '/forward/abc_123'],
    [ForwardForward, 'updateSecret', (v) => [v, {}], '/secrets/abc_123'],
    [ForwardForward, 'deleteSecret', (v) => [v], '/secrets/abc_123'],
    [GooglePayGooglePay, 'registerDomain', (v) => [v, {}], '/googlepay/enrollments/abc_123/domain'],
    [GooglePayGooglePay, 'getRegisteredDomains', (v) => [v], '/googlepay/enrollments/abc_123/domains'],
    [GooglePayGooglePay, 'getEnrollmentState', (v) => [v], '/googlepay/enrollments/abc_123/state'],
    [HostedPaymentsHostedPayments, 'get', (v) => [v], '/hosted-payments/abc_123'],
    [IdentitiesAddressDocumentVerifications, 'getAddressDocumentVerification', (v) => [v], '/address-document-verifications/abc_123'],
    [IdentitiesAddressDocumentVerifications, 'listAttempts', (v) => [v, {}], '/address-document-verifications/abc_123/attempts'],
    [IdentitiesAddressDocumentVerifications, 'getAttempt', (v) => [v, v], '/address-document-verifications/abc_123/attempts/abc_123'],
    [IdentitiesAddressDocumentVerifications, 'anonymizeAddressDocumentVerification', (v) => [v], '/address-document-verifications/abc_123/anonymize'],
    [IdentitiesAddressDocumentVerifications, 'createAttempt', (v) => [v, {}], '/address-document-verifications/abc_123/attempts'],
    [IdentitiesAddressDocumentVerifications, 'getPDFReport', (v) => [v], '/address-document-verifications/abc_123/pdf-report'],
    [IdentitiesAddressDocumentVerifications, 'getAttemptAssets', (v) => [v, v, {}], '/address-document-verifications/abc_123/attempts/abc_123/assets'],
    [IdentitiesAmlScreenings, 'getAMLScreening', (v) => [v], '/aml-verifications/abc_123'],
    [IdentitiesApplicants, 'getApplicant', (v) => [v], '/applicants/abc_123'],
    [IdentitiesApplicants, 'updateApplicant', (v) => [v, {}], '/applicants/abc_123'],
    [IdentitiesApplicants, 'anonymizeApplicant', (v) => [v], '/applicants/abc_123/anonymize'],
    [IdentitiesFaceAuthentications, 'getFaceAuthentication', (v) => [v], '/face-authentications/abc_123'],
    [IdentitiesFaceAuthentications, 'listAttempts', (v) => [v, {}], '/face-authentications/abc_123/attempts'],
    [IdentitiesFaceAuthentications, 'getAttempt', (v) => [v, v], '/face-authentications/abc_123/attempts/abc_123'],
    [IdentitiesFaceAuthentications, 'getAttemptAssets', (v) => [v, v, {}], '/face-authentications/abc_123/attempts/abc_123/assets'],
    [IdentitiesFaceAuthentications, 'createAttempt', (v) => [v, {}], '/face-authentications/abc_123/attempts'],
    [IdentitiesFaceAuthentications, 'anonymizeFaceAuthentication', (v) => [v], '/face-authentications/abc_123/anonymize'],
    [IdentitiesIdDocumentVerifications, 'getIDDocumentVerification', (v) => [v], '/id-document-verifications/abc_123'],
    [IdentitiesIdDocumentVerifications, 'listAttempts', (v) => [v, {}], '/id-document-verifications/abc_123/attempts'],
    [IdentitiesIdDocumentVerifications, 'getAttempt', (v) => [v, v], '/id-document-verifications/abc_123/attempts/abc_123'],
    [IdentitiesIdDocumentVerifications, 'anonymizeIDDocumentVerification', (v) => [v], '/id-document-verifications/abc_123/anonymize'],
    [IdentitiesIdDocumentVerifications, 'createAttempt', (v) => [v, {}], '/id-document-verifications/abc_123/attempts'],
    [IdentitiesIdDocumentVerifications, 'getPDFReport', (v) => [v], '/id-document-verifications/abc_123/pdf-report'],
    [IdentitiesIdDocumentVerifications, 'getAttemptAssets', (v) => [v, v, {}], '/id-document-verifications/abc_123/attempts/abc_123/assets'],
    [IdentitiesIdentityVerifications, 'getIdentityVerification', (v) => [v], '/identity-verifications/abc_123'],
    [IdentitiesIdentityVerifications, 'anonymizeIdentityVerification', (v) => [v], '/identity-verifications/abc_123/anonymize'],
    [IdentitiesIdentityVerifications, 'createAttempt', (v) => [v, {}], '/identity-verifications/abc_123/attempts'],
    [IdentitiesIdentityVerifications, 'listAttempts', (v) => [v, {}], '/identity-verifications/abc_123/attempts'],
    [IdentitiesIdentityVerifications, 'getAttempt', (v) => [v, v], '/identity-verifications/abc_123/attempts/abc_123'],
    [IdentitiesIdentityVerifications, 'getAttemptAssets', (v) => [v, v, {}], '/identity-verifications/abc_123/attempts/abc_123/assets'],
    [IdentitiesIdentityVerifications, 'getPDFReport', (v) => [v], '/identity-verifications/abc_123/pdf-report'],
    [InstrumentsInstruments, 'get', (v) => [v], '/instruments/abc_123'],
    [InstrumentsInstruments, 'update', (v) => [v, {}], '/instruments/abc_123'],
    [InstrumentsInstruments, 'delete', (v) => [v], '/instruments/abc_123'],
    [InstrumentsInstruments, 'revoke', (v) => [v], '/instruments/abc_123/revoke'],
    [InstrumentsInstruments, 'getBankAccountFieldFormatting', (v) => [v, v, {}], '/validation/bank-accounts/abc_123/abc_123'],
    [InventoryInventory, 'getInventoryReservation', (v) => [v], '/inventory/reservations/abc_123'],
    [InventoryInventory, 'commitInventoryReservation', (v) => [v], '/inventory/reservations/abc_123/commit'],
    [InventoryInventory, 'releaseInventoryReservation', (v) => [v], '/inventory/reservations/abc_123/release'],
    [InventoryInventory, 'getInventoryLevels', (v) => [v, {}], '/inventory/abc_123'],
    [InventoryInventory, 'setInventoryLevels', (v) => [v, {}], '/inventory/abc_123'],
    [InventoryInventory, 'getInventoryProduct', (v) => [v], '/inventory/abc_123/product'],
    [InventoryInventory, 'setInventoryProduct', (v) => [v, {}], '/inventory/abc_123/product'],
    [InventoryInventory, 'deleteInventoryProduct', (v) => [v], '/inventory/abc_123/product'],
    [IssuingCardholders, 'getCardholder', (v) => [v], '/issuing/cardholders/abc_123'],
    [IssuingCardholders, 'updateCardholder', (v) => [v, {}], '/issuing/cardholders/abc_123'],
    [IssuingCardholders, 'getCardholderCards', (v) => [v], '/issuing/cardholders/abc_123/cards'],
    [IssuingCards, 'getCardDetails', (v) => [v], '/issuing/cards/abc_123'],
    [IssuingCards, 'updateCard', (v) => [v, {}, {}], '/issuing/cards/abc_123'],
    [IssuingCards, 'enrollThreeDS', (v) => [v, {}], '/issuing/cards/abc_123/3ds-enrollment'],
    [IssuingCards, 'updateThreeDS', (v) => [v, {}], '/issuing/cards/abc_123/3ds-enrollment'],
    [IssuingCards, 'getThreeDSDetails', (v) => [v], '/issuing/cards/abc_123/3ds-enrollment'],
    [IssuingCards, 'activateCard', (v) => [v], '/issuing/cards/abc_123/activate'],
    [IssuingCards, 'getCardCredentials', (v) => [v, {}], '/issuing/cards/abc_123/credentials'],
    [IssuingCards, 'renewCard', (v) => [v, {}], '/issuing/cards/abc_123/renew'],
    [IssuingCards, 'revokeCard', (v) => [v, {}], '/issuing/cards/abc_123/revoke'],
    [IssuingCards, 'suspendCard', (v) => [v, {}], '/issuing/cards/abc_123/suspend'],
    [IssuingControlGroups, 'getControlGroup', (v) => [v], '/issuing/controls/control-groups/abc_123'],
    [IssuingControlGroups, 'deleteControlGroup', (v) => [v], '/issuing/controls/control-groups/abc_123'],
    [IssuingControlProfiles, 'getControlProfile', (v) => [v], '/issuing/controls/control-profiles/abc_123'],
    [IssuingControlProfiles, 'updateControlProfile', (v) => [v, {}], '/issuing/controls/control-profiles/abc_123'],
    [IssuingControlProfiles, 'deleteControlProfile', (v) => [v], '/issuing/controls/control-profiles/abc_123'],
    [IssuingControlProfiles, 'addTargetToControlProfile', (v) => [v, v], '/issuing/controls/control-profiles/abc_123/add/abc_123'],
    [IssuingControlProfiles, 'removeTargetFromControlProfile', (v) => [v, v], '/issuing/controls/control-profiles/abc_123/remove/abc_123'],
    [IssuingControls, 'getCardControlDetails', (v) => [v], '/issuing/controls/abc_123'],
    [IssuingControls, 'updateCardControl', (v) => [v, {}], '/issuing/controls/abc_123'],
    [IssuingControls, 'deleteCardControl', (v) => [v], '/issuing/controls/abc_123'],
    [IssuingDigitalCards, 'getDigitalCard', (v) => [v], '/issuing/digital-cards/abc_123'],
    [IssuingDisputes, 'getDispute', (v) => [v], '/issuing/disputes/abc_123'],
    [IssuingDisputes, 'cancelDispute', (v) => [v], '/issuing/disputes/abc_123/cancel'],
    [IssuingDisputes, 'escalateDispute', (v) => [v, {}], '/issuing/disputes/abc_123/escalate'],
    [IssuingDisputes, 'amendDispute', (v) => [v, {}], '/issuing/disputes/abc_123/amend'],
    [IssuingDisputes, 'submitDispute', (v) => [v, {}], '/issuing/disputes/abc_123/submit'],
    [IssuingSimulate, 'simulateIncrement', (v) => [v, {}], '/issuing/simulate/authorizations/abc_123/authorizations'],
    [IssuingSimulate, 'simulateClearing', (v) => [v, {}], '/issuing/simulate/authorizations/abc_123/presentments'],
    [IssuingSimulate, 'simulateRefund', (v) => [v, {}], '/issuing/simulate/authorizations/abc_123/refunds'],
    [IssuingSimulate, 'simulateReversal', (v) => [v, {}], '/issuing/simulate/authorizations/abc_123/reversals'],
    [IssuingTransactions, 'getTransactionById', (v) => [v], '/issuing/transactions/abc_123'],
    [NetworkTokensNetworkTokens, 'getNetworkToken', (v) => [v], '/network-tokens/abc_123'],
    [NetworkTokensNetworkTokens, 'provisionCryptogram', (v) => [v, {}], '/network-tokens/abc_123/cryptograms'],
    [NetworkTokensNetworkTokens, 'deleteNetworkToken', (v) => [v], '/network-tokens/abc_123/delete'],
    [OnboardingSimulatorOnboardingSimulator, 'setRequirementsDue', (v) => [v, {}], '/simulate/entities/abc_123/requirements-due'],
    [OnboardingSimulatorOnboardingSimulator, 'runScenario', (v) => [v, v], '/simulate/entities/abc_123/scenarios/abc_123'],
    [OnboardingSimulatorOnboardingSimulator, 'setEntityStatus', (v) => [v, {}], '/simulate/entities/abc_123/status'],
    [PaymentContextsPaymentContexts, 'get', (v) => [v], '/payment-contexts/abc_123'],
    [PaymentSessionsPaymentSessions, 'submit', (v) => [v, {}], '/payment-sessions/abc_123/submit'],
    [PaymentSetupsPaymentSetups, 'updateAPaymentSetup', (v) => [v, { amount: 1000, currency: 'GBP' }], '/payments/setups/abc_123'],
    [PaymentSetupsPaymentSetups, 'getAPaymentSetup', (v) => [v], '/payments/setups/abc_123'],
    [PaymentSetupsPaymentSetups, 'confirmAPaymentSetup', (v) => [v, v], '/payments/setups/abc_123/confirm/abc_123'],
    [PaymentsLinksPaymentsLinks, 'get', (v) => [v], '/payment-links/abc_123'],
    [PaymentsPayments, 'get', (v) => [v], '/payments/abc_123'],
    [PaymentsPayments, 'getActions', (v) => [v], '/payments/abc_123/actions'],
    [PaymentsPayments, 'increment', (v) => [v, {}, {}], '/payments/abc_123/authorizations'],
    [PaymentsPayments, 'cancelScheduledRetry', (v) => [v, {}, {}], '/payments/abc_123/cancellations'],
    [PaymentsPayments, 'capture', (v) => [v, {}, {}], '/payments/abc_123/captures'],
    [PaymentsPayments, 'refund', (v) => [v, {}, {}], '/payments/abc_123/refunds'],
    [PaymentsPayments, 'reverse', (v) => [v, {}, {}], '/payments/abc_123/reversals'],
    [PaymentsPayments, 'void', (v) => [v, {}, {}], '/payments/abc_123/voids'],
    [PlatformsEntityRequirements, 'getEntityRequirements', (v) => [v], '/accounts/entities/abc_123/requirements'],
    [PlatformsEntityRequirements, 'getEntityRequirementDetails', (v) => [v, v], '/accounts/entities/abc_123/requirements/abc_123'],
    [PlatformsEntityRequirements, 'updateEntityRequirement', (v) => [v, v, {}], '/accounts/entities/abc_123/requirements/abc_123'],
    [PlatformsFiles, 'uploadAFile', (v) => [v, {}], '/entities/abc_123/files'],
    [PlatformsFiles, 'retrieveAFile', (v) => [v, v], '/entities/abc_123/files/abc_123'],
    [PlatformsPaymentInstruments, 'getPaymentInstrumentDetails', (v) => [v, v], '/accounts/entities/abc_123/payment-instruments/abc_123'],
    [PlatformsPaymentInstruments, 'updatePaymentInstrumentDetails', (v) => [v, v, {}], '/accounts/entities/abc_123/payment-instruments/abc_123'],
    [PlatformsPaymentInstruments, 'createPaymentInstrument', (v) => [v, {}], '/accounts/entities/abc_123/instruments'],
    [PlatformsPaymentInstruments, 'addPaymentInstrument', (v) => [v, {}], '/accounts/entities/abc_123/payment-instruments'],
    [PlatformsPaymentInstruments, 'queryPaymentInstruments', (v) => [v], '/accounts/entities/abc_123/payment-instruments'],
    [PlatformsPayoutSchedules, 'retrieveSubEntityPayoutSchedule', (v) => [v], '/accounts/entities/abc_123/payout-schedules'],
    [PlatformsPayoutSchedules, 'updateSubEntityPayoutSchedule', (v) => [v, {}], '/accounts/entities/abc_123/payout-schedules'],
    [PlatformsReserveRules, 'getReserveRuleDetails', (v) => [v, v], '/accounts/entities/abc_123/reserve-rules/abc_123'],
    [PlatformsReserveRules, 'updateReserveRule', (v) => [v, v, {}, {}], '/accounts/entities/abc_123/reserve-rules/abc_123'],
    [PlatformsReserveRules, 'addReserveRule', (v) => [v, {}], '/accounts/entities/abc_123/reserve-rules'],
    [PlatformsReserveRules, 'queryReserveRules', (v) => [v], '/accounts/entities/abc_123/reserve-rules'],
    [PlatformsSubentity, 'getSubEntityDetails', (v) => [v], '/accounts/entities/abc_123'],
    [PlatformsSubentity, 'updateSubEntityDetails', (v) => [v, {}], '/accounts/entities/abc_123'],
    [PlatformsSubentity, 'getSubEntityMembers', (v) => [v], '/accounts/entities/abc_123/members'],
    [PlatformsSubentity, 'reinviteSubEntityMember', (v) => [v, v, {}], '/accounts/entities/abc_123/members/abc_123'],
    [ReconciliationReconciliation, 'getPayment', (v) => [v], '/reporting/payments/abc_123'],
    [ReconciliationReconciliation, 'getStatementCsv', (v) => [v], '/reporting/statements/abc_123/payments/download'],
    [ReconciliationReconciliation, 'getPaymentsAction', (v) => [v], '/reporting/payments/actions/abc_123'],
    [ReconciliationReconciliation, 'getAction', (v) => [v], '/reporting/actions/abc_123'],
    [ReportsReports, 'getReportDetails', (v) => [v], '/reports/abc_123'],
    [ReportsReports, 'getReportFile', (v) => [v, v], '/reports/abc_123/files/abc_123'],
    [SessionsSessions, 'get', (v) => [v, {}], '/sessions/abc_123'],
    [SessionsSessions, 'update', (v) => [v, {}], '/sessions/abc_123/collect-data'],
    [SessionsSessions, 'complete', (v) => [v], '/sessions/abc_123/complete'],
    [SessionsSessions, 'update3DSMethodCompletionIndicator', (v) => [v, {}], '/sessions/abc_123/issuer-fingerprint'],
    [TokensTokens, 'getTokenMetadata', (v) => [v], '/tokens/abc_123/metadata'],
    [TransfersTransfers, 'retrieve', (v) => [v], '/transfers/abc_123'],
    [WebhooksWebhooks, 'retrieveWebhook', (v) => [v], '/webhooks/abc_123'],
    [WebhooksWebhooks, 'updateWebhook', (v) => [v, {}], '/webhooks/abc_123'],
    [WebhooksWebhooks, 'partiallyUpdateWebhook', (v) => [v, {}], '/webhooks/abc_123'],
    [WebhooksWebhooks, 'removeWebhook', (v) => [v], '/webhooks/abc_123'],
    [WorkflowsWorkflows, 'get', (v) => [v], '/workflows/abc_123'],
    [WorkflowsWorkflows, 'remove', (v) => [v], '/workflows/abc_123'],
    [WorkflowsWorkflows, 'patch', (v) => [v, {}], '/workflows/abc_123'],
    [WorkflowsWorkflows, 'addAction', (v) => [v, {}], '/workflows/abc_123/actions'],
    [WorkflowsWorkflows, 'updateAction', (v) => [v, v, {}], '/workflows/abc_123/actions/abc_123'],
    [WorkflowsWorkflows, 'removeAction', (v) => [v, v], '/workflows/abc_123/actions/abc_123'],
    [WorkflowsWorkflows, 'addCondition', (v) => [v, {}], '/workflows/abc_123/conditions'],
    [WorkflowsWorkflows, 'updateCondition', (v) => [v, v, {}], '/workflows/abc_123/conditions/abc_123'],
    [WorkflowsWorkflows, 'removeCondition', (v) => [v, v], '/workflows/abc_123/conditions/abc_123'],
    [WorkflowsWorkflows, 'test', (v) => [v, {}], '/workflows/abc_123/test'],
    [WorkflowsWorkflows, 'getEvent', (v) => [v], '/workflows/events/abc_123'],
    [WorkflowsWorkflows, 'getActionInvocations', (v) => [v, v], '/workflows/events/abc_123/actions/abc_123'],
    [WorkflowsWorkflows, 'reflowByEvent', (v) => [v], '/workflows/events/abc_123/reflow'],
    [WorkflowsWorkflows, 'reflowByEventAndWorkflow', (v) => [v, v], '/workflows/events/abc_123/workflow/abc_123/reflow'],
    [WorkflowsWorkflows, 'getSubjectEvents', (v) => [v], '/workflows/events/subject/abc_123'],
    [WorkflowsWorkflows, 'reflowBySubject', (v) => [v], '/workflows/events/subject/abc_123/reflow'],
    [WorkflowsWorkflows, 'reflowBySubjectAndWorkflow', (v) => [v, v], '/workflows/events/subject/abc_123/workflow/abc_123/reflow'],
];

describe('Path segments - caller values are encoded', () => {
    const { config } = new Checkout(SK, { subdomain: '123456789' });
    let captured;

    beforeEach(() => {
        nock.disableNetConnect();
        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach((verb) => {
            nock(/.*/)
                .persist()
                .intercept(/.*/, verb)
                .reply(function (uri) {
                    captured.push(uri);
                    return [200, {}];
                });
        });
    });

    afterEach(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });

    // Returns the path of the request the method sent. Errors other than ValueError come from
    // reading the stubbed response and do not matter here: the request has already gone out.
    const send = async (Endpoint, method, args, value) => {
        captured = [];
        try {
            await new Endpoint(config)[method](...args(value));
        } catch (err) {
            if (err instanceof ValueError) {
                throw err;
            }
        }
        return captured[captured.length - 1];
    };

    METHODS.forEach(([Endpoint, method, args, validPath]) => {
        const label = `${Endpoint.name}.${method}`;

        it(`${label} sends a valid id unchanged`, async () => {
            const path = await send(Endpoint, method, args, VALID);
            expect(path, label).to.equal(validPath);
        });

        it(`${label} encodes values with reserved characters`, async () => {
            for (const value of RESERVED) {
                const path = await send(Endpoint, method, args, value);
                expect(path, `${label} with ${value}`).to.equal(
                    validPath.split(VALID).join(encodeURIComponent(value))
                );
            }
        });

        it(`${label} rejects ., .., empty, undefined and null without sending a request`, async () => {
            for (const value of REJECTED) {
                let error;
                try {
                    await send(Endpoint, method, args, value);
                } catch (err) {
                    error = err;
                }
                expect(error, `${label} with ${JSON.stringify(value)}`).to.be.instanceOf(ValueError);
                expect(captured, `${label} with ${JSON.stringify(value)}`).to.be.empty;
            }
        });
    });
});
