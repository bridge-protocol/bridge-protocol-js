---
id: overview
title: Bridge Digital Identity
sidebar_label: Overview
---
Bridge Identity is a unique approach to sovereign digital identity that can be applied to a wide range of applications and environments, making it ideal for securely managing and transmitting digital identity.  In this article, we will look at an overview of the components that make up the platform and how it can be used.

<img class='centered' src='/img/general-overview.png'></img>

The Bridge Protocol is at the core of the solution, which is simply a peer-to-peer protocol that allows for the secure transmission of portable digital identity. It enables individuals, applications, and devices to send and receive digital identity claims in both on and offline environments. The ability to request and transmit identity in an offline environment opens the potential for real-world applications by removing dependency on Internet connectivity and unpredictable blockchain networks at the point of identity verification. The protocol can easily be implemented in web and mobile applications, blockchain distributed applications, and even in hardware devices.

## Components of the Bridge Identity Platform
The platform is made up of several components that allow for a robust, secure, and fully integrated soverieign digital identity solution.

### Bridge Passport
The passport is the container for an individual's sovereign digital identity. A user's passport will contain their Bridge Identity cryptographic keys, their NEO and Ethereum wallets and cryptographic keys for on-chain transactions, and their verified information about their identity in the form of secure, portable claims.

<img class='centered' src='/img/bridge-passport-hl.png'></img>

### Bridge Network
The Bridge Network is a public network that can facilitate communication between Bridge identities as well as provide an optional layer of trust when Bridge identities interact with one another. The Bridge Network maintains a record of known Bridge Network partner identities that have been verified as trusted organizations, as well a record of any blacklisted identities to remove bad actors from the network.

<img class='centered' src='/img/bridge-network-hl.png'></img>


### Bridge Marketplace
The Bridge Marketplace is a part of the Bridge Network that provides a marketplace that connect individuals with marketplace partners that provide services to verify their personal information and build their digital identity in exchange for Bridge Tokens.

<img class='centered' src='/img/bridge-marketplace-hl.png'></img>

A key aspect of the Bridge Marketplace is that it keeps decentralization in mind, as it only serves to connect users with Bridge Marketplace partners. Once the  user selects a marketplace partner and sends the appropriate network fees, the user is directed to the partner to complete the identity verification process. 

Any payments, personal information, or identity claims are transmitted directly between the user and marketplace partner. The network does not collect or maintain any personal information about the user aside from facilitating the initial request for service between the user and partner.


### Bridge Passport Browser Extension
The Bridge Passport Browser Extension is the official software client that implements a user interface to use their Bridge Identity with the Bridge Protocol and connect to the Bridge Network. The extension enables end users to create, verify, and use their digital identity in both web and blockchain based applications.

<img class='centered' src='/img/bridge-screenshot-hl.png'></img>

Using the extension, users are able to:

- Interact with marketplace partners to purchase verification services
- Build their digital identity by importing verified information
- Provide their identity to browser-based applications that implement the Bridge Protocol
- Manage NEO and Ethereum blockchain wallets to send token payments and swap tokens cross-chain
- Publish their digital identity to the NEO and Ethereum blockchain networks for use with decentralized applications

### Bridge Token and Smart Contracts
The fees for services on the Bridge Network and Bridge Marketplace are paid using the Bridge Token (BRDG). The Bridge Token was initially created and launched on the NEO blockchain in 2018.  As of the 3.0 release, the Bridge Token is now not only available on NEO as a NEP-5 token, but also on the Ethereum blockchain as an ERC-20 token. The token can be easily be swapped between the chains using the Bridge Passport Browser Extension.

<img class='centered' src='/img/bridge-token-hl.png'></img>

Bridge Smart Contracts are deployed on both the NEO and Ethereum networks to allow Bridge Identity to be published on the blockchain. The cross-chain token and smart contracts are a huge step forward as they expand the use of the Bridge Token and Bridge Identity to projects on either network.

## Using Bridge Identity in Applications

### Browser-Based Applications
Any browser-based application can implement the Bridge Protocol to verify a user's digital identity. Identity claims can be transmitted securely between the Bridge Passport Browser Extension and the requesting application.

<img class='centered' src='/img/browser-app-hl.png'></img>

Since the Bridge Network only serves as an optional point of trust in the decentralized solution, registration by the site implenting the protocol is not required. However, it is highly recommended that all organizations and applications implementing the protocol register with the network so they can provide an additional level of trust for ecosystem identities they interact with.

### Blockchain Distributed Applications
Bridge identity can be optionally published to the NEO and Ethereum blockchain networks to provide asynchronous on-chain identity verification to ecosystem projects on either network.

<img class='centered' src='/img/blockchain-app-hl.png'></img>

Blockchain distributed applications can simply interact directly with the Bridge Smart Contract to verify identity without interacting directly with the user in real-time.

### Disconnected and Hardware Applications
It is even possible to implement the Bridge Protocol in real-world applications without any online connectivity. The protocol can be implemented in mobile or hardware applications to securely transmit digital identity directly without relying on a synchronized and available blockchain node or Internet connectivity.

<img class='centered' src='/img/offline-app-hl.png'></img>

If connectivity is available, the participants can use the Bridge Network as a an additional point of trust to verify blacklisting, but it is not required to transmit and verify the secure identity claims.



