---
id: sdk-utils-claim
title: Claim
sidebar_label: Claim
---
Utility functions for interacting with one or more <a href='sdk-models-claimpackage'>ClaimPackage</a>

## Functions
### createClaimPackagesFromClaims()
Creates encrypted claim packages from the provided claims
```
async createClaimPackagesFromClaims(claims, targetPublicKey, passportPublicKey, passportPrivateKey, password)
```
- **claims** (<a href='sdk-models-claim'>Claim</a>[]) - claims to create claim packages from
- **targetPublicKey** - the public key of the passport the claims will be signed and encrypted for
- **passportPublicKey** - the public key of the signing and encrypting passport
- **passportPrivateKey** - the private key of the signing and encrypting passport
- **password** - the password to unlock the private key of the signing and encrypting passport

### verifyClaimPackagesForImport()
Verifies the integrity of claim packages to ensure they are suitable for import to the passport
```
async verifyClaimPackagesForImport(passport, password, claimPackages)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - The passport receiving the claim packages for import
- **password** (string) - the password to unlock the private key of the receiving passport
- **claimPackages** (<a href='sdk-models-claimpackage'>ClaimPackage</a>[]) - the claim packages to be imported