import { config } from '../../Checkout';

export default class IdentityVerifications {
    constructor(config: config);

    createIdentityVerification(body: object): Promise<object>;
    createAndStartIdentityVerification(body: object): Promise<object>;
    getIdentityVerification(identityVerificationId: string): Promise<object>;
    createAttempt(identityVerificationId: string, body: object): Promise<object>;
    listAttempts(identityVerificationId: string): Promise<object>;
    getAttempt(identityVerificationId: string, attemptId: string): Promise<object>;
    anonymizeIdentityVerification(identityVerificationId: string): Promise<object>;
    getPDFReport(identityVerificationId: string): Promise<Buffer>;
}
