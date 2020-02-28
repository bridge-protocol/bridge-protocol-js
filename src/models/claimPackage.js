const _crypto = require('../utils/crypto').Crypto;
const _claim = require('./claim');

var claimPackage = class ClaimPackage {
    constructor(typeId, signedBy, claim){
        this.typeId = typeId;
        this.signedBy = signedBy;
        this.claim = claim;
    };

    async decrypt(privateKey, password){
        let claimString = await _crypto.decryptMessage(this.claim, this.signedBy, privateKey, password);
        let claim = JSON.parse(claimString);
        return new _claim.Claim(claim);
    }
}

exports.ClaimPackage = claimPackage;