module.exports = {
    title: 'checkout-sdk-node',
    tagline: 'Checkout.com SDK for Node JS',
    url: 'https://checkout.github.io',
    baseUrl: 'https://checkout.github.io/',
    favicon: 'img/favicon.png',
    organizationName: 'checkout', // Usually your GitHub org/user name.
    projectName: 'checkout-sdk-node', // Usually your repo name.
    themeConfig: {
        navbar: {
            title: 'checkout-sdk-node',
            logo: {
                alt: 'checkout-sdk-node',
                src: 'img/logo.png'
            },
            links: [
                {
                    to: 'docs/getting_started',
                    activeBasePath: 'docs',
                    label: 'Docs',
                    position: 'right'
                },
                {
                    href: 'https://github.com/checkout/checkout-sdk-node',
                    label: 'GitHub',
                    position: 'right'
                }
            ]
        },
        footer: {
            style: 'dark',
            copyright: `Copyright © ${new Date().getFullYear()} Checkout LDT    .`
        }
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    routeBasePath: ''
                    // editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/'
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css')
                }
            }
        ]
    ]
};
