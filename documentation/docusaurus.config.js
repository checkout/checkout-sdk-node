const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'checkout-sdk-node',
    tagline: 'Checkout.com SDK for Node JS',
    url: 'https://ioan-ghisoi-cko.github.io',
    baseUrl: '/checkout-sdk-node/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.png',
    organizationName: 'checkout',
    projectName: 'checkout-sdk-node',
    scripts: ['https://embed.runkit.com'],
    themeConfig: {
        navbar: {
            title: 'checkout-sdk-node',
            logo: {
                alt: 'checkout-sdk-node',
                src: 'img/logo.png',
            },
            items: [
                {
                    type: 'doc',
                    docId: 'intro',
                    position: 'right',
                    label: 'Docs',
                },
                {
                    to: 'playground',
                    activeBasePath: 'playground',
                    label: 'Playground',
                    position: 'right',
                },
                {
                    href: 'https://github.com/checkout/checkout-sdk-node',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            copyright: `© ${new Date().getFullYear()} Checkout.com    `,
        },
        googleAnalytics: {
            trackingID: 'UA-165971486-1',
        },
        prism: {
            theme: lightCodeTheme,
            darkTheme: darkCodeTheme,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    routeBasePath: '/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
    plugins: [
        [
            require.resolve('@docusaurus/plugin-google-analytics'),
            {
                id: 'plugin-xxx-1',
            },
        ],
    ],
};
