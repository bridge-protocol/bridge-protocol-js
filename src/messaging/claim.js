const _crypto = require('../utils/crypto').Crypto;
const _message = require('../utils/message').Message;

class Claim{
    async createClaimsImportRequest(passport, password, claimPackages){
        if(!claimPackages || !Array.isArray(claimPackages) || claimPackages.length == 0)
            throw new Error("claims not provided");

        let request = {
            claimPackages
        };

        let payload = {
            claimsImportRequest: await _crypto.signMessage(JSON.stringify(request), passport.privateKey, password, true),
        };

        return await _message.createMessage(payload, passport.publicKey);
    }

    async verifyClaimsImportRequest(message){
        if(!message){
            throw new Error("message not provided");
        }

        message = await _message.decryptMessage(message);
        message.payload.claimsImportRequest = await _crypto.verifySignedMessage(message.payload.claimsImportRequest, message.publicKey);
        message.payload.claimsImportRequest = JSON.parse(message.payload.claimsImportRequest);
        return message;
    }
};

exports.Claim = new Claim();