module.exports = {
  gettingStarted: {
    'Getting Started': ['bridge-overview'],
    'Bridge Passport': ['bridge-passport', 'passport-key', 'passport-claim', 'passport-wallet'],
    'Bridge Network': ['network','token','marketplace'],
    'Bridge Protocol': ['messaging', 'messaging-auth', 'messaging-claimsimport','messaging-payment'],
    'JavaScript SDK':[
      'sdk',
      'sdk-examples',
      {
        type: 'category',
        label: 'Modules',
        items:[{
          type: 'category',
          label: 'Models',
          items: ['sdk-models-claim', 'sdk-models-claimpackage', 'sdk-models-passport', 'sdk-models-wallet']
        },
        {
          type: 'category',
          label: 'Messaging',
          items: ['sdk-messaging-auth', 'sdk-messaging-claim', 'sdk-messaging-payment']
        },
        {
          type: 'category',
          label: 'Services',
          items: ['sdk-services-application', 'sdk-services-blockchain', 'sdk-services-bridge', 'sdk-services-claim', 'sdk-services-partner', 'sdk-services-passport', 'sdk-services-profile', 'sdk-services-tokenswap']
        },
        {
          type: 'category',
          label: 'Utils',
          items: ['sdk-utils-claim']
        }]
      }
    ],
    'REST Microservice': [
        'integration',
        { type:'category',
          label: 'Endpoints',
          items: ['integration-passport','integration-claim','integration-profile','integration-blockchain']
        }
    ],
    'Browser Extension':[
      'extension-passport',
      {
        type: 'category',
        label: 'Passport Basics',
        items: ['extension-opening', 'extension-managing', 'extension-navigating', 'extension-using']
      },
      {
        type: 'category',
        label: 'Digital Identity',
        items: ['extension-identity', 'extension-identity-claims', 'extension-identity-claimpublish']
      },
      {
        type: 'category',
        label: 'Blockchain Wallets',
        items: ['extension-wallets', 'extension-wallets-detail', 'extension-wallets-swap']
      },
      {
        type: 'category',
        label: 'Marketplace Requests',
        items: ['extension-marketplace', 'extension-marketplace-details', 'extension-marketplace-request', 'extension-marketplace-verification']
      }
    ]
  }
};
