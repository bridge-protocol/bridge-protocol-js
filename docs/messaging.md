---
id: messaging
title: Messaging
sidebar_label: Messaging Protocol
---

# Messaging Protocol
The Bridge Protcol core messaging handles the encoding, signing, and encrypting of messages to faciliate secure peer-to-peer communication between Bridge Passports.  All messages are hex encoded for transport.

## Message Structure
- publicKey - the public key of the sender
- payload - the message payload

## Message Types
### Encoded Message
<img src='https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/docs/images/message.jpg?raw=true'></img>

An encoded message is a simple message with no signing or encryption

### Signed Message
<img src='https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/docs/images/message-sign.jpg?raw=true'></img>
A signed message has a signature property that is the signed payload.  The integrity of the message is verified using the public key of the sender and the signature of the payload.

### Encrypted Message
<img src='https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/docs/images/message-encrypt.jpg?raw=true'></img>
An encrypted message has an encrypted payload property.  The payload property can be verified and decrypted using the public key of the sender and the private key of the Bridge Passport.
