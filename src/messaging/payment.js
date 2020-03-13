//Utilities
const _message = require('../utils/message').Message;
const _crypto = require('../utils/crypto').Crypto;

class PaymentUtility{
    async createPaymentRequest(passport, password, network, amount, address, identifier) {
        if(!network){
            throw new Error("network not provided");
        }
        if(!amount){
            throw new Error("amount not provided");
        }
        if(!address){
            throw new Error("address not provided");
        }

        let request = {
            network,
            amount,
            address,
            identifier
        };

        let payload = {
            paymentRequest: await _crypto.signMessage(JSON.stringify(request), passport.privateKey, password, true),
        };

        return await _message.createMessage(payload, passport.publicKey);
    }

    async verifyPaymentRequest(message) {
        if(!message){
            throw new Error("message not provided");
        }

        message = await _message.decryptMessage(message);
        message.payload.paymentRequest = await _crypto.verifySignedMessage(message.payload.paymentRequest, message.publicKey);
        message.payload.paymentRequest = JSON.parse(message.payload.paymentRequest);
        return message;
    }

    async createPaymentResponse(passport, password, network, from, amount, address, identifier, transactionId, targetPublicKey){
        if(!network){
            throw new Error("network not provided");
        }
        if(!from)
            throw new Error("from address not provided");
        if(!amount){
            throw new Error("amount not provided");
        }
        if(!address){
            throw new Error("address not provided");
        }
        if(!transactionId){
            throw new Error("transactionId not provided");
        }
        if(!targetPublicKey)
        {
            throw new Error("public key not provided");
        }

        let payload = {
            network,
            from,
            amount,
            address,
            identifier,
            transactionId
        };

        return await _message.createEncryptedMessage(payload, targetPublicKey, passport.privateKey, passport.publicKey, password);
    }

    async verifyPaymentResponse(passport, password, message){
        if(!message){
            throw new Error("message not provided");
        }

        let res = await _message.decryptMessage(message, passport.privateKey, password);
        return{
            paymentResponse: res.payload,
            passportId: res.passportId
        }
    }
};

exports.PaymentUtility = new PaymentUtility();