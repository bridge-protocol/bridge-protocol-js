const _crypto = require('../utils/crypto').Crypto;
const _claim = require('./claim');

var claimPackage = class ClaimPackage {
    constructor(typeId, signedBy, claim){
        if(typeId && signedBy && claim)
            this._load(typeId, signedBy, claim);
    };

    async fromClaim(claim, targetPublicKey, passportPublicKey, passportPrivateKey, password){
        let targetPassportId = await _crypto.getPassportIdForPublicKey(targetPublicKey);
        console.log(`saving claim ${claim.claimTypeId} to claim package for ${targetPassportId}`);

        if(!claim.claimTypeId || !claim.claimValue)
            throw new Error("invalid or missing claim data");

        claim.signedByKey = passportPublicKey;
        let passportId = await _crypto.getPassportIdForPublicKey(targetPublicKey);
        let signatureString = await claim.getSignatureString(passportId);
        claim.signature = await _crypto.signMessage(signatureString, passportPrivateKey, password, true);
        let encryptedClaim = await claim.encrypt(targetPublicKey, passportPrivateKey, password);
        this._load(claim.claimTypeId, passportPublicKey, encryptedClaim);
    }

    async decrypt(privateKey, password){
        console.log(`decrypting claim package ${this.typeId}`);
        let claimString = await _crypto.decryptMessage(this.claim, this.signedBy, privateKey, password);
        let claim = JSON.parse(claimString);
        return new _claim.Claim(claim);
    }

    _load(typeId, signedBy, claim){
        if(!typeId || !signedBy || !claim)
            throw new Error("Invalid claim package data");

        this.typeId = typeId;
        this.signedBy = signedBy;
        this.claim = claim;
    }
}

exports.ClaimPackage = claimPackage;