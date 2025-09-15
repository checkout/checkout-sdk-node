/* eslint-disable camelcase */
/* eslint-disable max-classes-per-file */
/**
 * Error raised for pre-api value validation
 *
 * @export
 * @class ApiTimeout
 * @extends {Error}
 */
export class ApiTimeout extends Error {
    constructor() {
        super('ApiTimeout');
        Object.setPrototypeOf(this, new.target.prototype);
        this.http_code = 408;
        this.name = 'ApiTimeout';
    }
}

/**
 * AuthenticationError
 *
 * @export
 * @class AuthenticationError
 * @extends {Error}
 */
export class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.http_code = 401;
        this.name = 'AuthenticationError';
    }
}

/**
 * ActionNotAllowed
 *
 * @export
 * @class ActionNotAllowed
 * @extends {Error}
 */
export class ActionNotAllowed extends Error {
    constructor(message = 'ActionNotAllowed') {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.http_code = 403;
        this.name = 'ActionNotAllowed';
    }
}

/**
 * UrlAlreadyRegistered
 *
 * @export
 * @class UrlAlreadyRegistered
 * @extends {Error}
 */
export class UrlAlreadyRegistered extends Error {
    constructor(error, message = 'UrlAlreadyRegistered') {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.http_code = 409;
        this.name = 'UrlAlreadyRegistered';
        this.body = error;
    }
}

/**
 * NotFoundError
 *
 * @export
 * @class NotFoundError
 * @extends {Error}
 */
export class NotFoundError extends Error {
    constructor(message = 'NotFoundError') {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.http_code = 404;
        this.name = 'NotFoundError';
    }
}

/**
 * ValidationError
 *
 * @export
 * @class ValidationError
 * @extends {Error}
 */
export class ErrorWithBody extends Error {
    constructor(http_code, error, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = message;
        this.http_code = http_code;
        this.body = error;
    }
}

/**
 * ValidationError
 *
 * @export
 * @class ValidationError
 * @extends {ErrorWithBody}
 */
export class ValidationError extends ErrorWithBody {
    constructor(error, message = 'ValidationError') {
        super(422, error, message);
    }
}

/**
 * TooManyRequestsError
 *
 * @export
 * @class TooManyRequestsError
 * @extends {ErrorWithBody}
 */
export class TooManyRequestsError extends ErrorWithBody {
    constructor(error, message = 'TooManyRequestsError') {
        super(429, error, message);
    }
}

/**
 * BadGateway
 *
 * @export
 * @class BadGateway
 * @extends {Error}
 */
export class BadGateway extends Error {
    constructor() {
        super('Bad gateway');
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'Bad gateway';
        this.http_code = 502;
    }
}

/**
 * ApiError
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class ApiError extends Error {
    constructor(http_code, message) {
        super('API Error');
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'API Error';
        this.http_code = http_code;
        this.body = message;
    }
}

/**
 * ValueError
 *
 * @export
 * @class ValueError
 * @extends {Error}
 */
export class ValueError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'ValueError';
        this.body = message;
    }
}

export const determineError = async (err) => {
    // Fot time outs
    if (err.type === 'request-timeout') {
        return new ApiTimeout();
    }

    if (err instanceof ValueError) {
        throw err;
    }

    // For 'no body' response, replace with empty object
    let errorJSON = err.json !== undefined ? err.json : {};

    if (Object.keys(errorJSON).length > 0 && errorJSON.code === 'ECONNABORTED') {
        return new ApiTimeout();
    }

    if (Object.keys(errorJSON).length === 0 && err.message) {
        errorJSON = err.message;
    }

    switch (err.status) {
        case 401:
            return new AuthenticationError();
        case 404:
            return new NotFoundError();
        case 403:
            return new ActionNotAllowed();
        case 409:
            return new UrlAlreadyRegistered(await errorJSON);
        case 422:
            return new ValidationError(await errorJSON);
        case 429:
            return new TooManyRequestsError(await errorJSON);
        case 502:
            return new BadGateway();
        default: {
            return new ApiError(err.status, await errorJSON);
        }
    }
};
