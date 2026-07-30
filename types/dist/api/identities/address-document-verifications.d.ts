import { config } from '../../Checkout';

export default class AddressDocumentVerifications {
    constructor(config: config);

    createAddressDocumentVerification(body: object): Promise<object>;
    getAddressDocumentVerification(addressDocumentVerificationId: string): Promise<object>;
    listAttempts(addressDocumentVerificationId: string): Promise<object>;
    getAttempt(addressDocumentVerificationId: string, attemptId: string): Promise<object>;
    createAttempt(addressDocumentVerificationId: string, body: object): Promise<object>;
    anonymizeAddressDocumentVerification(addressDocumentVerificationId: string): Promise<object>;
    getPDFReport(addressDocumentVerificationId: string): Promise<Buffer>;
}
