---
id: messaging
title: Messaging
sidebar_label: Messaging Protocol
---

# Messaging Protocol
## Message Structure

- payload - the message payload
- publicKey - the public key of the sender
- signature - the signed message payload, only exists on signed messages

## Message Types
### Encoded Message
An encoded message is a hex encoded message with no signing or encryption

### Signed Message
A signed message has a signature property that is the signed payload.  The integrity of the message is verified using the public key of the sender and the signature of the payload.

### Encrypted Message
An encrypted message has an encrypted payload property.  The payload property can be verified and decrypted using the public key of the sender and the private key of the Bridge Passport.
