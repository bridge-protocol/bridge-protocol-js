const _crypto = require('../utils/crypto').Crypto;
const _message = require('../utils/message').Message;
const _claim = require('../models/claim');

class Auth{
    async createPassportLoginChallengeRequest(passport, password, token, claimTypes, networks) {
        if(!token){
            throw new Error("token not provided");
        }

        let payload = {
            token,
            claimTypes,
            networks
        };

        return await _message.createSignedMessage(passport, password, payload);
    }

    async verifyPassportLoginChallengeRequest(message) {
        if(!message){
            throw new Error("message not provided");
        }

        message = await _message.verifySignedMessage(message);
        return message;
    }

    async createPassportLoginChallengeResponse(passport, password, targetPublicKey, token, claims, networks) {
        if(!targetPublicKey){
            throw new Error("publicKey not provided");
        }
        if(!token){
            throw new Error("token not provided");
        }

        var payload = {
            token,
            claims,
            networks
        };

        //Encrypt the message
        return await _message.createEncryptedMessage(passport, password, payload, targetPublicKey);
    }

    async verifyPassportLoginChallengeResponse(passport, password, message, verifyToken, claimTypeIds, networks) {
        if(!passport){
            throw new Error("passport not provided");
        }
        if(!password){
            throw new Error("password not provided");
        }
        if(!message){
            throw new Error("message not provided");
        }
        if(!verifyToken){
            throw new Error("verifyToken not provided");
        }

        let res = await _message.decryptMessage(message, passport.privateKey, password);
        if(res.passportId === passport.id){
            throw new Error("Invalid response.  Request and response passports cannot be the same.");
        }

        if(!res.payload.claims)
            res.payload.claims = new Array();

        //We want to go through and only include claims that have verified signatures
        let verifiedClaims = new Array();
        for(let i=0; i<res.payload.claims.length; i++){
            try{
                let claim = new _claim.Claim(res.payload.claims[i]);
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
            authResponse: {
                passportId: res.passportId,
                publicKey: res.publicKey,
                tokenVerified:  res.payload.token === verifyToken,
                claims: verifiedClaims,
                blockchainAddresses: res.payload.networks,
                missingClaimTypes: this._getMissingRequiredClaimTypes(claimTypeIds, verifiedClaims),
                missingBlockchainAddresses: this._getMissingBlockchainAddresses(networks, res.payload.networks)
            }
        }
    }

    _getMissingBlockchainAddresses(networks, blockchainAddresses){
        let missingBlockchainAddresses = new Array();
        if(networks && networks.length > 0){
            for(let i=0; i<networks.length; i++){
                if(!this._checkBlockchainAddressExists(networks[i], blockchainAddresses)){
                    missingBlockchainAddresses.push(networks[i]);
                }
            }
        }
        return missingBlockchainAddresses;
    }

    _getMissingRequiredClaimTypes(claimTypeIds, claims){
        let missingClaimTypeIds = new Array();

        if(claimTypeIds && claimTypeIds.length > 0){
            for(let i=0; i<claimTypeIds.length; i++){
                if(!this._checkClaimTypeExists(claimTypeIds[i],claims)){
                    missingClaimTypeIds.push(claimTypeIds[i]);
                }
            }
        }

        return missingClaimTypeIds;
    }

    _checkBlockchainAddressExists(network, blockchainAddresses){
        for(let i=0; i<blockchainAddresses.length; i++){
            if(blockchainAddresses[i].network.toLowerCase() === network.toLowerCase())
                return true;
        }
        return false;
    }

    _checkClaimTypeExists(claimTypeId,claimPackages){
        for(let i=0; i<claimPackages.length; i++){
            if(claimPackages[i].typeId === claimTypeId || claimPackages[i].claimTypeId === claimTypeId)
                return true;
        }
        return false;
    }
};

exports.Auth = new Auth();