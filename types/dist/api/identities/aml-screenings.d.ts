import { config } from '../../Checkout';

export default class AMLScreenings {
    constructor(config: config);

    createAMLVerification(body: object): Promise<object>;
    getAMLScreening(amlScreeningId: string): Promise<object>;
}
