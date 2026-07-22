/**
 * Build a request config carrying the Accounts API schema-version Accept header.
 *
 * The /accounts/entities operations negotiate the payload schema version through the Accept header
 * (the latest version is 3.0). Internal helper shared by the sub-entity and entity-requirements
 * clients; not part of the SDK's public API.
 *
 * @param {Object} config The base request config.
 * @param {string} [schemaVersion='3.0'] Schema version to request (1.0, 2.0, or 3.0).
 * @return {Object} A copy of the config with the schema-version Accept header applied.
 */
export function getConfigWithAcceptHeader(config, schemaVersion = '3.0') {
    return {
        ...config,
        headers: {
            ...(config.headers || {}),
            Accept: `application/json;schema_version=${schemaVersion}`
        }
    };
}
