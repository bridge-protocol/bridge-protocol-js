---
id: sdk-services-bridge
title: Bridge
sidebar_label: Bridge 
---

Service used to retrieve Bridge Protocol Corporation information from the Bridge Network
## Functions
### getBridgePassportId()
Retrieve the Bridge Network Passport Id
```
async getBridgePassportId(useApi, passport, passphrase)
```
- **useApi** (bool) - whether or not to use the local constants or retrieve from Bridge Network API
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication, only required if useApi=true
- **passphrase** (string) - password used to unlock context passport private key, only required if useApi=true

---

### getBridgePublicKey()
Retrieve the Bridge Network Public Key
```
async getBridgePublicKey(useApi, passport, passphrase)
```
- **useApi** (bool) - whether or not to use the local constants or retrieve from Bridge Network API
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication, only required if useApi=true
- **passphrase** (string) - password used to unlock context passport private key, only required if useApi=true

---

### getBridgeNetworkFee()
Retrieve the Bridge Network Fee
```
async getBridgeNetworkFee(passport, passphrase)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key