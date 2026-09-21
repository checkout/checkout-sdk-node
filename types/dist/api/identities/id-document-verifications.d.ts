import { config } from '../../Checkout';

export default class IDDocumentVerifications {
    constructor(config: config);

    createIDDocumentVerification(body: object): Promise<object>;
    getIDDocumentVerification(idDocumentVerificationId: string): Promise<object>;
    /**
     * List the verification attempts. Results are paginated: pass `skip` (default 0) and
     * `limit` (default 10) on `params`.
     */
    listAttempts(idDocumentVerificationId: string, params?: object): Promise<object>;
    getAttempt(idDocumentVerificationId: string, attemptId: string): Promise<object>;
    /**
     * Get the assets (the front and back images of the document) uploaded for an attempt.
     * Results are paginated: pass `skip` (default 0) and `limit` (default 10) on `params`.
     */
    getAttemptAssets(idDocumentVerificationId: string, attemptId: string, params?: object): Promise<object>;
    createAttempt(idDocumentVerificationId: string, body: object): Promise<object>;
    anonymizeIDDocumentVerification(idDocumentVerificationId: string): Promise<object>;
    /**
     * Get the PDF report.
     *
     * Resolves to the JSON body, which carries `pdf_report`, the pre-signed URL to the PDF. The
     * 2026-09-02 spec renamed that property from `signed_url`. Declared `Promise<object>` and not
     * `Promise<Buffer>`: the implementation returns `response.json`, so the previous Buffer
     * signature never matched what a caller actually received.
     */
    getPDFReport(idDocumentVerificationId: string): Promise<object>;
}
