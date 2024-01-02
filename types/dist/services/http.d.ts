export function get(httpClient: any, path: any, config: any, auth: any): Promise<any>;
export function post(httpClient: any, path: any, config: any, auth: any, request: any, idempotencyKey: any): Promise<any>;
export function patch(httpClient: any, path: any, config: any, auth: any, request: any): Promise<any>;
export function put(httpClient: any, path: any, config: any, auth: any, request: any): Promise<any>;
export function _delete(httpClient: any, path: any, config: any, auth: any): Promise<any>;
export function createAccessToken(config: any, httpClient: any, body: any): Promise<any>;
export default createAccessToken;