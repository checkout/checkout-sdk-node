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
        this.name = ApiTimeout.name;
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
        AuthenticationError.http_code = 401;
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = AuthenticationError.name;
    }
}

/**
 * ActionNotAllowed
 *
 * @export
 * @class AuthenticationError
 * @extends {Error}
 */
export class ActionNotAllowed extends Error {
    constructor(message = 'ActionNotAllowed') {
        ActionNotAllowed.http_code = 403;
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ActionNotAllowed.name;
    }
}

/**
 * UrlAlreadyRegistered
 *
 * @export
 * @class UrlAlreadyRegistered
 * @extends {Error}
 */
// export class UrlAlreadyRegistered extends Error {
//     constructor(message = 'UrlAlreadyRegistered') {
//         UrlAlreadyRegistered.http_code = 409;
//         super(message);
//         Object.setPrototypeOf(this, new.target.prototype);
//         this.name = UrlAlreadyRegistered.name;
//     }
// }

/**
 * NotFoundError
 *
 * @export
 * @class AuthenticationError
 * @extends {Error}
 */
export class NotFoundError extends Error {
    constructor(message = 'NotFoundError') {
        NotFoundError.http_code = 404;
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = NotFoundError.name;
    }
}

/**
 * UnprocessableError
 *
 * @export
 * @class UnprocessableError
 * @extends {Error}
 */
// export class UnprocessableError extends Error {
//     constructor(message = 'UnprocessableError') {
//         UnprocessableError.http_code = 400;
//         super(message);
//         Object.setPrototypeOf(this, new.target.prototype);
//         this.name = UnprocessableError.name;
//     }
// }

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
        ErrorWithBody.http_code = http_code;
        this.body = error;
    }
}

/**
 * ValidationError
 *
 * @export
 * @class ValidationError
 * @extends {Error}
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
 * @extends {Error}
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
        BadGateway.http_code = 502;
        Object.setPrototypeOf(this, new.target.prototype);
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
    constructor(error) {
        super('API Error');
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'API Error';
        this.body = error;
    }
}

/**
 * AuthenticationError
 *
 * @export
 * @class ValueError
 * @extends {Error}
 */
export class ValueError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ValueError.name;
        this.body = message;
    }
}

export const determineError = async err => {
    // Fot time outs
    if (err.type === 'request-timeout') {
        return new ApiTimeout();
    }

    if (err instanceof ValueError) {
        throw err;
    }

    // For 'no body' response, replace with empty object
    const errorJSON =
        err.json !== undefined
            ? await err.json.then(data => {
                  return data;
              })
            : {};

    switch (err.status) {
        case 401:
            return new AuthenticationError();
        case 404:
            return new NotFoundError();
        case 403:
            return new ActionNotAllowed();
        case 422:
            return new ValidationError(await errorJSON);
        case 429:
            return new TooManyRequestsError(await errorJSON);
        case 502:
            return new BadGateway();
        default:
            return new ApiError(await errorJSON);
    }
};
