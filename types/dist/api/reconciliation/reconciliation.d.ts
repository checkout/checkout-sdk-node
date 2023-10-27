import { config } from '../../Checkout';

export default class Reconciliation {
    constructor(config: config);

    getPayments: (body: Object) => Promise<Object>;
    getPayment: (paymentId: string) => Promise<Object>;
    getPaymentsCsv: (body: Object) => Promise<Object>;
    getStatements: (body: Object) => Promise<Object>;
    getStatementCsv: (statementId: string) => Promise<Object>;
    getPaymentsActions: (body: Object) => Promise<Object>;
    getPaymentsAction: (actionId: string) => Promise<Object>;
    getPaymentsActionsCsv: (body: Object) => Promise<Object>;
    getAction: (actionId: string) => Promise<Object>;
}
