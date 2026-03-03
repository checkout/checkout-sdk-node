import { config } from '../../Checkout';

export default class FaceAuthentications {
    constructor(config: config);

    createFaceAuthentication(body: object): Promise<object>;
    getFaceAuthentication(faceAuthenticationId: string): Promise<object>;
    listAttempts(faceAuthenticationId: string): Promise<object>;
    getAttempt(faceAuthenticationId: string, attemptId: string): Promise<object>;
    createAttempt(faceAuthenticationId: string, body: object): Promise<object>;
    anonymizeFaceAuthentication(faceAuthenticationId: string): Promise<object>;
}
