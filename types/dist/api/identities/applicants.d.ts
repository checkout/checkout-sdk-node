import { config } from '../../Checkout';

export default class Applicants {
    constructor(config: config);

    createApplicant(body: object): Promise<object>;
    getApplicant(applicantId: string): Promise<object>;
    updateApplicant(applicantId: string, body: object): Promise<object>;
    anonymizeApplicant(applicantId: string): Promise<object>;
}
