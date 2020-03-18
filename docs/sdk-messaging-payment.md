---
id: sdk-messaging-payment
title: Payment
sidebar_label: Payment 
---
Implements the payment request / response protocol to facilitate blockchain BRDG payments between passports.

## Functions
### createPaymentRequest()
Create a signed payment request to be sent to the target passport
```
async createPaymentRequest(passport, password, network, amount, address, identifier)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>[]) - the passport being used to create and sign the payment request
- **password** (string) - the password used to unlock the private key of the creating passport
- **network** (string) - the blockchain to request BRDG payment on
- **amount** (int) - the amount in BRDG to request
- **address** (string) - the address to send payment to
- **identifier** (string) - a unique identifier of the payment to asynchronously verify the payment once it has been committed to the blockchain

### createPaymentResponse()
Create an encrypted payment response to be sent back to the sending passport
```
async createPaymentResponse(passport, password, network, from, amount, address, identifier, transactionId, targetPublicKey)
```
- **passport** ((<a href='sdk-models-passport'>Passport</a>[])) - the passport used to send the payment
- **password** (string) - the password used to unlock the private key of the sending passport
- **network** (string) - the blockchain payment was sent on
- **from** (string) - the address payment was sent from
- **amount** (int) - the amount of BRDG sent
- **address** (string) - the address payment was sent to
- **identifier** (string) - a unique identifier of the payment to asynchronously verify the payment once it has been committed to the blockchain
- **transactionId** (string) - the resulting blockchain transaction id of the payment
- **targetPublicKey** (string) - the public key of the passport that sent the payment request

### verifyPaymentRequest()
Verify a signed payment request received by a sending passport
```
async verifyPaymentRequest(message)
```
- **message** (string) - the received signed payment request message

### verifyPaymentResponse()
Verify the encrypted payment response received from the target passport
```
async verifyPaymentResponse(passport, password, message)
```
- **passport** (<a href='sdk-models-passport'>Passport</a>[]) - the passport that sent the payment request
- **password** (string) - the password to unlock the passport that sent the payment request
- **message** (string) - the received encrypted payment response message
