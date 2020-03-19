const _crypto = require('../utils/crypto').Crypto;
const _claimPackage = require('./claimPackage');

var claim = class Claim
{
    constructor(claim){
        this._reset();

        if(claim)
            this._load(claim);
    };

    get isExpired(){
        if(this.expiresOn == null){
            throw new Error("expiration not set");
        }

        //Never expires
        if(this.expiresOn === 0){
            return false;
        }
        
        let now = Math.floor(new Date() / 1000);
        return now >= this.expiresOn;
    }

    get isValid(){
        return this._verify();
    }

    async encrypt(targetPublicKey, passportPrivateKey, password){
        let targetPassportId = await _crypto.getPassportIdForPublicKey(targetPublicKey);
        console.log(`encrypting claim for ${targetPassportId}`);

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
        console.log(`loading claim ${claimPackage.typeId} from claim package`);
        if(!claimPackage)
            throw new Error("claim package not provided");

        let decrypted = await claimPackage.decrypt(privateKey, password);
        this._load(decrypted);
    }

    async getSignatureString(passportId){
        console.log(`getting signature string for ${passportId}`);
        if(!this._verify()){
            throw new Error("cannot get signature string: invalid or missing claim data.");
        }

        let signedById = await _crypto.getPassportIdForPublicKey(this.signedByKey);
        return passportId + this.claimTypeId + this.claimValue + this.createdOn + this.expiresOn + signedById;
    }

    async verifySignature(passportId){
        console.log(`verifying signature for claim ${this.typeId}`);
        if(!passportId){
            throw new Error("passportId not provided");
        }

        try
        {
            let signatureString = await this.getSignatureString(passportId);
            let message = await _crypto.verifySignedMessage(this.signature, this.signedByKey);
            if(signatureString != message)
                return false;
            
            return message;
        }
        catch(err){
            console.log("error verifying claim signature: " + err.message);
        }
        
        return false;
    }

    async _load(claim){
        if(!claim )
            throw new Error("invalid or missing claim data.");

        this.claimTypeId = claim.claimTypeId;
        this.claimValue = claim.claimValue;
        this.createdOn = claim.createdOn;
        this.expiresOn = claim.expiresOn;
        this.signedByKey = claim.signedByKey;
        this.signature = claim.signature;

        if(!this._verify()){
            this._reset();
            throw new Error("invalid or missing claim data.");
        }
            
    }

    _verify()
    {
        if(this.claimTypeId &&
            this.claimValue &&
            this.createdOn &&
            this.expiresOn != null){
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