module.exports = {
  gettingStarted: {
    'Getting Started': ['bridge-overview'],
    'Bridge Passport': ['bridge-passport', 'passport-key', 'passport-claim', 'passport-wallet'],
    'Bridge Protocol': ['messaging', 'messaging-auth', 'messaging-claimsimport','messaging-payment'],
    'Bridge Marketplace': ['marketplace','marketplace-partners'],
    'Blockchain': ['blockchain', 'blockchain-neo', 'blockchain-ethereum'],
    'SDK':[
      {
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
        items: ['sdk-services-application', 'sdk-services-blockchain', 'sdk-services-bridge', 'sdk-services-claim', 'sdk-services-partner', 'sdk-services-passport', 'sdk-services-profile']
      },
      {
        type: 'category',
        label: 'Utils',
        items: ['sdk-utils-claim']
      }
    ]
  }
};
