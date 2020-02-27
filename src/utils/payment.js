//Utilities
const _messageUtility = require('../utils/message');
const _cryptoUtility = require('../utils/crypto');

var paymentUtility = class PaymentUtility{
    constructor(passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
        this._messageHelper = new _messageUtility.MessageUtility(passport, passphrase);
        this._cryptoHelper = _cryptoUtility.CryptoUtility;
    }

    async createPaymentRequest(network, amount, address, identifier) {
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
            paymentRequest: await this._cryptoHelper.signMessage(JSON.stringify(request), this._passport.privateKey, this._passphrase, true),
        };

        return await this._messageHelper.createMessage(payload);
    }

    async verifyPaymentRequest(message) {
        if(!message){
            throw new Error("message not provided");
        }

        message = await this._messageHelper.decryptMessage(message);
        message.payload.paymentRequest = await this._cryptoHelper.verifySignedMessage(message.payload.paymentRequest, message.publicKey);
        message.payload.paymentRequest = JSON.parse(message.payload.paymentRequest);
        return message;
    }

    async createPaymentResponse(network, amount, address, identifier, transactionId, publicKey){
        if(!network){
            throw new Error("network not provided");
        }
        if(!amount){
            throw new Error("amount not provided");
        }
        if(!address){
            throw new Error("address not provided");
        }
        if(!transactionId){
            throw new Error("transactionId not provided");
        }
        if(!publicKey)
        {
            throw new Error("public key not provided");
        }

        let payload = {
            network,
            amount,
            address,
            identifier,
            transactionId
        };

        return await this._messageHelper.createMessage(payload, publicKey);
    }

    async verifyPaymentResponse(message, requestPassportId){
        if(!message){
            throw new Error("message not provided");
        }
        if(!requestPassportId){
            throw new Error("requestPassportId not provided");
        }

        let res = await this._messageHelper.decryptMessage(message);
        if(res.passportId === requestPassportId){
            throw new Error("Invalid response.  Request and response passports cannot be the same.");
        }

        return{
            paymentResponse: res.payload,
            passportId: res.passportId
        }
    }
};

exports.PaymentUtility = paymentUtility;