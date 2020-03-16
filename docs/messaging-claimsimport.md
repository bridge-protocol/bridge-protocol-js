---
id: messaging-claimsimport
title: Bridge Protocol Claims Import Protocol
sidebar_label: Claims Import Protocol
---

# Bridge Protcol Claims Import Protocol
The claims import protocol is used by a passport that wishes to sign and provide an encrypted claim package to be imported to another passport.  This is the protocol used by all Bridge Marketplace providers to issue and transmit secure claims.

<img src='https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/docs/images/message-claimsimport.jpg?raw=true'>

## Creating a Claims Import Request
The verification provdier will create the import request to allow the recipient passport to accept and import the claims
```
let claimsImportRequest = await _bridge.Messaging.Claim.createClaimsImportRequest(passport, password, claimPackages);
```

## Verifying the Claims Import Request
The recieving passport will verify the integrity of the import request by ensuring the message was signed by the passport that transmitted the import request.
```
let verifiedImportRequest = await _bridge.Messaging.Claim.verifyClaimsImportRequest(claimsImportRequest);
```
Optionally, they can verify that the signing passport was a known Bridge Network Partner in good standing by calling the Bridge Network API to get infomration about the issuing passport
```
var passportDetails = await _bridge.Services.Passport.getDetails(passport, password, verifiedImportRequest.passportId);
```

## Verifying the Encrypted Claim Packages for Import
The receiving passport will receive the claim packages provided and verify each has been signed by the desired network partner and that the integrity has not been compromised.  Any claims that have been compromised or improperly signed will not be included in the final collection of claims to be imported.
```
let verifiedClaimPackages = await _bridge.Utils.Claim.verifyClaimPackagesForImport(passport, password, verifiedImportRequest.payload.claimsImportRequest.claimPackages);
```
