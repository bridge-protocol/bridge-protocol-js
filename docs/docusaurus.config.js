module.exports = {
  title: 'Bridge Protocol',
  tagline: 'Identity Secured',
  url: 'https://github.com/bridge-protocol',
  baseUrl: '/',
  favicon: 'img/bridge-token.png',
  organizationName: 'bridge-protocol', // Usually your GitHub org/user name.
  projectName: 'bridgeprotocol.github.io', // Usually your repo name.
  themeConfig: {
    defaultDarkMode: true,
    navbar: {
      title: '',
      logo: {
        alt: 'Bridge Protocol',
        src: 'img/bridge-white.png',
      },
      links: [
        {
          to: 'docs/bridge-overview',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/bridge-protocol',
          label: 'GitHub',
          position: 'left',
        },
        {
          href: 'https://explorer.bridgeprotocol.io',
          label: 'Network Explorer',
          position: 'left',
        },
        {
          href: 'https://chrome.google.com/webstore/detail/bridge-passport/opoooeghbadjpnklfhcodnnobakaminp',
          label: 'Browser Extension',
          position: 'left',
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Bridge Procotol Corporation.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          path: './docs'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
