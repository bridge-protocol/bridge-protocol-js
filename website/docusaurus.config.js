module.exports = {
  title: 'Bridge Protocol',
  tagline: 'Identity Secured',
  url: 'https://',
  baseUrl: '/',
  favicon: 'img/bridge-token.png',
  organizationName: 'bridge-protoccol', // Usually your GitHub org/user name.
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
          label: 'Docs',
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
