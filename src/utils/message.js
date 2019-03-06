const _cryptoUtility = require('./crypto');
const _passportApi = require('../api/passport');

var messageUtility = class MessageUtility {
    constructor(apiBaseUrl, passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
        this._cryptoHelper = _cryptoUtility.CryptoUtility;
    }

    async createMessage(payload, publicKey) {
        if(!payload){
            throw new Error("payload not provided");
        }

        //If public key is provided, we are encrypting
        if (publicKey) {
            payload = await this._cryptoHelper.encryptMessage(JSON.stringify(payload), publicKey, this._passport.privateKey, this._passphrase, true)
        }

        let message = {
            payload: payload,
            publicKey: this._passport.publicKey
        };

        return this._serialize(message, true);
    }

    async decryptMessage(message) {
        if(!message){
            throw new Error("message not provided");
        }

        message = await this._decrypt(message);

        let passportId = await this._cryptoHelper.getPassportIdForPublicKey(message.publicKey);

        return {
            passportId,
            publicKey: message.publicKey,
            payload: message.payload
        }
    }

    async _decrypt(message) {
        if(!message){
            throw new Error("message not provided");
        }

        //Decrypt to the message
        message = this._deserialize(message);

        //Message format is always publicKey, payload.  If it's not encrypted, the payload should be json
        //Try and decrypt the payload if it's hex.  If that fails, and it's still hex, let's decode it.
        if (this._cryptoHelper.isHex(message.payload)) {
            let decrypted = await this._cryptoHelper.decryptMessage(message.payload, message.publicKey, this._passport.privateKey, this._passphrase);
            message.payload = JSON.parse(decrypted);
        }

        return message;
    }

    _serialize(message, hex) {
        if(!message){
            throw new Error("message not provided");
        }
        if(!hex){
            throw new Error("hex not provided");
        }

        message = JSON.stringify(message);

        if (hex) {
            message = this._cryptoHelper.hexEncode(message, true);
        }

        return message;
    }

    _deserialize(message) {
        if(!message){
            throw new Error("message not provided");
        }
        
        //If we've transmitted with hex only, let's decode it
        if (this._cryptoHelper.isHex(message))
            message = this._cryptoHelper.hexDecode(message, true);

        //Deserialize to object
        return JSON.parse(message);
    }
};

exports.MessageUtility = messageUtility;