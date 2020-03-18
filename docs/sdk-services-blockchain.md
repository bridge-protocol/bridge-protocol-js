---
id: sdk-services-blockchain
title: Blockchain
sidebar_label: Blockchain
---
Service to manage all Bridge Passport blockchain interaction with supported blockchains

## Functions
### publishPassport()
```
async publishPassport(wallet, passport)
```

### getAddressForPassport()
```
async getAddressForPassport(network, passportId)
```

### getPassportForAddress()
```
async getPassportForAddress(network, address)
```

### unpublishPassport()
```
async unpublishPassport(passport, wallet)
```

### getBalances()
```
async getBalances(network, address)
```

### getRecentTransactions()
```
async getRecentTransactions(network, address) 
```

### sendPayment()
```
async sendPayment(wallet, amount, recipient, paymentIdentifier, wait)
```

### verifyPayment()
```
async verifyPayment(network, hash, from, to, amount, paymentIdentifier)
```

### addClaim()
```
async addClaim(passport, password, wallet, claim, hashOnly) 
```

### removeClaim()
```
async removeClaim(wallet, claimTypeId)
```

### approveClaimPublish()
```
async approveClaimPublish(wallet, address, claim, hashOnly)
```

### getClaim()
```
async getClaim(network, claimTypeId, address) 
```


