---
id: messaging-auth
title: Bridge Protocol Authentication Protocol
sidebar_label: Authentication Protocol
---

# Bridge Protcol Authentication Protocol
<img src='https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/docs/images/message-authchallenge.jpg?raw=true'></img>

## Creating a Passport Challenge Request
```
let randomAuthToken = "randomtoken";
let requiredClaimTypes = [3];
let requiredBlockchainAddresses = ["neo","eth"];

let authRequest = await _bridge.Messaging.Auth.createPassportChallengeRequest(passport, password, randomAuthToken, requiredClaimTypes, requiredBlockchainAddresses);
```

## Receiving the Passport Challenge Request
```
let authMessage = await _bridge.Messaging.Auth.verifyPassportChallengeRequest(authRequest);
```

## Sending the Passport Challenge Response
```
let claims = await passport.getDecryptedClaims(authMessage.payload.claimTypes, password);
let addresses = passport.getWalletAddresses(authMessage.payload.networks);

let authResponse = await _bridge.Messaging.Auth.createPassportChallengeResponse(passport, password, authMessage.publicKey, authMessage.payload.token, claims, addresses); 
```

## Receiving the Passport Challenge Response
```
var authValidationInfo =  await _bridge.Messaging.Auth.verifyPassportChallengeResponse(_networkPartnerPassport, password, authResponse, randomAuthToken, requiredClaimTypes, requiredBlockchainAddresses);
```
