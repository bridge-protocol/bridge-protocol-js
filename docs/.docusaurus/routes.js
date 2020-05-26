
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  
{
  path: '/',
  component: ComponentCreator('/'),
  exact: true,
  
},
{
  path: '/docs/:route',
  component: ComponentCreator('/docs/:route'),
  
  routes: [
{
  path: '/docs/blockchain',
  component: ComponentCreator('/docs/blockchain'),
  exact: true,
  
},
{
  path: '/docs/blockchain-ethereum',
  component: ComponentCreator('/docs/blockchain-ethereum'),
  exact: true,
  
},
{
  path: '/docs/blockchain-neo',
  component: ComponentCreator('/docs/blockchain-neo'),
  exact: true,
  
},
{
  path: '/docs/bridge-claim',
  component: ComponentCreator('/docs/bridge-claim'),
  exact: true,
  
},
{
  path: '/docs/bridge-overview',
  component: ComponentCreator('/docs/bridge-overview'),
  exact: true,
  
},
{
  path: '/docs/bridge-passport',
  component: ComponentCreator('/docs/bridge-passport'),
  exact: true,
  
},
{
  path: '/docs/extension-identity',
  component: ComponentCreator('/docs/extension-identity'),
  exact: true,
  
},
{
  path: '/docs/extension-identity-claimpublish',
  component: ComponentCreator('/docs/extension-identity-claimpublish'),
  exact: true,
  
},
{
  path: '/docs/extension-identity-claims',
  component: ComponentCreator('/docs/extension-identity-claims'),
  exact: true,
  
},
{
  path: '/docs/extension-managing',
  component: ComponentCreator('/docs/extension-managing'),
  exact: true,
  
},
{
  path: '/docs/extension-marketplace',
  component: ComponentCreator('/docs/extension-marketplace'),
  exact: true,
  
},
{
  path: '/docs/extension-marketplace-details',
  component: ComponentCreator('/docs/extension-marketplace-details'),
  exact: true,
  
},
{
  path: '/docs/extension-marketplace-request',
  component: ComponentCreator('/docs/extension-marketplace-request'),
  exact: true,
  
},
{
  path: '/docs/extension-marketplace-verification',
  component: ComponentCreator('/docs/extension-marketplace-verification'),
  exact: true,
  
},
{
  path: '/docs/extension-navigating',
  component: ComponentCreator('/docs/extension-navigating'),
  exact: true,
  
},
{
  path: '/docs/extension-opening',
  component: ComponentCreator('/docs/extension-opening'),
  exact: true,
  
},
{
  path: '/docs/extension-passport',
  component: ComponentCreator('/docs/extension-passport'),
  exact: true,
  
},
{
  path: '/docs/extension-using',
  component: ComponentCreator('/docs/extension-using'),
  exact: true,
  
},
{
  path: '/docs/extension-wallets',
  component: ComponentCreator('/docs/extension-wallets'),
  exact: true,
  
},
{
  path: '/docs/extension-wallets-detail',
  component: ComponentCreator('/docs/extension-wallets-detail'),
  exact: true,
  
},
{
  path: '/docs/extension-wallets-swap',
  component: ComponentCreator('/docs/extension-wallets-swap'),
  exact: true,
  
},
{
  path: '/docs/integration',
  component: ComponentCreator('/docs/integration'),
  exact: true,
  
},
{
  path: '/docs/integration-blockchain',
  component: ComponentCreator('/docs/integration-blockchain'),
  exact: true,
  
},
{
  path: '/docs/integration-claim',
  component: ComponentCreator('/docs/integration-claim'),
  exact: true,
  
},
{
  path: '/docs/integration-passport',
  component: ComponentCreator('/docs/integration-passport'),
  exact: true,
  
},
{
  path: '/docs/integration-profile',
  component: ComponentCreator('/docs/integration-profile'),
  exact: true,
  
},
{
  path: '/docs/marketplace',
  component: ComponentCreator('/docs/marketplace'),
  exact: true,
  
},
{
  path: '/docs/messaging',
  component: ComponentCreator('/docs/messaging'),
  exact: true,
  
},
{
  path: '/docs/messaging-auth',
  component: ComponentCreator('/docs/messaging-auth'),
  exact: true,
  
},
{
  path: '/docs/messaging-claimsimport',
  component: ComponentCreator('/docs/messaging-claimsimport'),
  exact: true,
  
},
{
  path: '/docs/messaging-payment',
  component: ComponentCreator('/docs/messaging-payment'),
  exact: true,
  
},
{
  path: '/docs/network',
  component: ComponentCreator('/docs/network'),
  exact: true,
  
},
{
  path: '/docs/passport-claim',
  component: ComponentCreator('/docs/passport-claim'),
  exact: true,
  
},
{
  path: '/docs/passport-key',
  component: ComponentCreator('/docs/passport-key'),
  exact: true,
  
},
{
  path: '/docs/passport-wallet',
  component: ComponentCreator('/docs/passport-wallet'),
  exact: true,
  
},
{
  path: '/docs/sdk',
  component: ComponentCreator('/docs/sdk'),
  exact: true,
  
},
{
  path: '/docs/sdk-examples',
  component: ComponentCreator('/docs/sdk-examples'),
  exact: true,
  
},
{
  path: '/docs/sdk-messaging-auth',
  component: ComponentCreator('/docs/sdk-messaging-auth'),
  exact: true,
  
},
{
  path: '/docs/sdk-messaging-claim',
  component: ComponentCreator('/docs/sdk-messaging-claim'),
  exact: true,
  
},
{
  path: '/docs/sdk-messaging-payment',
  component: ComponentCreator('/docs/sdk-messaging-payment'),
  exact: true,
  
},
{
  path: '/docs/sdk-models-claim',
  component: ComponentCreator('/docs/sdk-models-claim'),
  exact: true,
  
},
{
  path: '/docs/sdk-models-claimpackage',
  component: ComponentCreator('/docs/sdk-models-claimpackage'),
  exact: true,
  
},
{
  path: '/docs/sdk-models-passport',
  component: ComponentCreator('/docs/sdk-models-passport'),
  exact: true,
  
},
{
  path: '/docs/sdk-models-wallet',
  component: ComponentCreator('/docs/sdk-models-wallet'),
  exact: true,
  
},
{
  path: '/docs/sdk-services-application',
  component: ComponentCreator('/docs/sdk-services-application'),
  exact: true,
  
},
{
  path: '/docs/sdk-services-blockchain',
  component: ComponentCreator('/docs/sdk-services-blockchain'),
  exact: true,
  
},
{
  path: '/docs/sdk-services-bridge',
  component: ComponentCreator('/docs/sdk-services-bridge'),
  exact: true,
  
},
{
  path: '/docs/sdk-services-claim',
  component: ComponentCreator('/docs/sdk-services-claim'),
  exact: true,
  
},
{
  path: '/docs/sdk-services-partner',
  component: ComponentCreator('/docs/sdk-services-partner'),
  exact: true,
  
},
{
  path: '/docs/sdk-services-passport',
  component: ComponentCreator('/docs/sdk-services-passport'),
  exact: true,
  
},
{
  path: '/docs/sdk-services-profile',
  component: ComponentCreator('/docs/sdk-services-profile'),
  exact: true,
  
},
{
  path: '/docs/sdk-services-tokenswap',
  component: ComponentCreator('/docs/sdk-services-tokenswap'),
  exact: true,
  
},
{
  path: '/docs/sdk-utils-claim',
  component: ComponentCreator('/docs/sdk-utils-claim'),
  exact: true,
  
},
{
  path: '/docs/token',
  component: ComponentCreator('/docs/token'),
  exact: true,
  
}],
},
  
  {
    path: '*',
    component: ComponentCreator('*')
  }
];
