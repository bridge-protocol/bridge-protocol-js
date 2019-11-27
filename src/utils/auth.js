//Utilities
const _claimUtility = require('../utils/claim');
const _cryptoUtility = require('../utils/crypto');
const _passportUtility = require('../utils/passport');
const _messageUtility = require('../utils/message');
//Models
const _claim = require('../models/claim');

var authUtility = class AuthUtility{
    constructor(apiBaseUrl, passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
        this._cryptoHelper = _cryptoUtility.CryptoUtility;
        this._claimHelper = new _claimUtility.ClaimUtility(apiBaseUrl, passport, passphrase);
        this._messageHelper = new _messageUtility.MessageUtility(apiBaseUrl, passport, passphrase);
    }

    async createPassportLoginChallengeRequest(token, claimTypes) {
        if(!token){
            throw new Error("token not provided");
        }

        let payload = {
            token: await this._cryptoHelper.signMessage(token, this._passport.privateKey, this._passphrase, true),
            claimTypes
        };

        return await this._messageHelper.createMessage(payload);
    }

    async verifyPassportLoginChallengeRequest(message) {
        if(!message){
            throw new Error("message not provided");
        }

        message = await this._messageHelper.decryptMessage(message);
        message.payload.token = await this._cryptoHelper.verifySignedMessage(message.payload.token, message.publicKey);
        return message;
    }

    async createPassportLoginChallengeResponse(token, claims, publicKey) {
        if(!token){
            throw new Error("token not provided");
        }
        if(!publicKey){
            throw new Error("publicKey not provided");
        }

        let blockchainAddresses = [];
        for(let i=0; i<this._passport.wallets.length; i++){
            let wallet = this._passport.wallets[i];
            blockchainAddresses.push({
                network: wallet.network,
                address: wallet.address
            });
        }

        var payload = {
            token,
            claims,
            blockchainAddresses
        };

        //Encrypt the message
        return await this._messageHelper.createMessage(payload, publicKey);
    }

    async verifyPassportLoginChallengeResponse(message, verifyToken, claimTypeIds, requestPassportId) {
        if(!message){
            throw new Error("message not provided");
        }
        if(!verifyToken){
            throw new Error("verifyToken not provided");
        }
        if(!requestPassportId){
            throw new Error("requestPassportId not provided");
        }

        let res = await this._messageHelper.decryptMessage(message);
        if(res.passportId === requestPassportId){
            throw new Error("Invalid response.  Request and response passports cannot be the same.");
        }

        if(!res.payload.claims){
            res.payload.claims = new Array();
        }

        //We want to go through and only include claims that have verified signatures
        let verifiedClaims = new Array();
        for (let i = 0; i < res.payload.claims.length; i++) {
            try{
                let verifiedSignature = await this._claimHelper.verifyClaimSignature(new _claim.Claim(res.payload.claims[i]), res.passportId);
                if (verifiedSignature) {
                    res.payload.claims[i].signedById = await this._cryptoHelper.getPassportIdForPublicKey(res.payload.claims[i].signedByKey);
                    verifiedClaims.push(res.payload.claims[i]);
                }
                else{
                    console.log("Claim signature invalid, skipping.");
                }
            }
            catch(err){
                console.log("Error with claim: " + err.message + ", skipping.")
            }
        }

        return{
            loginResponse: {
                tokenVerified:  res.payload.token === verifyToken,
                missingClaimTypes: await this.getMissingRequiredClaimTypes(claimTypeIds, verifiedClaims),
                claims: verifiedClaims,
                passportId: res.passportId,
                publicKey: res.publicKey,
                blockchainAddresses: res.payload.blockchainAddresses
            }
        }
    }

    async getMissingRequiredClaimTypes(claimTypeIds, claims){
        let missingClaimTypeIds = new Array();
        let claimTypes = new Array();
        
        if(claimTypeIds){
            for(let i=0; i<claimTypeIds.length; i++){
                claimTypes.push(claimTypeIds[i]);
            }
        }

        for(let i=0; i<claimTypes.length; i++){
            let claimTypeId = claimTypes[i];
            if(!this._claimHelper.checkClaimTypeExists(claimTypeId,claims)){
                missingClaimTypeIds.push(claimTypes[i]);
            }   
        }

        return missingClaimTypeIds;
    }    
};

exports.AuthUtility = authUtility;