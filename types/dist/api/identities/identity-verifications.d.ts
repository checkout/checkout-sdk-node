import { config } from '../../Checkout';

export default class IdentityVerifications {
    constructor(config: config);

    createIdentityVerification(body: object): Promise<object>;
    createAndStartIdentityVerification(body: object): Promise<object>;
    getIdentityVerification(identityVerificationId: string): Promise<object>;
    createAttempt(identityVerificationId: string, body: object): Promise<object>;
    /**
     * List the verification attempts. Results are paginated: pass `skip` and `limit` on `params`.
     */
    listAttempts(identityVerificationId: string, params?: object): Promise<object>;
    getAttempt(identityVerificationId: string, attemptId: string): Promise<object>;
    getAttemptAssets(identityVerificationId: string, attemptId: string, params?: object): Promise<object>;
    anonymizeIdentityVerification(identityVerificationId: string): Promise<object>;
    /**
     * Get the PDF report.
     *
     * Resolves to the JSON body, which carries `pdf_report`, the pre-signed URL to the PDF. The
     * 2026-09-02 spec renamed that property from `signed_url`.
     *
     * This used to be `Promise<Buffer>`, and the implementation really did return one: it passed
     * `csv: true`, which wraps the body in a Buffer and sends `Content-Type: text/csv`. The
     * endpoint answers `application/json`, so a caller could never reach `pdf_report`. Both the
     * method and this signature now follow the spec.
     */
    getPDFReport(identityVerificationId: string): Promise<object>;
}
