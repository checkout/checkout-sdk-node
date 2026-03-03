import { config } from '../../Checkout';

export default class IDDocumentVerifications {
    constructor(config: config);

    createIDDocumentVerification(body: object): Promise<object>;
    getIDDocumentVerification(idDocumentVerificationId: string): Promise<object>;
    listAttempts(idDocumentVerificationId: string): Promise<object>;
    getAttempt(idDocumentVerificationId: string, attemptId: string): Promise<object>;
    createAttempt(idDocumentVerificationId: string, body: object): Promise<object>;
    anonymizeIDDocumentVerification(idDocumentVerificationId: string): Promise<object>;
    getPDFReport(idDocumentVerificationId: string): Promise<Buffer>;
}
