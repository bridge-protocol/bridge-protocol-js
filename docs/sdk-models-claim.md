---
id: sdk-models-claim
title: Claim
sidebar_label: Claim
---

The claim model represents a claim sent from one passport to another.

## Constructor
**Claim(** claimData **)**

## Properties

- **claimTypeId** (string) - the claim type
- **claimValue** (string) - the value of the claim
- **createdOn** (long) - the unix timestamp of the creation date
- **expiresOn** (long) - the unix timestamp of the expiration date (0 = does not expire)
- **signedByKey** (string) - the public key of the signer of the claim
- **signature** (string) - the signature of the claim
- **isExpired** (bool) - whether or not the claim is expired
- **isValid** (bool) - whether or not the claim has all required data to be valid

## Functions

### encrypt()
Serializes and encrypts the claim data for the target passport
```
async encrypt(targetPublicKey, passportPrivateKey, password)
```
- **targetPublicKey** (string)- the target public key the claim should be encrypted for
- **passportPrivateKey** (string)- the private key of the passport encrypting the claim
- **password** (string)- the password to unlock the private key of the passport encrypting the claim

---

### fromClaimPackage()
Decrypts and loads the claim from an encrypted claim package
```
async fromClaimPackage(claimPackage, privateKey, password)
```
- **claimPackage** (<a href='sdk-models-claimpackage'>ClaimPackage</a>) - the claim package to load the claim from
- **privateKey** (string) - the private key of the loading passport
- **password** (string) - the password to unlock the private key of the loading passport

---

### verifySignature()
Verifies the signature of the claim is valid
```
async verifySignature(passportId)
```
- **passportId** (string) - the passport context to verify the signature for

---

### getSignatureString()
Retrieves the unique fingerprint for the claim used for signing and integrity verification
```
async getSignatureString(passportId)
```
- **passportId** (string) - the passport context the claim should be signed or verified for
