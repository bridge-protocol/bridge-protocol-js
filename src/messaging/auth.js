const _crypto = require('../utils/crypto').Crypto;
const _message = require('../utils/message').Message;
const _claim = require('../models/claim');

class Auth{
    async createPassportChallengeRequest(passport, password, token, claimTypes, networks) {
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

    async verifyPassportChallengeRequest(message) {
        if(!message){
            throw new Error("message not provided");
        }

        message = await _message.verifySignedMessage(message);
        return message;
    }

    async createPassportChallengeResponse(passport, password, targetPublicKey, token, claims, networks) {
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

    async verifyPassportChallengeResponse(passport, password, message, token) {
        if(!passport){
            throw new Error("passport not provided");
        }
        if(!password){
            throw new Error("password not provided");
        }
        if(!message){
            throw new Error("message not provided");
        }
        if(!token){
            throw new Error("token not provided");
        }

        let res = await _message.decryptMessage(message, passport.privateKey, password);
        if(res.passportId === passport.id){
            throw new Error("Invalid response.  Request and response passports cannot be the same.");
        }

        if(!res.payload.claims)
            res.payload.claims = new Array();

        //We want to go through and only include claims that have verified signatures
        let claims = new Array();
        for(let i=0; i<res.payload.claims.length; i++){
            try{
                let claim = new _claim.Claim(res.payload.claims[i]);
                let passportId = res.passportId;
                claim.signedById = await _crypto.getPassportIdForPublicKey(claim.signedByKey);
                claim.signatureValid = (await claim.verifySignature(passportId) != false);
                claims.push(claim);
            }
            catch(err){
                console.log("Error with claim: " + err.message + ", skipping.")
            }
        }

        return{
            authResponse: {
                passportId: res.passportId,
                publicKey: res.publicKey,
                tokenVerified:  res.payload.token === token,
                claims,
                blockchainAddresses: res.payload.networks
            }
        }
    }
};

exports.Auth = new Auth();