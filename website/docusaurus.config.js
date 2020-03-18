module.exports = {
  title: 'Bridge Protocol',
  tagline: 'Identity Secured',
  url: 'https://github.com/bridge-protocol',
  baseUrl: '/',
  favicon: 'img/bridge-token.png',
  organizationName: 'bridge-protocol', // Usually your GitHub org/user name.
  projectName: 'bridgeprotocol.github.io', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'Bridge Protocol',
        src: 'img/bridge-token.png',
      },
      links: [
        {
          to: 'docs/bridge-overview',
          activeBasePath: 'docs',
          label: 'SDK Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/bridge-protocol/bridge-passport-browser-extension/blob/master/docs/Bridge%20Passport%20Browser%20Extension%20v2.0%20User%20Guide%20and%20Feature%20Overview%20-%20Google%20Docs.pdf',
          label: 'Browser Extension Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/bridge-protocol',
          label: 'GitHub',
          position: 'left',
        },
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
          path: '../docs'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
