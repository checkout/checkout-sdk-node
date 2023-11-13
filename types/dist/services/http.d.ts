export function get(fetch: any, path: any, config: any, auth: any): Promise<any>;
export function post(fetch: any, path: any, config: any, auth: any, request: any, idempotencyKey: any): Promise<any>;
export function patch(fetch: any, path: any, config: any, auth: any, request: any): Promise<any>;
export function put(fetch: any, path: any, config: any, auth: any, request: any): Promise<any>;
export function _delete(fetch: any, path: any, config: any, auth: any): Promise<any>;
export function createAccessToken(config: any, fetch: any, body: any): Promise<any>;
export default createAccessToken;