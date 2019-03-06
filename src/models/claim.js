const _cryptoUtility = require('../utils/crypto');

var claim = class Claim
{
    constructor(claim){
        this._reset();

        if(claim)
            this._load(claim);
    };

    get isExpired(){
        if(!this.expiresOn){
            throw new Error("Expiration not set.");
        }

        //Never expires
        if(this.expiresOn == 0){
            return false;
        }
        
        let now = Math.floor(new Date() / 1000);
        return now >= this.expiresOn;
    }

    async getSignatureString(passportId){
        if(!this._verify()){
            throw new Error("Cannot get signature string: Invalid or missing claim data.");
        }

        let signedById = await _cryptoUtility.CryptoUtility.getPassportIdForPublicKey(this.signedByKey);
        
        return passportId + this.claimTypeId + this.claimValue + this.createdOn + this.expiresOn + signedById;
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
            this.expiresOn &&
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