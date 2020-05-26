---
id: sdk-services-tokenswap
title: Token Swap
sidebar_label: Token Swap
---
Service to retrieve the status of Token Swaps received by the Bridge Network

## Functions
### createTokenSwap()
Create a new token swap request for the passport
```
async createTokenSwap(passport, passphrase, network, address, recipientAddress, amount)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **network** (string) - the blockchain network the tokens will be swapped from
- **address** (string) - the bloockchain address the swap will be sent from
- **recipientAddress** (string) - the blockcahin address the swapped tokens will be sent to
- **amount** (decimal) - the amount of BRDG token to be swapped

---

### getTokenSwapList()
Retrieve all token swaps for the passport
```
async getTokenSwapList(passport, passphrase)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key

---

### getPendingTokenSwapList()
Retrieve all pending token swaps for the passport
```
async getPendingTokenSwapList(passport, passphrase)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key

---

### getTokenSwap()
Retrieve the full details of a specific token swap
```
async getTokenSwap(passport, passphrase, id)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **id** (string) - unique identifier of the token swap

---

### updatePaymentTransaction()
Updates an existing token swap request with the BRDG transfer transaction information and gas prepayment (if required)
```
async updatePaymentTransaction(passport, passphrase, id, transactionId, gasTransactionId)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **id** (string) - the unique identifier of the token swap
- **transactionId** (string) - the blockchain transaction id of the BRDG token transfer to the swap address
- **gasTransactionId** (string) - the blockchain gas prepayment transaction id (only required if transferring from NEO to Ethereum)

---

### retry()
Attempt to (re)process a token swap that is waiting for a transaction
```
async retry(passport, passphrase, id)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>) - passport context used for API authentication
- **passphrase** (string) - password used to unlock context passport private key
- **id** - the unique identifier of token swap