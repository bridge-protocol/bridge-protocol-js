const _crypto = require('../utils/crypto').Crypto;
const _message = require('../utils/message').Message;
const _claim = require('../models/claim');

var auth = class Auth{
    constructor(passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async createPassportLoginChallengeRequest(token, claimTypes) {
        if(!token){
            throw new Error("token not provided");
        }

        let payload = {
            token: await _crypto.signMessage(token, this._passport.privateKey, this._passphrase, true),
            claimTypes
        };

        return await _message.createMessage(payload, this._passport.publicKey);
    }

    async verifyPassportLoginChallengeRequest(message) {
        if(!message){
            throw new Error("message not provided");
        }

        message = await _message.decryptMessage(message);
        message.payload.token = await _crypto.verifySignedMessage(message.payload.token, message.publicKey);
        return message;
    }

    async createPassportLoginChallengeResponse(token, claims, publicKey, networks) {
        if(!token){
            throw new Error("token not provided");
        }
        if(!publicKey){
            throw new Error("publicKey not provided");
        }

        //Get the blockchain addresses to be included
        let blockchainAddresses = [];
        for(var network in networks){
            let wallet = this._passport.getWalletForNetwork(network);
            if(wallet){
                blockchainAddresses.push({
                    network: wallet.network,
                    address: wallet.address
                });
            }
        }

        var payload = {
            token,
            claims,
            blockchainAddresses
        };

        //Encrypt the message
        return await this._message.createMessage(payload, publicKey);
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

        let res = await this._message.decryptMessage(message);
        if(res.passportId === requestPassportId){
            throw new Error("Invalid response.  Request and response passports cannot be the same.");
        }

        if(!res.payload.claims)
            res.payload.claims = new Array();

        //We want to go through and only include claims that have verified signatures
        let verifiedClaims = new Array();
        for(var c in res.payload.claims){
            try{
                let claim = new _claim.Claim(c);
                let passportId = res.passportId;
                if (claim.verifySignature(passportId)) {
                    claim.signedById = await _crypto.getPassportIdForPublicKey(claim.signedByKey);
                    verifiedClaims.push(claim);
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
                missingClaimTypes: await this._getMissingRequiredClaimTypes(claimTypeIds, verifiedClaims),
                claims: verifiedClaims,
                passportId: res.passportId,
                publicKey: res.publicKey,
                blockchainAddresses: res.payload.blockchainAddresses
            }
        }
    }

    async _getMissingRequiredClaimTypes(claimTypeIds, claims){
        let missingClaimTypeIds = new Array();

        if(claimTypeIds && claimTypeIds.length > 0){
            for(var claimTypeId in claimTypeIds){
                if(!this._checkClaimTypeExists(claimTypeId,claims)){
                    missingClaimTypeIds.push(claimTypesId);
                }
            }
        }

        return missingClaimTypeIds;
    }

    async _checkClaimTypeExists(claimTypeId,claimPackages){
        for(var claimPackage in claimPackages){
            if(claimPackage.typeId === claimTypeId || claimPackage.claimTypeId === claimTypeId)
                return true;
        }
        return false;
    }
};

exports.Auth = auth;