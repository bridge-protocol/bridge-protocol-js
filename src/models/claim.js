const _crypto = require('../utils/crypto').Crypto;
const _claimPackage = require('./claimPackage');

var claim = class Claim
{
    constructor(claim){
        this._reset();

        if(claim)
            this._load(claim);
    };

    get expired(){
        if(this.expiresOn == null){
            throw new Error("Expiration not set.");
        }

        //Never expires
        if(this.expiresOn === 0){
            return false;
        }
        
        let now = Math.floor(new Date() / 1000);
        return now >= this.expiresOn;
    }

    async encrypt(targetPublicKey, passportPrivateKey, password){
        if(!targetPublicKey)
            throw new Error("target public key not provided");
        if(!passportPrivateKey)
            throw new Error("passport private key not provided");
        if(!password)
            throw new Error("password not provided");

        let claimString = JSON.stringify(this);
        return await _crypto.encryptMessage(claimString, targetPublicKey, passportPrivateKey, password, true);
    }
 
    async fromClaimPackage(claimPackage, privateKey, password){
        if(!claimPackage)
            throw new Error("claim package not provided");

        let decrypted = claimPackage.decrypt(claimPackage, privateKey, password);
        this._load(decrypted);
    }

    async toClaimPackage(targetPublicKey, passportPublicKey, passportPrivateKey, password){
        if(!this.claimTypeId || !this.claimValue)
            throw new Error("invalid or missing claim data");

        //Set the signing context
        claim.signedByKey = passportPublicKey;
        let passportId = await _crypto.getPassportIdForPublicKey(targetPublicKey);
        let signatureString = await this.getSignatureString(passportId);
        claim.signature = await _crypto.signMessage(signatureString, passportPrivateKey, password, true);
        let encryptedClaim = await this.encrypt(targetPublicKey, passportPrivateKey, password);
        return new _claimPackage.ClaimPackage(this.claimTypeId, passportPublicKey, encryptedClaim);
    }

    async getSignatureString(passportId){
        if(!this._verify()){
            throw new Error("Cannot get signature string: Invalid or missing claim data.");
        }

        let signedById = await _crypto.getPassportIdForPublicKey(this.signedByKey);
        return passportId + this.claimTypeId + this.claimValue + this.createdOn + this.expiresOn + signedById;
    }

    async verifySignature(passportId){
        if(!passportId){
            throw new Error("passportId not provided");
        }

        try
        {
            let signatureString = await claim.getSignatureString(passportId);
            let message = await _crypto.verifySignedMessage(this.signature, this.signedByKey);
            if(signatureString != message)
                return false;
            
            return message;
        }
        catch(err){
            console.log("Error verifying claim signature: " + err.message);
        }
        
        return false;
    }

    async _load(claim){
        if(!claim )
            throw new Error("Invalid or missing claim data.");

        this.claimTypeId = claim.claimTypeId;
        this.claimValue = claim.claimValue;
        this.createdOn = claim.createdOn;
        this.expiresOn = claim.expiresOn;
        this.signedByKey = claim.signedByKey;
        this.signature = claim.signature;

        if(!this._verify()){
            this._reset();
            throw new Error("Invalid or missing claim data.");
        }
            
    }

    _verify()
    {
        if(this.claimTypeId &&
            this.claimValue &&
            this.createdOn &&
            this.expiresOn != null &&
            this.signedByKey){
            return true;
        }

        return false;
    }

    _reset(){
        this.claimTypeId = null;
        this.claimValue = null;
        this.createdOn = null;
        this.expiresOn = null;
        this.signedByKey = null;
        this.signature = null;
    }
};

exports.Claim = claim;