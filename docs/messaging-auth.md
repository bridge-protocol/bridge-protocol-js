---
id: messaging-auth
title: Authentication
sidebar_label: Authentication
---
The authentication protocol is used by a passport that wishes to challenge another passport to securely transmit information such as verified claims or blockchain addresses.

<img class='centered' src='https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/docs/images/message-authchallenge.jpg?raw=true'></img>

---

## Creating a Passport Challenge Request

A Bridge Passport can challenge another passport for information including the passport identifier, specific claim types, and blockchain addresses.

```
let randomAuthToken = "randomtoken";
let requiredClaimTypes = [3];
let requiredBlockchainAddresses = ["neo","eth"];
let authRequest = await Bridge.Messaging.Auth.createPassportChallengeRequest(passport, password, randomAuthToken, requiredClaimTypes, requiredBlockchainAddresses);
```
- **randomAuthToken** - A randomly generated token that will be passed back in the response to assist in verifying the integrity of the response
- **requiredClaimTypes** - The claim types being requested of the target passport
- **requiredBlockchainAddresses** - The blockchain network addresses being requested of the target passport
- **authRequest** - The message payload of the generated challenge request to be sent to the target passport

---

## Receiving the Passport Challenge Request
When a passport challenge request message is received, the message and sender passport information need to be verified

```
let verifiedAuthRequest = await Bridge.Messaging.Auth.verifyPassportChallengeRequest(authRequest);
let passportInfo = await Bridge.Services.Passport.getDetails(passport, password, verifiedAuthRequest.passportId);
```
- **authRequest** - the challenge request message received from the sender
- **verifiedAuthRequest** - the verified challenge request message
- **passportInfo** - the information received from the Bridge Network about the passport that sent the request message

---

## Sending the Passport Challenge Response
Once the sender is verified, the passport can retrieve the claim and blockchain address data requested and send generate an encrypted response message with the requested information.
```
let claims = await passport.getDecryptedClaims(verifiedAuthRequest.payload.claimTypes, password);
let addresses = passport.getWalletAddresses(verifiedAuthRequest.payload.networks);
let authResponse = await Bridge.Messaging.Auth.createPassportChallengeResponse(passport, password, verifiedAuthRequest.publicKey, verifiedAuthRequest.payload.token, claims, addresses); 
```
- **claims** - the passport claims to be included in the challenge response
- **addresses** - the passport blockchain addresses to be included in the challenge response
- **authResponse** - the challenge response message to be sent back to the requesting passport

---

## Receiving the Passport Challenge Response
When the challenge response is received, the message integrity needs to be verified, the message is decrypted, the sender is verified, and the provided claim integrity is verified.
```
let verifiedAuthResponse =  await Bridge.Messaging.Auth.verifyPassportChallengeResponse(passport, password, authResponse, randomAuthToken, requiredClaimTypes, requiredBlockchainAddresses);
let passportInfo = await Bridge.Services.Passport.getDetails(passport, password, authResponse.passportId);
```
- **authResponse** - the challenge response message received
- **verifiedAuthResponse** - the validatated information from the received challenge response message
- **passportInfo** - the information received from the Bridge Network about the passport that sent the response message
