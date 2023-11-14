/**
 * Error raised for pre-api value validation
 *
 * @export
 * @class ApiTimeout
 * @extends {Error}
 */
export class ApiTimeout extends Error {
    constructor();
    http_code: number;
}
/**
 * AuthenticationError
 *
 * @export
 * @class AuthenticationError
 * @extends {Error}
 */
export class AuthenticationError extends Error {
    constructor(message: any);
    http_code: number;
}
/**
 * ActionNotAllowed
 *
 * @export
 * @class ActionNotAllowed
 * @extends {Error}
 */
export class ActionNotAllowed extends Error {
    http_code: number;
}
/**
 * UrlAlreadyRegistered
 *
 * @export
 * @class UrlAlreadyRegistered
 * @extends {Error}
 */
export class UrlAlreadyRegistered extends Error {
    http_code: number;
}
/**
 * NotFoundError
 *
 * @export
 * @class NotFoundError
 * @extends {Error}
 */
export class NotFoundError extends Error {
    http_code: number;
}
/**
 * UnprocessableError
 *
 * @export
 * @class UnprocessableError
 * @extends {Error}
 */
/**
 * ValidationError
 *
 * @export
 * @class ValidationError
 * @extends {Error}
 */
export class ErrorWithBody extends Error {
    constructor(http_code: any, error: any, message: any);
    name: any;
    http_code: any;
    body: any;
}
/**
 * ValidationError
 *
 * @export
 * @class ValidationError
 * @extends {Error}
 */
export class ValidationError extends Error {
    constructor(error: any, message?: string);
}
/**
 * TooManyRequestsError
 *
 * @export
 * @class TooManyRequestsError
 * @extends {Error}
 */
export class TooManyRequestsError extends Error {
    constructor(error: any, message?: string);
}
/**
 * BadGateway
 *
 * @export
 * @class BadGateway
 * @extends {Error}
 */
export class BadGateway extends Error {
    constructor();
    http_code: number;
}
/**
 * ApiError
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class ApiError extends Error {
    constructor(http_code: any, message: any);
    http_code: any;
    body: any;
}
/**
 * ValueError
 *
 * @export
 * @class ValueError
 * @extends {Error}
 */
export class ValueError extends Error {
    constructor(message: any);
    body: any;
}
export function determineError(err: any): Promise<ApiTimeout | AuthenticationError | ActionNotAllowed | UrlAlreadyRegistered | NotFoundError | ValidationError | TooManyRequestsError | BadGateway | ApiError>;
//# sourceMappingURL=errors.d.ts.map