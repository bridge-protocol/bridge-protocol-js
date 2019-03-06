const _cryptoUtility = require('../utils/crypto');
const _claimApi = require('../api/claim');
const _claim = require('../models/claim');

var claimUtility = class ClaimUtility{
    constructor(apiBaseUrl, passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
        this._cryptoHelper = _cryptoUtility.CryptoUtility;
        this._claimService = new _claimApi.ClaimApi(apiBaseUrl, passport, passphrase);
    }

    async getAllClaimTypes(){
        return await this._claimService.getAllTypes();
    }

    async getClaimType(claimTypeId){
        return await this._claimService.getType(claimTypeId);
    }

    getClaimObject(claim){
        return new _claim.Claim(claim);
    }

    async createClaimPackages(publicKey, claims){
        if(!publicKey){
            throw new Error("publicKey not provided");
        }
        if (!claims || claims.length == 0){
            throw new Error("invalid or missing claim");
        }

        let claimPackages = new Array();
        for(let i=0; i<claims.length; i++){
            let claimPackage = await this.createClaimPackage(publicKey, claims[i]);
            if(claimPackage){
                claimPackages.push(claimPackage);
            }
        }
        return claimPackages;
    };

    async createClaimPackage(publicKey, claim) {
        if(!publicKey){
            throw new Error("publicKey not provided");
        }
        if (!claim || !claim.claimTypeId || !claim.claimValue){
            throw new Error("invalid or missing claim");
        }
            
        //Set the signing context
        claim.signedByKey = this._passport.publicKey;

        //Validate the claim structure and get the signature string
        let unpackedClaim = new _claim.Claim(claim);
        let passportId = await _cryptoUtility.CryptoUtility.getPassportIdForPublicKey(publicKey);
        let signatureString = await unpackedClaim.getSignatureString(passportId);

        //Sign the signature string and encrypt the claim
        claim.signature = await this._cryptoHelper.signMessage(signatureString, this._passport.privateKey, this._passphrase, true);
        let encryptedClaim = await this._cryptoHelper.encryptMessage(JSON.stringify(claim), publicKey, this._passport.privateKey, this._passphrase, true);

        return {
            typeId: claim.claimTypeId,
            signedBy: this._passport.publicKey,
            claim: encryptedClaim
        };
    }

    async decryptClaimPackages(claimPackages){
        if(!claimPackages || claimPackages.length == 0){
            throw new Error("invalid or missing claim packages");
        }

        let packages = new Array();
        for(let i=0; i<claimPackages.length; i++){
            let decrypted = await this.decryptClaimPackage(claimPackages[i]);
            if(decrypted)
                packages.push(decrypted);
        }
        return packages;
    }

    async decryptClaimPackage(claimPackage){
        if(!claimPackage){
            throw new Error("claimPackage not provided");
        }

        try{
            let claimString = await this._cryptoHelper.decryptMessage(claimPackage.claim, claimPackage.signedBy, this._passport.privateKey, this._passphrase);
            return JSON.parse(claimString);
        }
        catch(err){
            console.log("Error decrypting private claim package: " + err.message);
        }

        return null;
    }

    async encryptClaims(claims, publicKey) {
        if (!claims || claims.length == 0){
            throw new Error("claims not provided");
        }
        if(!publicKey){
            throw new Error("publicKey not provided");
        }

        let encryptedClaims = new Array();

        for (let i = 0; i < claims.length; i++) {
            let encrypted = await this.encryptClaim(claims[i]);
            if (encrypted) {
                encryptedClaims.push(encrypted);
            }
            else {
                console.log("Could not encrypt claim, skipping.");
            }
        }

        return encryptedClaims;
    }

    async encryptClaim(claim, publicKey){
        if (!claim){
            throw new Error("claim not provided");
        }
        if(!publicKey){
            throw new Error("publicKey not provided");
        }

        return await this._cryptoHelper.encryptMessage(JSON.stringify(claim), publicKey, this._passport.privateKey, this._passphrase, true);
    }

    async verifyClaimSignature(claim, passportId){
        if (!claim){
            throw new Error("claim not provided");
        }
        if(!passportId){
            throw new Error("passportId not provided");
        }

        try
        {
            let signatureString = await claim.getSignatureString(passportId);
            let message = await this._cryptoHelper.verifySignedMessage(claim.signature, claim.signedByKey);

            if(signatureString != message)
                return false;
            
            return message;
        }
        catch(err){
            console.log("Error verifying claim signature: " + err.message);
        }
        
        return false;
    }

    checkClaimTypeExists(claimTypeId,claims){
        for(let i=0; i<claims.length; i++){
            if(claims[i].typeId == claimTypeId || claims[i].claimTypeId == claimTypeId)
                return true;
        }

        return false;
    }
};

exports.ClaimUtility = claimUtility;