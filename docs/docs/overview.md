---
id: overview
title: Bridge Digital Identity
sidebar_label: Overview
---
Bridge Digital Identity is a unique approach to portable digital identity that can be applied to a wide range of applications and environments, making it ideal for securely managing and transmitting digital identity.  In this article, we will look at an overview of the components that make up the Bridge Digital Identity solution and how it can be used.

<img class='centered' src='/img/general-overview.png'></img>

The Bridge Protocol is at the core of the solution, which is simply a peer-to-peer protocol that allows for the secure transmission of portable digital identity. It enables individuals (and devices) to send and receive digital identity claims in both on and offline environments. The ability to request and transmit identity in an offline environment opens the potential for real-world applications by removing dependency on Internet connectivity or slow and unpredictable blockchain networks at the point of identity transmission. The protocol can easily be implemented in web and mobile applications, blockchain distributed applications, and even in hardware and IoT devices.

## Components of the Bridge Ecosystem
The Bridge Digital Identity ecosystem is made up of several components that allow for a robust, secure, and fully integrated digital identity verification and transmission solution.

### Bridge Passport

<img class='centered' src='/img/bridge-passport-hl.png'></img>

The Bridge Passport is exactly as it sounds, the container for an individual's digital identity. A user's passport will contain their Bridge cryptographic keys, their blockchain wallets and cryptographic keys for on-chain transactions, and their verified information about their identity in the form of secure, portable claims.


### Bridge Network

<img class='centered' src='/img/bridge-network-hl.png'></img>

The Bridge Network is a public network that can facilitate communication between Bridge identities as well as provide an optional layer of trust when Bridge identities interact with one another. The Bridge Network maintains a record of known Bridge Network partner identities that have been verified as trusted organizations, as well a record of any blacklisted identities to remove bad actors from the network.


### Bridge Marketplace

<img class='centered' src='/img/bridge-marketplace-hl.png'></img>

The Bridge Marketplace is a part of the Bridge Network that provides a marketplace for end users to verify their personal information to be included as part of their verified digital identity. The Bridge Marketplace connects users with trusted marketplace partners that can offer them verification services in exchange for Bridge tokens as payment.

One key aspect of the Bridge Marketplace is that it keeps decentralization in mind, as it only serves to connect users with Bridge Marketplace partners. Once the  user selects a marketplace partner and sends the appropriate network fees, the user is directed to the partner to complete the identity verification process. 

Any payments, personal information, or issued verified identity claims are transmitted directly between the user and marketplace partner without any involvement from the Bridge Network. The network does not collect or maintain any personal information about the user aside from facilitating the initial request for services between the user and partner.

### Bridge Passport Browser Extension
The Bridge Passport Browser Extension is the official software client that fully implements the Bridge Protocol, Bridge Network, and Bridge Marketplace with a user interface. The extension enables end users to create, verify, and use their digital identity in both web and blockchain based applications.

<img class='centered' src='/img/bridge-screenshot-hl.png'></img>

Using the extension, users are able to:

- Interact with marketplace partners to verify their personal information
- Import verified identity claims to their passport
- Login to browser-based applications implementing the Bridge Protocol using their digital identity
- Manage NEO and Ethereum blockchain wallets to send token payments and swap tokens cross-chain
- Publish their digital identity to the NEO and Ethereum blockchain networks for use with decentralized applications on either network.

### Bridge Token and Smart Contracts

<img class='centered' src='/img/bridge-token-hl.png'></img>

The fees for services on the Bridge Network and Bridge Marketplace are paid using the Bridge Token (BRDG). The Bridge Token was initially created and launched on the NEO blockchain, but as of the 3.0 release, the Bridge Token is now not only available on NEO as a NEP-5 compliant token, but also on the Ethereum blockchain as an ERC-20 token.  The token can be easily be swapped between the chains using the Bridge Passport Browser Extension.  The Bridge Smart Contracts are deployed on both the NEO and Ethereum blockchain networks. The cross-chain token and smart contracts expand the use of the Bridge Token and Bridge Digital Identity to both NEO and Ethereum ecosystem projects.



## Using Bridge Identity in Applications

### Web Applications

<img class='centered' src='/img/browser-app-hl.png'></img>

Any browser based application can implement the Bridge Protocol to authenticate and authorize a user's digital identity. Identity claims can be transmitted securely via peer-to-peer communication between the Bridge Passport Browser Extension and the requesting application.


### Blockchain Distributed Applications

<img class='centered' src='/img/blockchain-app-hl.png'></img>

Bridge identity can be optionally published to the NEO and Ethereum blockchain networks to provide asynchronous on-chain identity verification to ecosystem projects on both networks.  Blockchain distributed applications can simply interact directly with the Bridge Smart Contract to verify the Bridge identity without interacting directly with the user in real-time.


### Offline Applications

<img class='centered' src='/img/offline-app-hl.png'></img>

It is even possible to implement the Bridge Protocol in real-world applications without online connectivity. The protocol can be implemented in mobile or hardware applications to securely transmit digital identity directly without relying on a synchronized and available blockchain node or Internet connectivity.  If connectivity is available, the participants can use the Bridge Network as a point of trust to further verify the identity requesting or transmitting identity claims to ensure there are no blacklists or other issues outstanding for the passport.



