---
id: messaging-payment
title: Payment
sidebar_label: Payment
---

The payment protocol is used by a passport that wishes to request payments in BRDG token from another passport.

<img class='centered' src='/img/message-payment.jpg'></img>

---

## Creating a Payment Request
A passport can request payment from another passport by creating a payment request.
```
let wallet = passport.getWalletForNetwork(network);
let paymentRequest = await Bridge.Messaging.Payment.createPaymentRequest(passport, password, wallet.network, amount, wallet.address, paymentIdentifier);
```
- **wallet** - the blockchain wallet to request payment be sent to
- **paymentRequest** -  the payment request message to be sent to the target passport

---

## Receiving a Payment Request
The receiving passport will receive the payment request and verify the integrity of the message and the passport that sent the request.
```
let verifiedPaymentRequest = await Bridge.Messaging.Payment.verifyPaymentRequest(paymentRequest);
let passportDetails = await Bridge.Services.Passport.getDetails(passport, password, verifiedPaymentRequest.passportId);
```
- **paymentRequest** - the payment request message received from the sending passport
- **verifiedPaymentRequest** - the integrity verified data transmitted via the payment request message
- **passportDetails** - the information received from the Bridge Network about the passport that sent the request message

---

## Creating a Payment Response
The receiving passport will send the requested payment on the requested blockchain network and create a response message that includes the blockchain transaction information about the payment.
```
let wallet = passport.getWalletForNetwork(paymentRequest.network);
await wallet.unlock(password);
let transactionId = await Bridge.Services.Blockchain.sendPayment(wallet, paymentRequest.amount, paymentRequest.address, paymentRequest.identifier, false);
let paymentResponse = await Bridge.Messaging.Payment.createPaymentResponse(passport, password, paymentRequest.network, wallet.address, paymentRequest.amount, paymentRequest.address, paymentRequest.identifier, transactionId, targetPublicKey);
```
- **wallet** - the blockchain wallet to send payment from
- **transactionId** - the resulting transaction identifier for the blockchain payment transaction
- **paymentResponse** - the payment response message to be sent back to the sender to confirm the payment transaction

---

## Verifying a Payment Response
The passport that sent the payment request recieves the payment response and verifies the blockchain transaction information for the payment.
```
let verifiedPaymentResponse = await Bridge.Messaging.Payment.verifyPaymentResponse(passport, _password, paymentResponse);
let verifiedPayment = await Bridge.Services.Blockchain.verifyPayment(verifiedPaymentResponse.network, verifiedPaymentResponse.transactionId, verifiedPaymentResponse.from, verifiedPaymentResponse.address, verifiedPaymentResponse.amount, verifiedPaymentResponse.identifier);
```
- **paymentResponse** - the payment response message received from the sender
- **verifiedPaymentResponse** - the integrity verified data transmitted via the payment response message
- **verifiedPayment** - the verified payment info about the payment
