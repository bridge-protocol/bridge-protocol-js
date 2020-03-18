---
id: sdk-messaging-auth
title: Auth
sidebar_label: Auth 
---

Implements the challenge / response authentication protocol to allow passport, claims, and blockchain information to be securely communicated between passports.

## Functions
### createPassportChallengeRequest()
Create a passport challenge request
```
async createPassportChallengeRequest(passport, password, token, claimTypes, networks)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - the passport creating the signed challenge request
- **password** (string) - password to unlock the private key of the passport creating the signed challenge request
- **token** (string) - unique token used to verify challenge responses
- **claimTypes** (string[]) - the claim types to be requested from the target passport
- **networks** (string[]) - the blockchain networks to request addresses for from the target passport

### createPassportChallengeResponse()
Create a passport challenge response
```
async createPassportChallengeResponse(passport, password, targetPublicKey, token, claims, networks)
```
- **passport** - (<a href='sdk-models-passport'>Passport</a>) - the passport creating the encrypted challenge response
- **password** (string) - password to unlock the private key of the passport creating the encrypted challenge response
- **token** (string) - unique token sent with the challenge request
- **claims** (<a href='sdk-models-claim'>Claim</a>[]) - the claims to send in response to the request
- **networks** (string[]) - the networks to provide blockchain addresses for in response to the request

### verifyPassportChallengeRequest()
Verify a received passport challenge request
```
async verifyPassportChallengeRequest(message) 
```
- **message** (string) - the received signed passport challenge request

### verifyPassportChallengeResponse()
Verify a received passport challenge response
```
async verifyPassportChallengeResponse(passport, password, message, verifyToken, claimTypeIds, networks)
```
- **passport** - (<a href='sdk-models-passport'>Passport</a>) - the passport verifying the encrypted challenge response
- **password** (string) - password to unlock the private key of the passport verifying the encrypted challenge response
- **verifyToken** (string) - unique token to verify the challenge response
- **claimTypeIds** (string[]) - the claim types to verify were provided in the response
- **networks** (string[]) - the networks types to verify were provided in the response