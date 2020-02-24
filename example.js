const { Checkout } = require('checkout-sdk-node');

/** Go to checkout.com and sign up for a test account to get your own key.*/
const cko = new Checkout('sk_test_3e1ad21b-ac23-4eb3-ad1f-375e9fb56481');

/**
 * Keep in mind that requests with raw card details
 * requre a high level of PCI Compliance.
 */
(async () => {
    const transaction = await cko.payments.request({
        source: {
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100'
        },
        currency: 'USD',
        amount: 100
    });

    console.log(transaction.status);
})();
