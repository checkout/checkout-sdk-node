import { config } from '../../Checkout';

export default class FaceAuthentications {
    constructor(config: config);

    createFaceAuthentication(body: object): Promise<object>;
    getFaceAuthentication(faceAuthenticationId: string): Promise<object>;
    /**
     * List the authentication attempts. Results are paginated: pass `skip` (default 0) and
     * `limit` (default 10) on `params`.
     */
    listAttempts(faceAuthenticationId: string, params?: object): Promise<object>;
    getAttempt(faceAuthenticationId: string, attemptId: string): Promise<object>;
    getAttemptAssets(faceAuthenticationId: string, attemptId: string, params?: object): Promise<object>;
    createAttempt(faceAuthenticationId: string, body: object): Promise<object>;
    anonymizeFaceAuthentication(faceAuthenticationId: string): Promise<object>;
}
