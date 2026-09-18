import { determineError } from '../../services/errors.js';
import { get, post, put, _delete } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const INVENTORY_PATH = 'inventory';
const ADJUSTMENTS_PATH = 'adjustments';
const RESERVATIONS_PATH = 'reservations';
const COMMIT_PATH = 'commit';
const RELEASE_PATH = 'release';
const PRODUCT_PATH = 'product';

/**
 * Class dealing with the /inventory endpoints (Beta).
 *
 * Stock levels, atomic multi-variant reservations (hold/commit/release), stock
 * adjustments, and per-variant "product knowledge" (merchandising metadata for
 * AI agents). Added by swagger 2026-09-10.
 *
 * Every operation in this domain requires the OAuth scope `agentic:inventory`
 * (no `ApiSecretKey`/`ApiPublicKey` support), so the client must be built with
 * `client`/`secret`/`scope` (client-credentials OAuth), the same way the
 * `Issuing` domain is configured, not with a plain secret key. Once the client
 * is configured for OAuth the calling pattern is identical to every other
 * domain: `this.config.sk` resolves to the bearer access token internally.
 *
 * Every 2xx response also carries `Cko-Request-Id` and `Cko-Version` response
 * headers (surfaced by the shared http service on every call, nothing
 * domain-specific to do here).
 *
 * @export
 * @class Inventory
 */
export default class Inventory {
    constructor(config) {
        this.config = config;
    }

    /**
     * Adjust the on-hand stock for a variant by a signed delta, recording a reason
     * in the ledger.
     *
     * Request body fields (swagger `InventoryAdjustmentRequest`):
     *  - `variant_id` (string, [Required], max 128 chars) identifier of the
     *    variant to adjust, must already exist.
     *  - `delta` (integer, [Required]) signed change to `on_hand`; a negative
     *    delta that would drive `on_hand` below zero is rejected with 409.
     *  - `reason` (string, [Required], min 1, max 256 chars) free-text reason
     *    recorded in the ledger; must not contain personal data.
     *
     * Returns `201` on a fresh adjustment or `200` on an idempotent replay (with
     * a `Cache-Control` response header only on replay); both share the
     * `InventoryLevels` response shape. Errors (404/409/422) return an
     * `InventoryErrorResponse` body: `request_id`, `error_type`, `error_codes`
     * (array of `[subject]_[error]` strings), and, for `insufficient_stock`,
     * `variant_id` and `available`.
     *
     * @memberof Inventory
     * @param {Object} body InventoryAdjustmentRequest body.
     * @param {string} body.variant_id Variant identifier. [Required]
     * @param {number} body.delta Signed change to on_hand. [Required]
     * @param {string} body.reason Free-text reason for the ledger. [Required]
     * @param {string} [idempotencyKey] Optional `Cko-Idempotency-Key` header value.
     * @return {Promise<Object>} A promise to the InventoryLevels response.
     */
    async adjustInventory(body, idempotencyKey) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${INVENTORY_PATH}/${ADJUSTMENTS_PATH}`,
                this.config,
                this.config.sk,
                body,
                idempotencyKey
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Create an atomic multi-variant stock reservation ("hold").
     *
     * Request body fields (swagger `InventoryReservationRequest`):
     *  - `owner_type` (string, [Required], max 64 chars).
     *  - `owner_reference` (string, [Required], max 256 chars).
     *  - `items` (array<`InventoryReservationItem`>, [Required], 1 to 45
     *    items, `variant_id` unique within the request). Each item has
     *    `variant_id` (string, [Required], max 128 chars, must already exist)
     *    and `quantity` (integer, [Required], minimum 1).
     *  - `ttl_seconds` (integer, [Optional], minimum 60, maximum 3600, default
     *    900).
     *
     * Returns `201` on a fresh reservation or `200` on an idempotent replay
     * (with a `Cache-Control` response header only on replay); both share the
     * `InventoryReservation` response shape. Errors (404/409/422) return an
     * `InventoryErrorResponse` body, see {@link Inventory#adjustInventory}.
     *
     * @memberof Inventory
     * @param {Object} body InventoryReservationRequest body.
     * @param {string} body.owner_type Echoed back on the reservation. [Required]
     * @param {string} body.owner_reference Echoed back on the reservation. [Required]
     * @param {Array<Object>} body.items InventoryReservationItem entries. [Required]
     * @param {number} [body.ttl_seconds] Hold lifetime in seconds (60-3600, default 900).
     * @param {string} [idempotencyKey] Optional `Cko-Idempotency-Key` header value.
     * @return {Promise<Object>} A promise to the InventoryReservation response.
     */
    async createInventoryReservation(body, idempotencyKey) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${INVENTORY_PATH}/${RESERVATIONS_PATH}`,
                this.config,
                this.config.sk,
                body,
                idempotencyKey
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieve a stock reservation by id.
     *
     * Response (swagger `InventoryReservation`): `id` (`rsv_{base32 GUID}`),
     * `state` (`held`, `committed`, `released`, `expired`; a hold past
     * `expires_at` reports as `expired`), `owner_type`, `owner_reference`,
     * `items` (array<`InventoryReservationItem`>), `expires_at`, `created_on`,
     * and `_links` (`self`, plus `commit`/`release` only while `held`).
     *
     * @memberof Inventory
     * @param {string} id Reservation id.
     * @return {Promise<Object>} A promise to the InventoryReservation response.
     */
    async getInventoryReservation(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${INVENTORY_PATH}/${RESERVATIONS_PATH}/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Commit a held reservation, converting the hold into a permanent stock
     * deduction. Takes no request body.
     *
     * @memberof Inventory
     * @param {string} id Reservation id.
     * @return {Promise<Object>} A promise to the InventoryReservation response.
     */
    async commitInventoryReservation(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${INVENTORY_PATH}/${RESERVATIONS_PATH}/${id}/${COMMIT_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Release a held reservation, returning the reserved quantities to
     * available stock. Takes no request body.
     *
     * @memberof Inventory
     * @param {string} id Reservation id.
     * @return {Promise<Object>} A promise to the InventoryReservation response.
     */
    async releaseInventoryReservation(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${INVENTORY_PATH}/${RESERVATIONS_PATH}/${id}/${RELEASE_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieve stock levels for a variant.
     *
     * Response (swagger `InventoryLevels`): `variant_id`, `on_hand`, `reserved`
     * (sum of active holds), `safety_stock` (buffer withheld from sale),
     * `available` (`max(0, on_hand - reserved - safety_stock)`), `state`
     * (`in_stock`, `limited`, `out_of_stock`), `source` (`managed`, `sync`),
     * `created_on`, `modified_on`, `_links` (`self`, `set`), and, only when
     * `expand=product` was passed and product knowledge exists, an embedded
     * `product` (`InventoryProductKnowledge`).
     *
     * @memberof Inventory
     * @param {string} variantId Variant id (max 128 chars).
     * @param {Object} [options] Query options.
     * @param {string} [options.expand] Set to `'product'` to embed the variant's
     *   product knowledge in the response.
     * @return {Promise<Object>} A promise to the InventoryLevels response.
     */
    async getInventoryLevels(variantId, options) {
        try {
            const queryParams = [];
            if (options && options.expand) {
                queryParams.push(`expand=${encodeURIComponent(options.expand)}`);
            }
            const query = queryParams.length ? `?${queryParams.join('&')}` : '';

            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${INVENTORY_PATH}/${variantId}${query}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Create or update the stock levels for a variant.
     *
     * Request body fields (swagger `InventorySetLevelsRequest`):
     *  - `on_hand` (integer, [Required], minimum 0).
     *  - `safety_stock` (integer, [Optional], minimum 0; defaults to 0 on
     *    create, left unchanged on update if omitted).
     *  - `reason` (string, [Optional], max 256 chars, no personal data).
     *
     * @memberof Inventory
     * @param {string} variantId Variant id (max 128 chars).
     * @param {Object} body InventorySetLevelsRequest body.
     * @param {number} body.on_hand New on-hand stock. [Required]
     * @param {number} [body.safety_stock] Buffer withheld from sale.
     * @param {string} [body.reason] Free-text reason for the ledger.
     * @return {Promise<Object>} A promise to the InventoryLevels response.
     */
    async setInventoryLevels(variantId, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/${INVENTORY_PATH}/${variantId}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieve the "product knowledge" (merchandising metadata for AI agents)
     * for a variant. Beta.
     *
     * Response (swagger `InventoryProductKnowledge`), all fields optional
     * unless noted: `variant_id`, `title` [Required], `description` [Required],
     * `product_url` [Required], `image_url` [Required], `additional_image_urls`
     * (array<string>), `video_url`, `model_3d_url`, `sku`, `gtin`, `mpn`,
     * `brand`, `category`, `price`/`sale_price` (`InventoryMoney`:
     * `{ amount, currency }`), `sale_price_starts_at`/`sale_price_ends_at`,
     * `group_id`/`group_title`/`color`/`size` (spec text: `color` and `size`
     * are both required when `group_id` is set, not a formal constraint),
     * `size_system`, `gender`, `condition` (`new`, `used`, `refurbished`,
     * [Required], defaults `new`), `material`, `age_group`,
     * `length`/`width`/`height`/`dimension_unit`, `weight`/`weight_unit`,
     * `expiration_date`, `harmonized_system_code`,
     * `country_of_origin` (ISO 3166-1 alpha-2), `seller_name`, `seller_url`,
     * `seller_privacy_policy`, `seller_tos`, `created_on` [Required],
     * `modified_on` [Required], `_links` [Required] (`self`, `set`, `delete`).
     *
     * @memberof Inventory
     * @param {string} variantId Variant id (max 128 chars).
     * @return {Promise<Object>} A promise to the InventoryProductKnowledge response.
     */
    async getInventoryProduct(variantId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${INVENTORY_PATH}/${variantId}/${PRODUCT_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Create or replace the product knowledge for a variant. Beta.
     *
     * Request body (swagger `InventorySetProductRequest`), required:
     * `title` (max 512 chars), `description` (max 4000 chars), `product_url`
     * (max 2048 chars), `image_url` (max 2048 chars). Optional fields mirror
     * `InventoryProductKnowledge` (minus `variant_id`/`created_on`/
     * `modified_on`/`_links`), plus request-only constraints: `sku` (max 128
     * chars), `price`/`sale_price` (`InventoryMoney`; `sale_price` must share
     * `price`'s currency and be <= `price`), `condition` (`new`, `used`,
     * `refurbished`, exact lowercase match, default `new`).
     *
     * @memberof Inventory
     * @param {string} variantId Variant id (max 128 chars).
     * @param {Object} body InventorySetProductRequest body.
     * @param {string} body.title Product title. [Required] max 512 chars.
     * @param {string} body.description Product description. [Required] max 4000 chars.
     * @param {string} body.product_url Product page URL. [Required] max 2048 chars.
     * @param {string} body.image_url Product image URL. [Required] max 2048 chars.
     * @return {Promise<Object>} A promise to the InventoryProductKnowledge response.
     */
    async setInventoryProduct(variantId, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/${INVENTORY_PATH}/${variantId}/${PRODUCT_PATH}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Delete the product knowledge for a variant. Beta. Returns `204` with no
     * body.
     *
     * @memberof Inventory
     * @param {string} variantId Variant id (max 128 chars).
     * @return {Promise<Object>} A promise that resolves to an empty object on success.
     */
    async deleteInventoryProduct(variantId) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.host}/${INVENTORY_PATH}/${variantId}/${PRODUCT_PATH}`,
                this.config,
                this.config.sk
            );
            if (response.status === 204) {
                return {};
            }
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
