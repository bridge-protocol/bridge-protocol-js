---
id: sdk-services-profile
title: Profile
sidebar_label: Profile 
---
Service to retrieve the Bridge Network known claim profile types.  Profile types are used for convenience by network partners to define a group of claim types used for a specific purpose - ie: KYC, AML.
## Functions
### getAllTypes()
Retrieve all known profile types on the Bridge Network
```
async getAllProfileTypes(useApi, passport, passphrase)
```
- **useApi** (bool) - whether or not to use the local constants or retrieve from Bridge Network API
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication, only required if useApi=true
- **passphrase** (string) - password used to unlock context passport private key, only required if useApi=true

---

### getType()
Retrieve specific known profile type definition
```
async getProfileType(profileTypeId, useApi, passport, passphrase)
```
- **useApi** (bool) - whether or not to use the local constants or retrieve from Bridge Network API
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication, only required if useApi=true
- **passphrase** (string) - password used to unlock context passport private key, only required if useApi=true