const _crypto = require('../utils/crypto').Crypto;
const _message = require('../utils/message').Message;

class Claim{
    async createClaimsImportRequest(passport, password, claimPackages){
        if(!claimPackages || !Array.isArray(claimPackages) || claimPackages.length == 0)
            throw new Error("claims not provided");

        let claimsImportRequest = {
            claimPackages
        };

        let payload = {
            claimsImportRequest
        };

        return await _message.createSignedMessage(passport, password, payload);
    }

    async verifyClaimsImportRequest(message){
        if(!message){
            throw new Error("message not provided");
        }

        message = await _message.verifySignedMessage(message);
        return message;
    }
};

exports.Claim = new Claim();