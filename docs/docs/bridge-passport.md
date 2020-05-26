---
id: bridge-passport
title: Bridge Passport
sidebar_label: Passport
---

The Bridge Passport is the container holds all of a user's keys, blockchain wallets, and claims to allow them to interact with the Bridge Network, Bridge Marketplace, other Bridge Passports, and multiple blockchains.

<img class='centered' src='/img/passport.png'></img>


- **Passport ID** - The ID of the passport (fingerprint of the public key)
- **Bridge Key** - The Public / Private key pair used for all Bridge Protocol signing and encryption
- **Blockchain Wallets** - The collection of blockchain wallets used for blockchain transactions
- **Claim Packages** - The collection of encrypted claim packages containing the claims for the passport

---

## Export and Backup
The Bridge Protocol can be exported to a JSON file to include all keys, blockchain wallets, and encrypted claims packages to provide portability and allow for backups.  When the passport is exported, all Bridge Protocol and blockchain wallet private keys are encrypted using the passphrase that was provided when the passport was created.  Claim packages are encrypted for the Bridge Passport by the original sender, so no additional encryption is necessary on export.

- **Id** - The unique identifier for the passport
- **Version** - The version of the Bridge Passport
- **Key** - Encrypted and exported as a Hex Encoded PGP Key
- **Wallets** - Blockchain Wallets for the Passport.
     - NEO - Key encrypted and exported as a NEP-2 Key
     - Ethereum - Key encrypted and exported as a v3 Keystore
- **Claims** - Encrypted Claim Packages

### File Format
```
{
  "id": "6e2aa1e196527ac3f1e23544bc1ab0cbb4d99ae6",
  "version": 1.1,
  "key": {
    "public": "2d2d2d2d2d424547494e20504750205055424c4943204b455920424c4f434b2d2d2d2d2d0a56657273696f6e3a204b657962617365204f70656e5047502076322e312e360a436f6d6d656e743a2068747470733a2f2f6b65796...",
    "private": "2d2d2d2d2d424547494e205047502050524956415445204b455920424c4f434b2d2d2d2d2d0a56657273696f6e3a204b657962617365204f70656e5047502076322e312e360a436f6d6d656e743a2068747470733a2f2f6b65..."
  },
  "wallets": [
    {
      "network": "NEO",
      "address": "AVnViid7Jm7ibakwewKBCBrAbrErpWFsRQ",
      "key": "6PYXVMqBRoTfvirVhFxSZhskfzbM3ERcqryHYu5uisDmcsDUAL1b9StBZ2"
    },
    {
      "network": "ETH",
      "address": "0x760e8e67f4e3b4cfab882bf778b9cfcb067d0d80",
      "key": {
        "version": 3,
        "id": "07731720-4608-42ce-a3bb-aa92eebfde9a",
        "address": "760e8e67f4e3b4cfab882bf778b9cfcb067d0d80",
        "crypto": {
          "ciphertext": "6cd0c73e04b1c652252c5f45e03aea5c53eea79503a97b5c383f463afa34c2e6",
          "cipherparams": {
            "iv": "5aa8571cbcd4926b7edc2bd2deb5058a"
          },
          "cipher": "aes-128-ctr",
          "kdf": "scrypt",
          "kdfparams": {
            "dklen": 32,
            "salt": "b1778086b6953b82d9c0552c40ff28ff013e1ef30d7f859229f9c75ea1b3171e",
            "n": 262144,
            "r": 8,
            "p": 1
          },
          "mac": "d846143daf8ead5f94a6bba9fa186a13b73ec949c7935d021bccb28c2f91f539"
        }
      }
    }
  ],
  "claims": [
    {
      "typeId": 3,
      "signedBy": "2d2d2d2d2d424547494e20504750205055424c4943204b455920424c4f434b2d2d2d2d2d0a56657273696f6e3a204b657962617365204f70656e5047502076322e312e360a436f6d6d656e743a2068747470733a2f2f6...",
      "claim": "2d2d2d2d2d424547494e20504750204d4553534147452d2d2d2d2d0a56657273696f6e3a204b657962617365204f70656e5047502076322e312e360a436f6d6d656e743a2068747470733a2f2f6b6579626173652e696f2f..."
    }
  ]
}
```
