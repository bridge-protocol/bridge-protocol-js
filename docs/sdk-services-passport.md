---
id: sdk-services-passport
title: Passport
sidebar_label: Passport
---
Service used to retrieve information about a passport from the Bridge Network
## Functions
### getDetails()
Retrieve the details about a specified passport
```
async getDetails(passport, passphrase, passportId)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **passportId** (string) - the passport id to request information about
