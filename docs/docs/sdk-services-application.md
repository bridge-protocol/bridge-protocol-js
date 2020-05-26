---
id: sdk-services-application
title: Application
sidebar_label: Application
---
Service to manage the lifecycle of verification requests on the Bridge Network

## Functions
### createApplication()
Create a new verification request for the passport with a specified partner
```
async createApplication(passport, passphrase, partner, network, address)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **partner** (string) - the passport id of the target partner,
- **network** (string) - the blockchain network to pay network fees on
- **address** (string) - the bloockchain address fees will be paid from

---

### getApplicationList()
Retrieve all verification requests for the passport
```
async getApplicationList(passport, passphrase)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key

---

### getApplication()
Retrieve the full details of a specific verification request
```
async getApplication(passport, passphrase, id)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **id** (string) - unique identifier of the verification request

---

### updatePaymentTransaction()
Updates an existing verification request with payment transaction information for network fee payment
```
async updatePaymentTransaction(passport, passphrase, id, transactionId)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **id** (string) - the unique identifier of the verification request
- **transactionId** (string) - the blockchain transaction id of the payment

---

### retry()
Attempt to (re)process and send the verification request to the verifiation partner on the Bridge Network.  If a prior attempt has failed, this is used to re-attempt transmission.
```
async retry(passport, passphrase, id)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **id** - the unique identifier of the verification request