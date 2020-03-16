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

        let paymentRequest = {
            network,
            amount,
            address,
            identifier
        };

        let payload = {
            paymentRequest
        };

        return await _message.createSignedMessage(passport, password, payload);
    }

    async verifyPaymentRequest(message) {
        if(!message){
            throw new Error("message not provided");
        }

        message = await _message.verifySignedMessage(message);
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

        return await _message.createEncryptedMessage(passport, password, payload, targetPublicKey);
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