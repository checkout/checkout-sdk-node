import { config } from '../../Checkout';

export default class Reports {
    constructor(config: config);

    getAllReports: (parameters: Object) => Promise<Object>;
    getReportDetails: (id: string) => Promise<Object>;
    getReportFile: (id: string, fileId: string) => Promise<Object>;
}
