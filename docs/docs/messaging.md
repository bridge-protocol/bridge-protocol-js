---
id: messaging
title: Bridge Protocol
sidebar_label: Protocol
---
The Bridge Protcol is the core messaging protocol that handles the encoding, signing, and encrypting of messages to faciliate secure peer-to-peer communication between Bridge Passports.  All messages are hex encoded for transport.

<img class='centered' src='/img/message-overview.jpg'></img>

---

## Message Structure
<img src='/img/message-structure.jpg'></img>

- **Public Key** - the public key of the sending passport
- **Payload** - the message payload (see below for formats)

## Message Types
### Encoded Message
An encoded message is a simple message with no signing or encryption.

### Signed Message
A signed message contains the signed payload.  The the signed message can be verified using the public key and the signature of the payload.

### Encrypted Message
An encrypted message has an encrypted payload.  The payload can be verified and decrypted using the public key of the sending passport and the private key of the the receiving passport.
