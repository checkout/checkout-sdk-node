import { ValueError } from './errors.js';

/**
 * Append params to a path as a query string.
 *
 * An empty params object returns the path unchanged rather than appending a bare "?". That matters
 * for the endpoints whose query is optional: before the 2026-09-02 pass the list-attempts
 * endpoints took no params at all, and a caller passing {} would otherwise start getting
 * ".../attempts?" instead of ".../attempts". A trailing question mark with no query carries no
 * information, so no caller loses anything.
 *
 * Note that a zero value is kept, so skip=0 is sent. That is deliberate: 0 is a meaningful value
 * for a pagination offset.
 *
 * @param {string} path The path to append to.
 * @param {Object} [params] The query parameters.
 * @return {string} The path, with a query string when there is one to add.
 */
export const buildQueryParams = (path, params) => {
    if (!params) {
        return path;
    }

    const queryString = Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    return queryString ? `${path}?${queryString}` : path;
};

/**
 * Encode a caller-supplied value as a single path segment.
 *
 * The value is converted to a string and encoded with encodeURIComponent, so characters such as
 * "/", "?", "#", "%" and "\" are percent-encoded. Values that encoding leaves unchanged and that
 * are not valid segments ("." and "..") are rejected, as are undefined and empty values.
 *
 * @param {*} value The value to place in the path, such as an id.
 * @param {string} name The parameter name, used in the error message.
 * @return {string} The encoded segment.
 * @throws {ValueError} If the value is undefined, empty, "." or "..".
 */
export const encodePathSegment = (value, name) => {
    const segment = value === undefined ? '' : String(value);

    if (segment === '' || segment === '.' || segment === '..') {
        throw new ValueError(`Invalid ${name}: must not be undefined, empty, "." or "..".`);
    }

    return encodeURIComponent(segment);
};
