---
id: sdk-models-wallet
title: Wallet
sidebar_label: Wallet
---
The wallet represents a blockchain wallet used for blockchain transactions.

## Constructor
**Wallet(** network, address, key **)**

## Properties
- **network** (string) - the blockchain network of the wallet
- **address** (string) - the blockchain address of the wallet
- **key** (object) - the encrypted key of the wallet (NEP-2 for NEO, v3 Keystore for Ethereum)
- **unlocked** (object) - the unlocked wallet object (if unlocked, null if unlocked)
- **privateKey** (string) - shortcut to return the private key string of an unlocked wallet

## Functions

### create()
Creates or imports a wallet for the specified blockchain with a private key encrypted using the password
```
async create(password, privateKey)
```
- **password** (string) - the password used to encrypt and decrypt the private key
- **privateKey** (string) - if provided the wallet will be an imported blockchain wallet, otherwise a new private key is generated

### unlock()
Unlocks the wallet / private key with the specified password.  If successful, the unlocked property is set to the unlocked wallet object.

```
async unlock(password)
```

- **password** - the password to unlock the private key / wallet

### export()
Returns a secure representation of the wallet with the unlocked wallet / private key excluded.
```
export()
```

