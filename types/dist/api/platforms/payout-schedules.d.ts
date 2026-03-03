import {config} from '../../Checkout';

export default class PayoutSchedules {
    constructor(config: config);

    retrieveSubEntityPayoutSchedule: (id: string) => Promise<Object>;
    updateSubEntityPayoutSchedule: (id: string, body: Object) => Promise<Object>;
}
