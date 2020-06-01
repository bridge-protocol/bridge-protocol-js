---
id: overview
title: Bridge Portable Digital Identity Solution
sidebar_label: Overview
---
The Bridge Portable Digital Identity Solution was designed to provide users with a self-managed, portable digital identity that could be used to provide verified information about their identity and eligibility securely both on and offline.  The Bridge Protocol can be easily implemented by any browser, mobile, or blockchain application to request information about a user's digital identity without compromising the privacy and security of the user.

<img class='centered' src='/img/general-overview.png'></img>

At its core, the Bridge Protocol is a portable peer-to-peer protocol that allows for the secure transmission of digital identity between Bridge Passports.  The Bridge Protocol Portable Digital Identity solution allows passports to send and receive digital identity claims both on and offline.  This aspect of the protocol opens the potential for real-world applications by removing dependency Internet connectivity or unstable and unpredictable blockchain networks at the point of identity transmission.  The protocol can easily be implemented in web and mobile applications, blockchain distributed applications, and even in hardware and IoT applications.

### Interaction Between User Passports
The most basic transmission of digital identity can be done peer-to-peer between user passports without the Bridge Network.  Optionally, the participants can use the Bridge Network as a point of trust to further verify the passport to ensure there are no blacklists or other issues outstanding for the passport.

### Interaction with Bridge Network Partners
Bridge Network Partners are passports belonging to individuals or organizations that are verified and registered on the network as a trusted partner.  When interacting with a Bridge Network Partner passport, users can be sure they know who is requesting information about their digital identity.

### Interaction with Bridge Marketplace Partners
Bridge Marketplace Partners are Bridge Network Partners that also provide verification services in the Bridge Marketplace in exchange for Bridge Tokens as payment.  Users will interact with the partner's web or distributed application to provide Marketplace Partners with the requested informmation about their identity to be verified, and in return the partner will transmit verified claims about the user using the peer-to-peer protocol.

### Interaction with Third-Party Browser Applications
Any web based or mobile application can implement the Bridge Protocol and request and accept digital claims from a Bridge Passport to authenticate and authorize users.  It is recommended that all applications implementing the protocol register with the network so they can provide an additional level of trust for their users, but not required.

### Interaction with Blockchain Distributed Applications
Users are able to publish their verified claims to the NEO and Ethereum blockchains to allow for asynchronous / offline identity verification. Blockchain distributed applications can simply interact directly with the Bridge Keyserver smart contract on either respective blockchain to retrieve the anonymmous claims information for the requested identity without interacting directly with the user in realtime.










