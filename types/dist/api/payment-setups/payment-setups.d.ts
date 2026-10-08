import { config } from '../../Checkout';

/** The payment method status (PaymentMethodStatus). */
export type PaymentSetupPaymentMethodStatus =
    | 'unavailable'
    | 'action_required'
    | 'ready'
    | 'initialization_required'
    | 'invalid';

/** The initialization state of a payment method (PaymentMethodInitialization). Default "disabled". */
export type PaymentSetupPaymentMethodInitialization = 'disabled' | 'enabled';

/** The type of client the customer uses to initiate the payment. Required when using Cash App Pay. */
export type PaymentSetupDeviceClient = 'web' | 'mobile_web' | 'app';

/** The operating system of the customer's device. */
export type PaymentSetupDeviceOs = 'android' | 'ios';

/** Details of the customer's device (PaymentSetup.customer.device). */
export type PaymentSetupCustomerDevice = {
    /** The locale of the device. */
    locale?: string;
    /** A unique identifier for the customer's device. */
    fingerprint?: string;
    /** The customer's device IPv4 address, used by some payment methods for risk and eligibility checks. */
    ipv4?: string;
    /** The customer's device IPv6 address, used by some payment methods for risk and eligibility checks. */
    ipv6?: string;
    /** The type of client the customer uses to initiate the payment. Required when using Cash App Pay. */
    client?: PaymentSetupDeviceClient;
    /** The operating system of the customer's device. */
    os?: PaymentSetupDeviceOs;
};

/** Details of the customer's email (PaymentSetup.customer.email). */
export type PaymentSetupCustomerEmail = {
    /** The customer's email address. */
    address?: string;
    /** Specifies whether the customer's email address is verified. */
    verified?: boolean;
};

/** The customer's phone number (PaymentSetupPhone). */
export type PaymentSetupPhone = {
    /** The international country calling code. min 1 character, max 7 characters. */
    country_code?: string;
    /** The phone number. min 6 characters, max 25 characters. */
    number?: string;
};

/** Details of the account the customer holds with the merchant (PaymentSetupMerchantAccount). */
export type PaymentSetupMerchantAccount = {
    /** The merchant's unique identifier for the customer's account. */
    id?: string;
    /** The date the customer registered their account with the merchant. Format: date. */
    registration_date?: string;
    /** The date the customer's account with the merchant was last modified. Format: date. */
    last_modified?: string;
    /** Specifies if the customer is a returning customer. */
    returning_customer?: boolean;
    /** The date of the customer's first transaction. Format: date. */
    first_transaction_date?: string;
    /** The date of the customer's most recent transaction. Format: date. */
    last_transaction_date?: string;
    /** The total number of orders made by the customer. */
    total_order_count?: number;
    /** The payment amount of the customer's most recent transaction. */
    last_payment_amount?: number;
};

/** The customer's details (PaymentSetup.customer). */
export type PaymentSetupCustomer = {
    /** The unique identifier of the customer. */
    id?: string;
    /** The two-letter ISO country code of the customer for this payment. min 2, max 2 characters. */
    country?: string;
    /** Details of the customer's email. */
    email?: PaymentSetupCustomerEmail;
    /** The customer's full name. max 100 characters. */
    name?: string;
    /** The customer's tax identification number. */
    tax_number?: string;
    /** The customer's phone number. */
    phone?: PaymentSetupPhone;
    /** Details of the customer's device. */
    device?: PaymentSetupCustomerDevice;
    /** Details of the account the customer holds with the merchant. */
    merchant_account?: PaymentSetupMerchantAccount;
};

/** The next available action for the Cash App payment method. Response only. */
export type CashAppAction = {
    /** The type of action. */
    type?: 'redirect';
    /** The URL to redirect the customer to so they can authorize the payment with Cash App. Format: uri. */
    redirect_url?: string;
};

/** The customer's address in their Cash App profile. Cash App's key names, not the Checkout.com address. */
export type CashAppAddress = {
    address_line_1?: string;
    address_line_2?: string;
    address_line_3?: string;
    /** The address locality, such as the city or town. */
    locality?: string;
    /** The address sublocality, such as the district or neighborhood. */
    sublocality?: string;
    /** The address's top-level administrative district, such as the state or province. */
    administrative_district_level_1?: string;
    /** The postal or zip code. */
    postal_code?: string;
    /** The address country, in ISO 3166-1 alpha-2 format. max 2 characters. */
    country?: string;
};

/**
 * The customer's Cash App profile that they consented to share. Response only. Cash App releases it
 * only once: it is present in the first successful response when you get the Payment Setup after the
 * customer authorizes the payment, and every subsequent response omits it.
 */
export type CashAppCustomerProfile = {
    /** Cash App's identifier for the customer. This is not a Checkout.com customer identifier. */
    customer_id?: string;
    /** The customer's $Cashtag. */
    cashtag?: string;
    /** Cash App's reference for the customer profile. */
    reference_id?: string;
    full_name?: string;
    given_name?: string;
    middle_name?: string;
    family_name?: string;
    suffix?: string;
    /** The customer's date of birth. Format: date (returned as a string; the provider's format varies). */
    birth_date?: string;
    address?: CashAppAddress;
    phone_number?: string;
    email_address?: string;
    /** The date and time the customer's Cash App account was created. Format: date-time (string). */
    customer_since?: string;
};

/** The Cash App Pay payment method (CashApp). Sent under payment_methods.cashapp. */
export type CashApp = {
    /** The payment method status. Response only. */
    status?: PaymentSetupPaymentMethodStatus;
    /** The list of error codes or indicators that highlight missing or invalid information. Response only. */
    flags?: string[];
    /** The initialization state of the payment method. Default "disabled". */
    initialization?: PaymentSetupPaymentMethodInitialization;
    /** Indicates whether the customer consents to share their Cash App customer profile with Checkout.com. */
    customer_profile_sharing?: boolean;
    /** The customer's Cash App profile. Response only, released once. */
    customer_profile?: CashAppCustomerProfile;
    /** A reference for the Cash App Pay transaction, returned by the provider. Response only. max 80 characters. */
    reference?: string;
    /** The next available action for the payment method. Response only. */
    action?: CashAppAction;
};

/** The payment methods of a Payment Setup. Only cashapp is typed here; other methods pass through. */
export type PaymentSetupPaymentMethods = {
    cashapp?: CashApp;
    [paymentMethod: string]: unknown;
};

/**
 * POST /payments/setups and PUT /payments/setups/{id} request body (PaymentSetup). Only the
 * fields below are typed; every other PaymentSetup property is accepted as is.
 */
export type PaymentSetupRequest = {
    /** The processing channel to use for the payment. Required on create. */
    processing_channel_id?: string;
    /** The payment amount, in the minor currency unit. Required on create. */
    amount?: number;
    /** The currency of the payment, as a three-letter ISO currency code. Required on create. */
    currency?: string;
    payment_methods?: PaymentSetupPaymentMethods;
    customer?: PaymentSetupCustomer;
    [property: string]: unknown;
};

/** The Payment Setup returned by create, update, get and confirm (PaymentSetup, 200). */
export type PaymentSetupResponse = {
    id?: string;
    processing_channel_id?: string;
    amount?: number;
    currency?: string;
    available_payment_methods?: string[];
    payment_methods?: PaymentSetupPaymentMethods;
    customer?: PaymentSetupCustomer;
    [property: string]: unknown;
};

export default class PaymentSetups {
    constructor(config: config);

    createAPaymentSetup: (body: PaymentSetupRequest) => Promise<PaymentSetupResponse>;
    updateAPaymentSetup: (id: string, body: PaymentSetupRequest) => Promise<PaymentSetupResponse>;
    getAPaymentSetup: (id: string) => Promise<PaymentSetupResponse>;
    confirmAPaymentSetup: (id: string, payment_method_name: string) => Promise<PaymentSetupResponse>;
}
