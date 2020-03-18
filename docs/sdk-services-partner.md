---
id: sdk-services-partner
title: Partner
sidebar_label: Partner 
---

Service used to retrieve the Bridge Network known network partner passports

## Functions
### getAllPartners()
Retrieve all known partners on the Bridge Network
```
async getAllPartners(useApi, passport, passphrase)
```
- **useApi** (bool) - whether or not to use the local constants or retrieve from Bridge Network API
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication, only required if useApi=true
- **passphrase** (string) - password used to unlock context passport private key, only required if useApi=true

### getPartner()
Retrieve specified known partner information
```
async getPartner(partnerId, useApi, passport, passphrase)
```
- **partnerId** (string) - the passport id of the partner
- **useApi** (bool) - whether or not to use the local constants or retrieve from Bridge Network API
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication, only required if useApi=true
- **passphrase** (string) - password used to unlock context passport private key, only required if useApi=true

