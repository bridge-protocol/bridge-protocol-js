module.exports = {
  gettingStarted: {
    'Getting Started': ['overview','whatsnew','definitions'],
    'Bridge Network':[
      'network',
      'marketplace',
      'token',
      'network-explorer'
    ],
    'Bridge Passport Extension':[
      'extension-passport',
      {
        type: 'category',
        label: 'Passport Basics',
        items: ['extension-opening', 'extension-navigating', 'extension-using', 'extension-managing']
      },
      {
        type: 'category',
        label: 'Digital Identity',
        items: ['extension-identity', 'extension-identity-claims', 'extension-identity-claimpublish']
      },
      {
        type: 'category',
        label: 'Blockchain Wallets',
        items: ['extension-wallets', 'extension-wallets-detail', 'extension-wallets-tx', 'extension-wallets-swap']
      },
      {
        type: 'category',
        label: 'Marketplace Requests',
        items: ['extension-marketplace', 'extension-marketplace-details', 'extension-marketplace-request', 'extension-marketplace-verification']
      }
    ],
    'Developers':[
      {
        type: 'category',
        label: 'Concepts',
        items:[
        'bridge-overview',  
        {
          type: 'category',
          label: 'Bridge Passport',
          items:['bridge-passport', 'passport-key', 'passport-claim', 'passport-wallet']
        },
        {
          type: 'category',
          label: 'Bridge Protocol',
          items: ['messaging', 'messaging-auth', 'messaging-claimsimport','messaging-payment']
        }
        ]
      },
      {
        type: 'category',
        label: 'Javascript SDK',
        items:[
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
        ]
      },
      {
        type: 'category',
        label: 'REST Microservice',
        items:[
          'integration',
          { type:'category',
            label: 'Endpoints',
            items: ['integration-passport','integration-claim','integration-profile','integration-blockchain']
          }
        ]
      },
    ],
    'Terms of Use':[
      'license',
      'tos'
    ]
  }
};
