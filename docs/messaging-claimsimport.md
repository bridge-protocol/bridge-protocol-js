---
id: messaging-claimsimport
title: Claims Import
sidebar_label: Claims Import
---
The claims import protocol is used by a passport that wishes to sign and provide an encrypted claim package to be imported to another passport.  This is the protocol used by all Bridge Marketplace providers to issue and transmit secure claims.

<img class='centered' src='https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/docs/images/message-claimsimport.jpg?raw=true'></img>

## Creating a Claims Import Request
The verification provdier will create the import request to allow the recipient passport to accept and import the claims
```
let claimsImportRequest = await Bridge.Messaging.Claim.createClaimsImportRequest(passport, password, claimPackages);
```
- **claimPackages** - the signed and encrypted claim packages to be sent to the target passport
- **claimsImportRequest** - the claims import request message

## Verifying the Claims Import Request
The recieving passport will verify the integrity of the import request by ensuring the message was signed by the verified passport that transmitted the import request.  The claim packages will be verified for integrity and available to import to the receiving passport.
```
let verifiedImportRequest = await Bridge.Messaging.Claim.verifyClaimsImportRequest(claimsImportRequest);
let passportDetails = await Bridge.Services.Passport.getDetails(passport, password, verifiedImportRequest.passportId);
let verifiedClaimPackages = await Bridge.Utils.Claim.verifyClaimPackagesForImport(passport, password, verifiedImportRequest.payload.claimsImportRequest.claimPackages);
```
- **claimsImportRequest** - the received claims import request message
- **verifiedImportRequest** - the integrity verified data transmitted via the claims import request message
- **passportDetails** - the information received from the Bridge Network about the passport that sent the request message
- **verifiedClaimPackages** - the claim packages that have been verified for integrity that are ready for import to the receiving passport.