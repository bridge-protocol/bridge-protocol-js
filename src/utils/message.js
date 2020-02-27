const _crypto = require('./crypto').Crypto;

var message = class Message {
    constructor(passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async createMessage(payload, publicKey) {
        if(!payload){
            throw new Error("payload not provided");
        }

        //If public key is provided, we are encrypting
        if (publicKey) {
            payload = await _crypto.encryptMessage(JSON.stringify(payload), publicKey, this._passport.privateKey, this._passphrase, true)
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

        let passportId = await _crypto.getPassportIdForPublicKey(message.publicKey);

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
        if (_crypto.isHex(message.payload)) {
            let decrypted = await _crypto.decryptMessage(message.payload, message.publicKey, this._passport.privateKey, this._passphrase);
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
            message = _crypto.hexEncode(message, true);
        }

        return message;
    }

    _deserialize(message) {
        if(!message){
            throw new Error("message not provided");
        }
        
        //If we've transmitted with hex only, let's decode it
        if (_crypto.isHex(message))
            message = _crypto.hexDecode(message, true);

        //Deserialize to object
        return JSON.parse(message);
    }
};

exports.Message = message;