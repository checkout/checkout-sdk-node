import { config } from '../../Checkout';

export default class Inventory {
    constructor(config: config);

    adjustInventory: (body: Object, idempotencyKey?: string) => Promise<Object>;
    createInventoryReservation: (body: Object, idempotencyKey?: string) => Promise<Object>;
    getInventoryReservation: (id: string) => Promise<Object>;
    commitInventoryReservation: (id: string) => Promise<Object>;
    releaseInventoryReservation: (id: string) => Promise<Object>;
    getInventoryLevels: (variantId: string, options?: { expand?: string }) => Promise<Object>;
    setInventoryLevels: (variantId: string, body: Object) => Promise<Object>;
    getInventoryProduct: (variantId: string) => Promise<Object>;
    setInventoryProduct: (variantId: string, body: Object) => Promise<Object>;
    deleteInventoryProduct: (variantId: string) => Promise<Object>;
}
