---
id: sdk-services-blockchain
title: Blockchain
sidebar_label: Blockchain
---
Service to manage all Bridge Passport blockchain interaction with supported blockchains

## Functions
### publishPassport()
Publish the passport and wallet address combination to the blockhain using the Bridge Keyserver contract
```
async publishPassport(wallet, passport, costOnly)
```
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to use for publishing
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport to publish
- **costOnly** (bool) - if true, the estimated transaction cost is returned and the transaction is not relayed

---

### getAddressForPassport()
Retrieve the published blockchain address for the specified passport from the Bridge Keyserver contract
```
async getAddressForPassport(network, passportId)
```
- **network** (string) - the blockchain network to retrieve the address from
- **passportId** (string) - the passport id of the passport to retrieve the address for

---

### getPassportForAddress()
Retrieve the published passport id for the wallet blockchain address from the Bridge Keyserver contract
```
async getPassportForAddress(network, address)
```
- **network** (string) - the blockchain network to retrieve the passport id from
- **address** (string) - the blockchain address to retrieve the passport id for

---

### unpublishPassport()
Unpublish the passport and wallet address combination from the blockchain using the Bridge Keyserver contract
```
async unpublishPassport(passport, wallet, costOnly)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport to publish
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to use for publishing
- **costOnly** (bool) - if true, the estimated transaction cost is returned and the transaction is not relayed

---

### getBalances()
Retrieve BRDG token and related blockchain gas balances
```
async getBalances(network, address)
```
- **network** (string) - the blockchain network to retrieve balances from
- **address** (string) - the blockchain address to retrieve the balances for

---

### getRecentTransactions()
Retrieve recent BRDG token blockchain transactions
```
async getRecentTransactions(network, address) 
```
- **network** (string) - the blockchain network to retrieve the transactions from
- **address** (string) - the blockchain address to retrieve the transactions for

---

### sendPayment()
Send a BRDG token payment transaction
```
async sendPayment(wallet, amount, recipient, paymentIdentifier, wait, costOnly)
```
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to send payment from
- **amount** (int) - the amount of BRDG to send
- **recipient** (string) - the blockchain address to send payment to
- **paymentIdentifier** (string) - the unique identifier of the payment
- **wait** (bool) - whether or not to poll and wait for completion or immediately return the transmitted blockchain transaction id without waiting for completion
- **costOnly** (bool) - if true, the estimated transaction cost is returned and the transaction is not relayed

---

### verifyPayment()
Verify a BRDG token payment transaction info
```
async verifyPayment(network, hash, from, to, amount, paymentIdentifier)
```
- **network** (string) - the blockchain network to verify the payment from
- **hash** (string) - the unique blockchain hash / transaction identifier
- **from** (string) - the address the payment was sent from
- **to** (string) - the address the payment was sent to
- **amount** (int) - the amount of BRDG that was sent
- **paymentIdentifier** (string) - the unique identifier of the payment

---

### transferGas()
Send a blockchain gas transfer transaction
```
async transferGas(wallet, amount, recipient, paymentIdentifier, wait, costOnly)
```
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to send payment from
- **amount** (int) - the amount of BRDG to send
- **recipient** (string) - the blockchain address to send payment to
- **paymentIdentifier** (string) - the unique identifier of the payment
- **wait** (bool) - whether or not to poll and wait for completion or immediately return the transmitted blockchain transaction id without waiting for completion
- **costOnly** (bool) - if true, the estimated transaction cost is returned and the transaction is not relayed

---

### verifyGasTransfer()
Verify a blockchain gas transfer transaction
```
async verifyGasTransfer(network, hash, from, to, amount, paymentIdentifier)
```
- **network** (string) - the blockchain network to verify the payment from
- **hash** (string) - the unique blockchain hash / transaction identifier
- **from** (string) - the address the payment was sent from
- **to** (string) - the address the payment was sent to
- **amount** (int) - the amount of BRDG that was sent
- **paymentIdentifier** (string) - the unique identifier of the payment

---

### getTransactionStatus()
Retrieves the completion and success status of a blockchain transaction
```
async getTransactionStatus(network, hash)
```
- **network** (string) - the blockchain network to verify the payment from
- **hash** (string) - the unique blockchain hash / transaction identifier

---

### addClaim()
Publish a Bridge Verified claim to the blockhain using the Bridge Keyserver contract
```
async addClaim(passport, password, wallet, claim, hashOnly, costOnly) 
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport publishing the claim for Bridge Network API authentication
- **password** (string) - the password to unlock the private key of the passport adding the claim
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to use for adding the claim
- **hashOnly** (bool) - whether or not to publish a SHA256 hash representing the claim value instead of the actual claim value
- **costOnly** (bool) - if true, the estimated transaction cost is returned and the transaction is not relayed

---

### removeClaim()
Unpublish a Bridge Verified claim to the blockhain using the Bridge Keyserver contract
```
async removeClaim(wallet, claimTypeId, costOnly)
```
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to remove the claim from
- **claimtypeId** (string) - the claim type to remove
- **costOnly** (bool) - if true, the estimated transaction cost is returned and the transaction is not relayed

---

### getClaim()
Retrieve a published Bridge Verified claim from the blockhain using the Bridge Keyserver contract
```
async getClaim(network, claimTypeId, address) 
```
- **network** (string) - the blockchain network to retrieve the claim from
- **claimtypeId** (string) - the claim type to retrieve
- **address** (string) - the blockchain address to retrieve the claim for


