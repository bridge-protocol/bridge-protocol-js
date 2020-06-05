const _pgp = require('./pgp').PgpUtility;
const _neon = require('@cityofzion/neon-js');
const _crypto = require('crypto'); //NodeJS crypto npm

class Crypto {
    isHex(text){
        if(!text){
            throw new Error("text not provided");
        }

        let match = String(text).match("^(0[xX])?[A-Fa-f0-9]+$");
        if(match)
            return true;

        return false;
    }

    hexEncode(s, rev){
        let h = _neon.u.str2hexstring(s);
        if(rev) { h = h.split("").reverse().join("");}       
        return h;        
    }

    hexDecode(h, rev){
        if(rev){h = h.split("").reverse().join("");}
        return _neon.u.hexstring2str(h);
    }

    objectToHex(object){
        if(!object){
            throw new Error("object not provided");
        }

        return this.hexEncode(JSON.stringify(object));
    };

    hexToObject(hex){
        if(!hex){
            throw new Error("hex string not provided");
        }

        return JSON.parse(this.hexDecode(hex));
    };

    getObjectHash(object){
        if(!object){
            throw new Error("object not provided");
        }

        return this.getHash(JSON.stringify(object));
    }

    getHash(str){
        if(!str){
            throw new Error("str not provided");
        }

        const hash = _crypto.createHash('sha256');
        hash.update(str);
        return hash.digest('hex');
    }

    verifyHash(str, hash){
        let hashed = this.getHash(str);
        return hashed == hash;
    }

    getToken(){
        var l = []; 
        var d0 = Math.random()*0xffffffff|0;
        var d1 = Math.random()*0xffffffff|0;
        var d2 = Math.random()*0xffffffff|0;
        var d3 = Math.random()*0xffffffff|0;
            
        for (var i=0; i<256; i++) { 
            l[i] = (i<16?'0':'')+(i).toString(16);
        }

        return l[d0&0xff]+l[d0>>8&0xff]+l[d0>>16&0xff]+l[d0>>24&0xff]+
        l[d1&0xff]+l[d1>>8&0xff]+l[d1>>16&0x0f|0x40]+l[d1>>24&0xff]+
        l[d2&0x3f|0x80]+l[d2>>8&0xff]+l[d2>>16&0xff]+l[d2>>24&0xff]+
        l[d3&0xff]+l[d3>>8&0xff]+l[d3>>16&0xff]+l[d3>>24&0xff];
    }

    async getPassportIdForPublicKey(publicKey){
        if(!publicKey){
            throw new Error("publicKey not provided");
        }

        if(this.isHex(publicKey))
        {
            publicKey = this.hexDecode(publicKey);
        }

        return await _pgp.getFingerprintForPublicKey(publicKey);
    }

    async generateKey(passphrase)
    {
        if(!passphrase){
            throw new Error("passphrase not provided");
        }

        let generatedKey = await _pgp.generateKey(passphrase);

        if(!generatedKey){
            return null;
        }

        generatedKey.passportId = await this.getPassportIdForPublicKey(generatedKey.public);
        generatedKey.public = this.hexEncode(generatedKey.public);
        generatedKey.private = this.hexEncode(generatedKey.private);

        return generatedKey;
    };

    async getPublicKeyFromPrivateKey(decryptedPrivateKey){
        return new Promise(async (resolve, reject) => {
            try{
                let crypto = this;
                decryptedPrivateKey.export_pgp_public(false, function(err, msg){
                    if(err)
                        reject(err);
                    resolve(crypto.hexEncode(msg));
                }); 
            }
            catch(err){
                reject(err);
            }
        });
    }

    async decryptPrivateKey(privateKey, passphrase){
        if(!privateKey){
            throw new Error("privateKey not provided");
        }
        if(!passphrase){
            throw new Error("passphrase not provided");
        }

        if(this.isHex(privateKey))
        {
            privateKey = this.hexDecode(privateKey);
        }

        return await _pgp.readArmoredPrivateKey(privateKey, passphrase);
    }

    async signMessage (messageText, privateKey, passphrase, hexOutput) {
        if(!messageText){
            throw new Error("messageText not provided");
        }
        if(!privateKey){
            throw new Error("privateKey not provided");
        }
        if(!passphrase){
            throw new Error("passphrase not provided");
        }

        if(this.isHex(privateKey))
        {
            privateKey = this.hexDecode(privateKey);
        }

		let signature = null;
        
		try
		{
			signature = await _pgp.sign(messageText, privateKey, passphrase);
		}
		catch(err){
			console.log(err);
			return null;
		}
            
        if(!signature){
            return null;
        }

		return hexOutput == true ? this.hexEncode(signature) : signature;
    }

	async verifySignedMessage (signedMessage, publicKey) {
        if(!signedMessage){
            throw new Error("signedMessage not provided");
        }
        if(!publicKey){
            throw new Error("publicKey not provided");
        }

        if(this.isHex(signedMessage)){
            signedMessage = this.hexDecode(signedMessage);
        }
        if(this.isHex(publicKey)){
            publicKey = this.hexDecode(publicKey);
        }

        try{
			let result = await _pgp.decryptAndVerify({
				message: signedMessage,
				publicKey
			});

			return result.decryptedContent;
        }
        catch(err){
            console.log(err.message);
		}

		return null;
    }
    
	async encryptMessage (messageText, publicKey, privateKey, passphrase, hexOutput) {
        if(!messageText){
            throw new Error("messageText not provided");
        }
        if(!publicKey){
            throw new Error("publicKey not provided");
        }
        if(!privateKey){
            throw new Error("privateKey not provided");
        }
        if(!passphrase){
            throw new Error("passphrase not provided");
        }

        if(this.isHex(publicKey)){
            publicKey = this.hexDecode(publicKey);
        }
        if(this.isHex(privateKey)){
            privateKey = this.hexDecode(privateKey);
        }

        let encrypted = null;
        
        try{
            encrypted = await _pgp.encrypt(messageText, publicKey, privateKey, passphrase);
        }
        catch(err)
        {
            console.log(err.message);
        }

        if(!encrypted){
            return null;
        }

		return hexOutput == true ? this.hexEncode(encrypted) : encrypted;
	}

	async decryptMessage (encryptedAttachment, publicKey, privateKey, passphrase) {
        if(!encryptedAttachment){
            throw new Error("encryptedAttachment not provided");
        }
        if(!publicKey){
            throw new Error("publicKey not provided");
        }
        if(!privateKey){
            throw new Error("privateKey not provided");
        }
        if(!passphrase){
            throw new Error("passphrase not provided");
        }

        if(this.isHex(encryptedAttachment)){
            encryptedAttachment = this.hexDecode(encryptedAttachment);
        }
        if(this.isHex(publicKey)){
            publicKey = this.hexDecode(publicKey);
        }
        if(this.isHex(privateKey)){
            privateKey = this.hexDecode(privateKey);
        }

        let decrypted = null;

        try{
			let result = await _pgp.decryptAndVerify({
				message: encryptedAttachment,
				publicKey,
				privateKey,
				passphrase
			});

			decrypted = result.decryptedContent;
        }
        catch(err){
            console.log(err.message);
        }

		return decrypted;
	}
};

exports.Crypto = new Crypto();