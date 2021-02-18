module.exports = {
    title: 'action-test',
    tagline: 'Checkout.com SDK for Node JS',
    url: 'https://ioan-ghisoi-cko.github.io',
    baseUrl: '/action-test/',
    favicon: 'img/favicon.png',
    organizationName: 'checkout', // Usually your GitHub org/user name.
    projectName: 'action-test', // Usually your repo name.
    scripts: ['https://embed.runkit.com'],
    themeConfig: {
        navbar: {
            title: 'action-test',
            logo: {
                alt: 'action-test',
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
                    href: 'https://github.com/checkout/action-test',
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
