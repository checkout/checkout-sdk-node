import React, { useState } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
const Embed = require('react-runkit');

function Playground() {
    const SCHEMES = {
        Visa: useBaseUrl('img/visa.png'),
        Mastercard: useBaseUrl('img/mastercard.png'),
        'American Express': useBaseUrl('img/amex.png'),
        Discover: useBaseUrl('img/discover.png'),
        JCB: useBaseUrl('img/jcb.png'),
        'Diners Club': useBaseUrl('img/dinersclub.png'),
        Maestro: useBaseUrl('img/maestro.png')
    };

    const [icon, setIcon] = useState(undefined);
    const [token, setToken] = useState('');
    const helloSource = `const { Checkout } = require('checkout-sdk-node');

/** For this example please do not change this key.*/
const cko = new Checkout('sk_test_3e1ad21b-ac23-4eb3-ad1f-375e9fb56481');

(async () => {
    const transaction = await cko.payments.request({
        source: {
            token: 'put_the_token_here',
        },
        currency: 'USD',
        amount: 100
    });

    console.log(transaction);
})();

    `;

    return (
        <Layout title="Playground">
            <div className="demo-container">
                <div className="front-end-section">
                    <iframe
                        width="80%"
                        height="410"
                        src="//jsfiddle.net/johnnyshrewd/3r65hLs9/18/embedded/result,html,js,css/dark/"
                        allowFullscreen="allowfullscreen"
                        allowPaymentRequest
                        frameborder="0"
                    ></iframe>
                </div>
                <div className="back-end-section">
                    <Embed source={helloSource} title="checkout-sdk-node" />
                </div>
            </div>
        </Layout>
    );
}

export default Playground;
