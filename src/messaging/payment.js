//Utilities
const _message = require('../utils/message').Message;
const _crypto = require('../utils/crypto').Crypto;

class PaymentUtility{
    async createPaymentRequestWithGas(passport, password, network, amount, address, gasNetwork, gasAmount, gasAddress, identifier){
        if(!primaryNetwork){
            throw new Error("network not provided");
        }
        if(!primaryAmount){
            throw new Error("amount not provided");
        }
        if(!primaryAddress){
            throw new Error("address not provided");
        }
        if(!gasNetwork){
            throw new Error("gas network not provided");
        }
        if(!gasAmount){
            throw new Error("gas amount not provided");
        }
        if(!gasAddress){
            throw new Error("gas address not provided");
        }

        let payload = {
            network,
            amount,
            address,
            gasNetwork,
            gasAmount,
            gasAddress,
            identifier
        };

        return await _message.createSignedMessage(passport, password, payload);
    }

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

        let payload = {
            network,
            amount,
            address,
            identifier
        };

        return await _message.createSignedMessage(passport, password, payload);
    }

    async verifyPaymentRequest(message) {
        if(!message){
            throw new Error("message not provided");
        }

        return await _message.verifySignedMessage(message);
    }

    async createPaymentResponseWithGas(passport, password, network, from, amount, address, gasNetwork, gasFrom, gasAmount, gasAddress, transactionId, gasTransactionId, identifier, targetPublicKey){
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
        if(!gasNetwork){
            throw new Error("network not provided");
        }
        if(!gasFrom)
            throw new Error("from address not provided");
        if(!gasAmount){
            throw new Error("amount not provided");
        }
        if(!gasAddress){
            throw new Error("address not provided");
        }
        if(!gasTransactionId){
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
            gasNetwork,
            gasFrom,
            gasAmount,
            gasAddress,
            identifier,
            transactionId
        };

        return await _message.createEncryptedMessage(passport, password, payload, targetPublicKey);
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
        
        let response = res.payload;
        response.passportId = res.passportId;

        return response;
    }
};

exports.PaymentUtility = new PaymentUtility();