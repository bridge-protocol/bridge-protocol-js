const _crypto = require('../utils/crypto').Crypto;
const _message = require('../utils/message').Message;

class Claim{
    async createClaimsImportRequest(claimPackages, passportPrivateKey, password){
        if(!claims || !Array.isArray(claims) || claims.length == 0)
            throw new Error("claims not provided");

        let request = {
            claimPackages
        };

        let payload = {
            claimsImportRequest: await _crypto.signMessage(JSON.stringify(request), passportPrivateKey, password, true),
        };

        return await _message.createMessage(payload);
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