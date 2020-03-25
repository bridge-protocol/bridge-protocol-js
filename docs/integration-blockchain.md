---
id: integration-blockchain
title: Blockchain
sidebar_label: Blockchain
---
The blockchain endpoints exposes blockchain functionality to verify payment and approve Bridge Verified Claim publish transactions (Bridge only)


### POST /blockchain/walletaddress
Get the blockchain address for the specified network that the service context is running under

##### Example Request:
```
{
    "network":"NEO",
}
```
- **network** (string) - the blockchain network of the wallet


### POST /blockchain/sendpayment
Send a BRDG token payment transaction on the blockchain

##### Example Request:
```
{
    "network":"NEO",
    "to":"AXbopuA5SPv5EVQP5REer4kdwMXpjRC7YQ",
    "amount":1,
    "identifier":"12345"
}
```
- **network** (string) - the blockchain network of the payment
- **to** (string) - the blockchain address the payment is to be sent to
- **amount** (int) - the payment amount
- **identifier** (string) - the unique identifier of the transaction


### POST /blockchain/verifypayment
Verify a BRDG token payment transaction on the blockchain

##### Example Request:
```
{
    "network":"NEO",
    "txid":"12345",
    "from":"AXbopuA5SPv5EVQP5REer4kdwMXpjRC7YQ",
    "to":"AXbopuA5SPv5EVQP5REer4kdwMXpjRC7YQ",
    "amount":1,
    "identifier":"12345"
}
```
- **network** (string) - the blockchain network of the payment
- **txid** (string) - the blockchain unique transaction id
- **from** (string) - the blockchain address the payment was sent from
- **to** (string) - the blockchain address the payment was sent to
- **amount** (int) - the payment amount
- **identifier** (string) - the unique identifier of the transaction

##### Example Response:
```
{
    "complete":false,
    "success":false
}
```
- **complete** (bool) - whether or not the transaction is finalized on the blockchain
- **success** (bool) - whether or not the transaction was completed and all provided information was verified


---

### POST /blockchain/createclaimpublish
Create a dual-sign verified claim publish transaction to allow publish a claim in the Bridge Keyserver Contract on NEO.  

##### Example Request:
```
{
    "network":"NEO",
    "passportId":"fc5fe52784bf7149648d87aa9f17aabff1c68a64",
    "address":"AXbopuA5SPv5EVQP5REer4kdwMXpjRC7YQ",
    "claim":{
        "claimTypeId":3,
        "claimValue":"someuser@bridgeprotocol.io",
        "createdOn":1551180491,
        "expiresOn\:0,
        "signedByKey":"2d2d2d2d2d424547494e20504750205055424...","signature":"2d2d2d2d2d424547494e20504750204d4553534..."
    }
}
```
**NOTE: Only Bridge admin blockchain addresses can sign this transaction or the smart contract execution will fail**


---

### POST /blockchain/approveclaimpublish
Approve the publishing of a verified claim in the Bridge Keyserver Contract on Ethereum. 

##### Example Request:
```
{
    "network":"ETH",
    "passportId":"fc5fe52784bf7149648d87aa9f17aabff1c68a64",
    "address":"0x5D78C013E5D3fe491f1D26650F4Eb9cb650d3c0F",
    "claim":{
        "claimTypeId":3,
        "claimValue":"someuser@bridgeprotocol.io",
        "createdOn":1551180491,
        "expiresOn\:0,
        "signedByKey":"2d2d2d2d2d424547494e20504750205055424...","signature":"2d2d2d2d2d424547494e20504750204d4553534..."
    }
}
```
**NOTE: Only Bridge admin blockchain addresses can sign this transaction or the smart contract execution will fail**