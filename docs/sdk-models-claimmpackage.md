---
id: sdk-models-claimpackage
title: Claim Package
sidebar_label: Claim Package
---
The claim package is a package containing encrypted claim data that can only be decrypted and viewed by the passport that it was signed and encrypted for.

## Constructor
**ClaimPackage(** typeId, signedBy, claim **)**

## Properties
- **typeId** (string) - the type of the claim contained in the package
- **signedBy** (string) - the public key of the passport that signed and encrypted the claim
- **claim** (string) - the encrypted hex encoded claim payload

## Functions
### fromClaim()
Creates a claim package from a <a href='sdk-models-claim'>Claim</a>
```
async fromClaim(claim, targetPublicKey, passportPublicKey, passportPrivateKey, password)
```
- **claim** (<a href='sdk-models-claim'>Claim</a>) - the claim to include in the claim package
- **targetPublicKey** (string) - the target passport public key to encrypt the claim package for
- **passportPublicKey** (string) - the public key of the signing and encrypting passport
- **passportPrivateKey** (string) - the private key of the signing and encrypting passport
- **password** (string) - the password to unlock the private key of the signing and encrypting passport

### decrypt()
Decrypts the claim package and returns a <a href='sdk-models-claim'>Claim</a>
```
async decrypt(privateKey, password)
```
- **privateKey** (string) - the private key of the decrypting passport
- **password** (string) - the password to unlock private key of the decrypting passport