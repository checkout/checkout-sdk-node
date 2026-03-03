import { config } from '../../Checkout';

export default class Transactions {
    constructor(config: config);

    getTransactions(params?: object): Promise<object>;
    getTransactionById(transactionId: string): Promise<object>;
}
