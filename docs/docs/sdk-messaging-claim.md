---
id: sdk-messaging-claim
title: Claim
sidebar_label: Claim 
---
Implements the claims import protocol to allow verified claims to be securely communicated between verifier and user passports.

## Functions

### createClaimsImportRequest()
Create a claims import request to send claims to a target passport
```
async createClaimsImportRequest(passport, password, claimPackages)
```
- **passport** (string) - the passport receiving the claims import request that the claim packages were signed and encrypted for
- **password** (string) - the password to unlock the passport receiving the claims import request
- **claimPackages** (<a href='sdk-models-claimpackage'>ClaimPackage</a>[]) - the claim packages signed and encrypted for the receiving passport

---

### verifyClaimsImportRequest()
Verify a received claims import request from a passport
```
async verifyClaimsImportRequest(message)
```
- **message** (string) - the received claims import message