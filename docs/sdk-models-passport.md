---
id: sdk-models-passport
title: Passport
sidebar_label: Passport
---
The passport is the container for all passport signing and encryption keys, blockchain wallets, and encrypted claim packages.

## Constructor
**Passport()**

## Properties
- **id** (string) - the unique identifier of the passport
- **version** (string) - the version of the passport
- **key** (object) - an object containing the public and private key of the passport
- **wallets** (<a href='sdk-models-wallet'>Wallet</a>[]) - the blockchain wallets in the passport
- **claims** (<a href='sdk-models-claimpackage'>ClaimPackage</a>[]) - the claim packages in the passport
- **publicKey** (string) - shortcut that returns the public key of the passport
- **privateKey** (string) - shortcut that returns the private key of the passport


## Functions

### create()
Creates a new passport with a private key encrypted using the password
```
async create(password)
```
- **password** (string) - the password to encrypt the private key and unlock the passport

---

### openFile()
Opens an existing passport from a JSON file on disk
```
async openFile(filePath, password)
```
- **filePath** (string) - the file path to load the exported passport JSON from
- **password** (string) - the password used to unlock the private key of the passport

---

### open()
Opens a passport from JSON content
```
async open(passportJson, password)
```
- **passportJson** (string) - the JSON string of an exported passport to load
- **password** (string) - the password used to unlock the private key of the passport

---

### save()
Exports and saves the passport to a JSON file on disk 
```
async save(filePath)
```
- **filePath** (string) - the file path to save the passport JSON file to

---

### export()
Retrieves a copy of the passport object with all unlocked wallets and non-exportable information removed
```
async export()
```

---

### addWallet()
Adds a new blockchain <a href='sdk-models-wallet'>Wallet</a> to the passport
```
async addWallet(network, password, privateKey)
```
- **network** (string) - the blockchain network of the wallet
- **password** (string) - the password to use to encrypt the private key / unlock the wallet
- **privateKey** (string) - if provided the wallet will be an imported blockchain wallet, otherwise a new private key is generated

---

### getWalletForNetwork()
Retrieves the <a href='sdk-models-wallet'>Wallet</a> for the specified network from the passport wallets
```
getWalletForNetwork(network)
```
- **network** (string) - the blockchain network to retrieve the <a href='sdk-models-wallet'>Wallet</a> for

---

### getWalletAddresses()
Retrieves a list of the passport addresses for the specified blockchain networks
```
getWalletAddresses(networks)
```
- **networks** (string[]) - the networks to retrieve blockchain addresses for

---

### getDecryptedClaim()
Retrives a decrypted <a href='sdk-models-claim'>Claim</a> from the passport claim packages collection
```
async getDecryptedClaim(claimTypeId, password)
```
- **claimTypeId** (string) - the type of the claim to retrieve from the passport collection
- **password** (string) - the password of the passport private key used to decrypt the claim package

---

### getDecryptedClaims()
Retrives multiple decrypted <a href='sdk-models-claim'>Claim</a> objects from the passport claim packages collection
```
async getDecryptedClaims(claimTypeIds, password)
```
- **claimTypeIds** (string[]) - the type of the claims to retrieve from the passport collection
- **password** (string) - the password of the passport private key used to decrypt the claim packages

---

### getClaimPackage()
Retrieves a claim package from the passport claim packages collection
```
getClaimPackage(claimTypeId)
```
- **claimTypeId** (string) - the type of the claim to retrieve from the passport collection

---

###  getClaimPackages()
Retrieves multiple claim packages from the claim packages collection
```
getClaimPackages(claimTypeIds)
```
- **claimTypeIds** (string[]) - the type of the claims to retrieve from the passport collection