const _crypto = require('../utils/crypto').Crypto;
const _message = require('../utils/message').Message;

class Claim{
    async createClaimsImportRequest(passport, password, claimPackages){
        if(!claimPackages || !Array.isArray(claimPackages) || claimPackages.length == 0)
            throw new Error("claims not provided");

        let payload = {
            claimPackages
        };

        return await _message.createSignedMessage(passport, password, payload);
    }

    async verifyClaimsImportRequest(message){
        if(!message){
            throw new Error("message not provided");
        }

        return await _message.verifySignedMessage(message);
    }
};

exports.Claim = new Claim();