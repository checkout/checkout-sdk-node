import { config } from '../../Checkout';

export default class AddressDocumentVerifications {
    constructor(config: config);

    createAddressDocumentVerification(body: object): Promise<object>;
    getAddressDocumentVerification(addressDocumentVerificationId: string): Promise<object>;
    /**
     * List the verification attempts. Results are paginated: pass `skip` and `limit` on `params`.
     */
    listAttempts(addressDocumentVerificationId: string, params?: object): Promise<object>;
    getAttempt(addressDocumentVerificationId: string, attemptId: string): Promise<object>;
    /**
     * Get the assets (the document image) uploaded for an attempt. Results are paginated: pass
     * `skip` and `limit` on `params`.
     */
    getAttemptAssets(addressDocumentVerificationId: string, attemptId: string, params?: object): Promise<object>;
    createAttempt(addressDocumentVerificationId: string, body: object): Promise<object>;
    anonymizeAddressDocumentVerification(addressDocumentVerificationId: string): Promise<object>;
    /**
     * Get the PDF report.
     *
     * Resolves to the JSON body, which carries `pdf_report`, the pre-signed URL to the PDF. The
     * 2026-09-02 spec renamed that property from `signed_url`. Declared `Promise<object>` and not
     * `Promise<Buffer>`: the implementation returns `response.json`, so the previous Buffer
     * signature never matched what a caller actually received.
     */
    getPDFReport(addressDocumentVerificationId: string): Promise<object>;
}
