---
id: sdk-services-claim
title: Claim
sidebar_label: Claim 
---
Service used to retrieve the Bridge Network known claim types

## Functions
### getAllTypes()
Retrieve all the known defined claim types for the Bridge Network
```
async getAllTypes(useApi, passport, passphrase)
```
- **useApi** (bool) - whether or not to use the local constants or retrieve from Bridge Network API
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication, only required if useApi=true
- **passphrase** (string) - password used to unlock context passport private key, only required if useApi=true

---

### getType()
Retrieve the specified known claim type definition
```
async getType(claimTypeId, useApi, passport, passphrase)
```
- **claimTypeId** (string) - the claim type definition to retrieve
- **useApi** (bool) - whether or not to use the local constants or retrieve from Bridge Network API
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication, only required if useApi=true
- **passphrase** (string) - password used to unlock context passport private key, only required if useApi=true

---

### getClaimPublishList()
Gets a list of all claim publishing requests for the passport
```
async getClaimPublishList(passport, passphrase)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key

---

### getPendingClaimPublishList()
Gets a list of all pending claim publishing requests for the passport
```
async getPendingClaimPublishList(passport, passphrase)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key

---

### getClaimPublish()
Gets the details of a specific claim publish request
```
async getClaimPublish(passport, passphrase, id)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **id** (string) - the identifier of the claim publish request to retrieve the details for
---

### createClaimPublish()
Create a new claim publish request for the passport
```
async createClaimPublish(passport, passphrase, network, address, claim, hashOnly)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **network** (string) - the blockchain network the claim will be published on
- **address** (string) - the bloockchain address the claim will be published for
- **claim** (<a href='sdk-models-claim'>Claim</a>) - the claim to be published
- **hashOnly** (bool) - whether or not to just publish the hash of the value to the blockchain

---

### updateClaimPaymentTransaction()
Create a new claim publish request for the passport
```
async updateClaimPaymentTransaction(passport, passphrase, id, transactionId, gasTransactionId)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **id** (string) - the identifier of the claim publish request to update
- **transactionId** (string) - the bloockchain transaction of the BRDG payment transaction
- **gasTransactionId** (string) - the blockchain transaction of the gas prepayment transaction (Ethereum only)
---

### getClaimPublishTransaction()
Retrieves the signed transaction of the verified claim to be signed and relayed by the end user for publish (NEO only)
```
async getClaimPublishTransaction(passport, passphrase, id)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **id** (string) - the identifier of the claim publish request to update
---

### retry()
Attempt to (re)process a claim publish request that is waiting for a transaction
```
async retry(passport, passphrase, id)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **id** (string) - the identifier of the claim publish request to update
---

### completed()
Sets the claim publish status to complete after the transaction has been successfully relayed and verified (NEO only)
```
async completed(passport, passphrase, id)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **id** (string) - the identifier of the claim publish request to update
---