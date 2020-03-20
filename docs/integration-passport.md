---
id: integration-passport
title: Passport
sidebar_label: Passport
---
The passport endpoints expose all passport and peer-to-peer messaging functionality.

### GET /passport/id
Retrieves the passport id of the passport context the microservice is running under

---

### GET /passport/publicKey
Retrieves the passport public key of the passport context the microservice is running under

---

### POST /passport/idfromkey
Retrieves the passport id from any passport public key

##### Example Request:
```
{
    "publicKey":"2d2d2d2d2d424547494e20504750205055424c4943..."
}
```
- **publicKey** (string) - the passport public key to get the passport id from

---

### POST /passport/sign
Signs a message using the private key of the context passport
##### Example Request:
```
{
    "message":"test message here"
}
```
- **message** (string) - the message to be signed

---

### POST /passport/verify
Verifies that a message signature was signed by the public key
##### Example Request:
```
{
    "signature":"2d2d2d2d2d424547494e20504750204d4553534147...",
    "publicKey":"2d2d2d2d2d424547494e20504750205055424c4943..."
}
```
- **signature** (string) - the signature of the message
- **publicKey** (string) - the public key of the signing passport 

---

### POST /passport/verifyhash
Verifies the SHA256 hash of a message
##### Example Request:
```
{
    "message":"test message here",
    "hash":"81041617a8602dd32c003860b91d7677f5706f81b4af9e5e4a9204cb7d80f5b9"
}
```
- **message** (string) - the message to verify
- **hash** (string) - the hash of the message to verify

---

### POST /passport/encrypt
Encrypts a message using the private key of the context passport to be decrypted by the target public key
##### Example Request:
```
{ 
    "message":"test message here",
    "publicKey":"2d2d2d2d2d424547494e2050475020505542..."
}
```
- **message** (string) - the message to be encrypted
- **publicKey** (string) - the passport public key to encrypt the message for

---

### POST /passport/decrypt
Decrypts a message signed and encrypted by the public key using the private key of the context passport.
##### Example Request:
```
{
    "encrypted":"2d2d2d2d2d424547494e20504750204d4553...",
    "publicKey":"2d2d2d2d2d424547494e2050475020505542..."
}
```
- **encrypted** (string) - the encrypted message
- **publicKey** (string) - the passport public key of the passport that signed and encrypted the message

---

### POST /passport/requestclaimsimport
Creates a secure encrypted claims import request for a collection of claims for the target public key

##### Example Request:
```
{
    "claims":[{
        "claimTypeId":3,
        "claimValue":"someuser@bridgeprotocol.io",
        "createdOn":1551180491,
        "expiresOn":0
    }],
    "publicKey":"2d2d2d2d2d424547494e205047502050..."
}
```
- **claims** (claim[]) - the claims to be signed, encrypted, and included in the claims import request
- **publicKey** (string) - the public key of the passport to receive the claims import request
---

### POST /passport/requestauth
Creates a signed authentication request 
##### Example Request:
```
{
    "token":"12345",
    "claimTypes":["3"],
    "networks":[
        "neo",
        "eth"
    ]
}
```
- **token** (string) - unique token to be included in the response
- **claimTypes** (string[]) - the claim types to request from the target passport
- **networks** (string[]) - the networks to request the blockchain addresses of 

---

### POST /passport/verifyauth
Verifies a signed and encrypted authentication response received from a passport
##### Example Request:
```
{
    "response":"d72216034623462346234623462326433...",
    "token":"12345"
}
```
- **response** (string) - the authentication response received
- **token** (string) - the token included in the request used to verify the integrity of the response

##### Example Response:
```
{
    "passportId":"fc5fe52784bf7149648d87aa9f17aabff1c68a64",
    "publicKey":"2d2d2d2d2d424547494e205047502050...",
    "tokenVerified":true,
    "claims":[
        {
            "claimTypeId":3,
            "claimValue":"someuser@bridgeprotocol.io",
            "createdOn":1551180491,
            "expiresOn":0,
            "signedByKey":"2d2d2d2d2d424547494e20504750205055424...",
            "signature":"2d2d2d2d2d424547494e20504750204d4...",
            "signedById":"d7bc3488073454a6ce32b13a1e8cda6a8bddf16d",
            "signatureValid":true,
            "signedByPartner":true
        }
    ],
    "blockchainAddresses":[
        {
            "network":"NEO",
            "address":"AXbopuA5SPv5EVQP5REer4kdwMXpjRC7YQ"
        },
        {
            "network":"ETH",
            "address":"0x9375d3fb67bedfc27cb6cb9dd73ea8565427ca5b"
        }
    ]
}
```
- **passportId** (string) - passport id of the passport that sent the response
- **publicKey** (string) - public key of the passport that sent the response
- **tokenVerified** (bool) - whether or not the token in the response was valid
- **claims** (claim[]) - the claims sent in the response
- **blockchainAddresses** (address[]) -  the blockchain addresses sent in the response


---

### POST /passport/requestpayment
Creates a signed BRDG payment request
##### Example Request:
```
{
    "network":"neo",
    "amount":1,
    "address":"AXbopuA5SPv5EVQP5REer4kdwMXpjRC7YQ",
    "identifier":"12345"
}
```
- **network** (string) - the blockchain network to request payment on
- **amount** (int) - the amount to request
- **address** (string) - blockchain address to send the payment to
- **identifier** (string) - the unique identifier for the transaction
---

### POST /passport/verifypayment
Verifies a signed and encrypted BRDG payment response and returns the details of the payment
##### Example Request:
```
{
    "response":"d72216034623462346234623462326433..."
}
```
- **response** (string) - the payment response message sent by the passport the payment was requested from

##### Example Response:
```
{
    "network":"NEO",
    "from":"AXbopuA5SPv5EVQP5REer4kdwMXpjRC7YQ",
    "amount":1,
    "address":"AXbopuA5SPv5EVQP5REer4kdwMXpjRC7YQ",
    "identifier":"12345",
    "transactionId":"Transaction12345",
    "passportId":"fc5fe52784bf7149648d87aa9f17aabff1c68a64"
}
```
- **network** (string) - the blockchain network the payment was sent on
- **from** (string) - the address the payment was sent from
- **amount** (int) - the amount that was sent
- **address** (string) - the address the payment was sent to 
- **identifier** (string) - the unique identifier of the transaction from the request
- **transactionId** (string) - the blockchain transaction identifier
- **passportId** (string) - the passport id of the passport that sent the payment

