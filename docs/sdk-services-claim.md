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

### getType()
Retrieve the specified known claim type definition
```
async getType(claimTypeId, useApi, passport, passphrase)
```
- **claimTypeId** (string) - the claim type definition to retrieve
- **useApi** (bool) - whether or not to use the local constants or retrieve from Bridge Network API
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication, only required if useApi=true
- **passphrase** (string) - password used to unlock context passport private key, only required if useApi=true