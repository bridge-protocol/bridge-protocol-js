export default {
  "plugins": [],
  "themes": [],
  "customFields": {},
  "themeConfig": {
    "defaultDarkMode": true,
    "navbar": {
      "title": "",
      "logo": {
        "alt": "Bridge Protocol",
        "src": "img/bridge-white.png"
      },
      "links": [
        {
          "to": "docs/bridge-overview",
          "activeBasePath": "docs",
          "label": "Docs",
          "position": "left"
        },
        {
          "href": "https://github.com/bridge-protocol",
          "label": "GitHub",
          "position": "left"
        },
        {
          "href": "https://explorer.bridgeprotocol.io",
          "label": "Network Explorer",
          "position": "left"
        },
        {
          "href": "https://chrome.google.com/webstore/detail/bridge-passport/opoooeghbadjpnklfhcodnnobakaminp",
          "label": "Browser Extension",
          "position": "left"
        }
      ]
    },
    "footer": {
      "style": "dark",
      "links": [],
      "copyright": "Copyright © 2020 Bridge Procotol Corporation."
    }
  },
  "title": "Bridge Protocol",
  "tagline": "Identity Secured",
  "url": "https://github.com/bridge-protocol",
  "baseUrl": "/",
  "favicon": "img/bridge-token.png",
  "organizationName": "bridge-protocol",
  "projectName": "bridgeprotocol.github.io",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "sidebarPath": "C:\\Workspaces\\Bridge\\bridge-protocol-js\\docs\\sidebars.js",
          "path": "./docs"
        },
        "theme": {
          "customCss": "C:\\Workspaces\\Bridge\\bridge-protocol-js\\docs\\src\\css\\custom.css"
        }
      }
    ]
  ]
};