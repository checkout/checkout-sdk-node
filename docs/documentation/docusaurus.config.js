module.exports = {
    title: 'checkout-sdk-node',
    tagline: 'Checkout.com SDK for Node JS',
    url: 'https://checkout.github.io',
    baseUrl: '/checkout-sdk-node/',
    favicon: 'img/favicon.png',
    organizationName: 'checkout', // Usually your GitHub org/user name.
    projectName: 'checkout-sdk-node', // Usually your repo name.
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
                    to: 'getting_started',
                    activeBasePath: 'docs',
                    label: 'Docs',
                    position: 'right',
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
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    routeBasePath: '/',
                    // editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/'
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
