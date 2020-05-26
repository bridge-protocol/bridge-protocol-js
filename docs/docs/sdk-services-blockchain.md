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
- **wait** (bool) - wait for the transaction to complete
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
async unpublishPassport(passport, wallet, wait, costOnly)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport to publish
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to use for publishing
- **wait** (bool) - wait for the transaction to complete
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
- **amount** (decimal) - the amount of BRDG to send
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
- **amount** (decimal) - the amount of BRDG that was sent
- **paymentIdentifier** (string) - the unique identifier of the payment

---


### getOracleGasPrice()
Retrieves the current oracle recommended gas price for the blockchain
```
async getOracleGasPrice(network)
```
- **network** (string) - the blockchain network to get the price for
---

### transferGas()
Send a blockchain gas transfer transaction
```
async transferGas(wallet, amount, recipient, paymentIdentifier, wait, costOnly)
```
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to send payment from
- **amount** (decimal) - the amount of BRDG to send
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
- **amount** (decimal) - the amount of BRDG that was sent
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

### pollTransactionComplete()
Polls for the status for a blockchain transaction
```
async pollTransactionComplete(network, txid)
```
- **network** (string) - the blockchain network of the transaction
- **txid** (string) - the blockchain transaction id to poll
---

### removeClaim()
Unpublish a Bridge Verified claim to the blockhain using the Bridge Keyserver contract
```
async removeClaim(wallet, claimTypeId, wait, costOnly)
```
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to remove the claim from
- **claimtypeId** (string) - the claim type to remove
- **wait** (bool) - wait for the transaction to complete
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

---

### sendApplicationRequest()
Sends the required network fees and creates a verification request for the specified partner
```
async sendApplicationRequest(passport, password, wallet, partnerId, costOnly)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport publishing the claim for Bridge Network API authentication
- **password** (string) - the password to unlock the private key of the passport adding the claim
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet that the tokens will be swapped from
- **partnerId** string - the Bridge Marketplace partner to create the request with
- **costOnly** (bool) - if true, the estimated transaction cost is returned and the transaction is not relayed

---

### sendTokenSwapRequest()
Sends the required fees and the token swap request transaction to swap tokens across NEO and Ethereum
```
async sendTokenSwapRequest(passport, password, wallet, receivingWallet, amount, costOnly)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport publishing the claim for Bridge Network API authentication
- **password** (string) - the password to unlock the private key of the passport adding the claim
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet that the tokens will be swapped from
- **receivingWallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet that will receive the swapped tokens
- **amount** (decimal) - the number of tokens to be swapped
- **costOnly** (bool) - if true, the estimated transaction cost is returned and the transaction is not relayed

---

### sendPassportPublishRequest()
Sends the request to publish a passport on the specified blockchain
```
async sendPassportPublishRequest(passport, password, wallet, costOnly)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport publishing the claim for Bridge Network API authentication
- **password** (string) - the password to unlock the private key of the passport adding the claim
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to use for adding the claim
- **costOnly** (bool) - if true, the estimated transaction cost is returned and the transaction is not relayed

---

### sendClaimPublishRequest()
Sends the required publish and fee transactions and notifies the Bridge Network of the claim publish request to be verified and published.
```
async sendClaimPublishRequest(passport, wallet, claim, hashOnly, costOnly)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport publishing the claim for Bridge Network API authentication
- **password** (string) - the password to unlock the private key of the passport adding the claim
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to use for adding the claim
- **claim** (<a href='sdk-models-claim'>Claim</a>) - the claim to publish
- **hashOnly** (bool) - publish the hash of the value of the claim only
- **costOnly** (bool) - if true, the estimated transaction cost is returned and the transaction is not relayed

---

### publishClaimTransaction()
Publishes the claim transaction to the blockchain.  For NEO this signs and publishes the preapproved publish transaction, for Ethereum this publishes the initial unverified claim that would later be approved by Bridge in a separate transaction.
```
async publishClaimTransaction(passport, password, wallet, claim, hashOnly, claimPublishId, wait, costOnly)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport publishing the claim for Bridge Network API authentication
- **password** (string) - the password to unlock the private key of the passport adding the claim
- **wallet** (<a href='sdk-models-wallet'>Wallet</a>) - blockchain wallet to use for adding the claim
- **claim** (<a href='sdk-models-claim'>Claim</a>) - the claim to publish
- **hashOnly** (bool) - publish the hash of the value of the claim only
- **claimPublishId** (string) - the claim publish identifier of the request received from the Bridge network
- **wait** (bool) - if true, wait for the transaction to complete on the blockchain, otherwise return the hash
- **costOnly** (bool) - if true, the estimated transaction cost is returned and the transaction is not relayed

---

### getOracleGasPrice()
Retrieve the oracle gas price from the specified blockchain network
```
async getOracleGasPrice(network)
```
- **network** (string) - the blockchain network to retrieve the gas price from



