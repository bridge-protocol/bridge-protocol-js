const _crypto = require('./crypto').Crypto;

class Message {
    //Encrypted message for the target recipient
    async createEncryptedMessage(passport, password, payload, targetPublicKey) {
        if(!passport)
            throw new Errorr("passport not provided");
        if(!password)
            throw new Error("password not provided");
        if(!payload)
            throw new Error("payload not provided");
        if(!targetPublicKey)
            throw new Error("target public key not provided");

        payload = await _crypto.encryptMessage(JSON.stringify(payload), targetPublicKey, passport.privateKey, password, true)
        return this.createMessage(payload, passport.publicKey);
    }

    async createSignedMessage(passport, password, payload){
        if(!passport)
            throw new Errorr("passport not provided");
        if(!password)
            throw new Error("password not provided");
        if(!payload)
            throw new Error("payload not provided");

        let signature = await _crypto.signMessage(JSON.stringify(payload), passport.privateKey, password, true);
        return this.createMessage(payload, passport.publicKey, signature);
    }

    //Signed message only, the public key is of the passport doing the sending
    async createMessage(payload, passportPublicKey, signature){
        if(!payload)
            throw new Error("payload not provided");
        if(!passportPublicKey)
            throw new Error("passport public key not provided");

        let message = {
            payload: payload,
            publicKey: passportPublicKey
        };

        if(signature)
            message.signature = signature;

        return this._serialize(message, true);
    }

    async verifySignedMessage(message){
        if(!message)
            throw new Error("message not provided");

        //Deserialized
        message = this._deserialize(message);

        //Verify the signature of the payload
        let serializedPayload = JSON.stringify(message.payload);
        let signedMessage = await _crypto.verifySignedMessage(message.signature, message.publicKey);
        let passportId = await _crypto.getPassportIdForPublicKey(message.publicKey);
        return {
            passportId,
            publicKey: message.publicKey,
            payload: message.payload,
            signatureValid: signedMessage === serializedPayload
        }
    }

    async decryptMessage(message, passportPrivateKey, password) {
        if(!message)
            throw new Error("message not provided");

        message = await this._decrypt(message, passportPrivateKey, password);
        let passportId = await _crypto.getPassportIdForPublicKey(message.publicKey);

        return {
            passportId,
            publicKey: message.publicKey,
            payload: message.payload
        }
    }

    async _decrypt(message, passportPrivateKey, password) {
        if(!message){
            throw new Error("message not provided");
        }

        //Decrypt to the message
        message = this._deserialize(message);

        //Message format is always publicKey, payload.  If it's not encrypted, the payload should be json
        //Try and decrypt the payload if it's hex.  If that fails, and it's still hex, let's decode it.
        if (_crypto.isHex(message.payload)) {
            let decrypted = await _crypto.decryptMessage(message.payload, message.publicKey, passportPrivateKey, password);
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

exports.Message = new Message();