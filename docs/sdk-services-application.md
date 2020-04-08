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
async createApplication(passport, passphrase, partner)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **partner** (string) - the passport id of the target partner

---

### getActiveApplications()
Retrieve all verification requests for the passport with an active status
```
async getActiveApplications(passport, passphrase)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key

---

### getAllApplications()
Retrieve all verification requests for the passport
```
async getAllApplications(passport, passphrase)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key

---

### getApplication()
Retrieve the full details of a specific verification request
```
async getApplication(passport, passphrase, applicationId)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **applicationId** (string) - unique identifier of the verification request

---

### getStatus()
Retrieves the status of a verification request
```
async getStatus(passport, passphrase, applicationId)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication, only required if useApi=true
- **passphrase** (string) - password used to unlock context passport private key, only required if useApi=true
- **applicationId** - the unique identifier of the verification request

---

### updatePaymentTransaction()
Updates an existing verification request with payment transaction information for network fee payment
```
async updatePaymentTransaction(passport, passphrase, applicationId, network, sender, transactionId)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **applicationId** (string) - the unique identifier of the verification request
- **network** (string) - the network payment was sent on
- **sender** (string) - the address the payment was sent from
- **transactionId** (string) - the blockchain transaction id of the payment

---

### retrySend()
Attempt to (re)send the verification request to the verifiation partner on the Bridge Network.  If a prior attempt has failed, this is used to re-attempt transmission.
```
async retrySend(passport, passphrase, applicationId)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **applicationId** - the unique identifier of the verification request