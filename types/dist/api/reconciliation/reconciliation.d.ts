import { config } from '../../Checkout';
export default class Reconciliation {
    constructor(config: config);

    getPayments: (body: Object) => Promise<Object>;
    getPayment: (paymentId: String) => Promise<Object>;
    getPaymentsCsv: (body: Object) => Promise<Object>;
    getStatements: (body: Object) => Promise<Object>;
    getStatementCsv: (statementId: String) => Promise<Object>;
    getPaymentsActions: (body: Object) => Promise<Object>;
    getPaymentsAction: (actionId: String) => Promise<Object>;
    getPaymentsActionsCsv: (body: Object) => Promise<Object>;
    getAction: (actionId: String) => Promise<Object>;
}
