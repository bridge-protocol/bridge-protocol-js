const _fetch = require('node-fetch');
const _crypto = require('./crypto').Crypto;

var APIUtility = class APIUtility {
    constructor(apiBaseUrl, passport, passphrase) {
        if (!passport)
            throw new Error("No passport provided.");
        if (!passphrase)
            throw new Error("No passphrase provided.");
        if (!apiBaseUrl)
            throw new Error("No base url provided.");

        this._apiBaseUrl = apiBaseUrl;
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async callApi(method, endpoint, data) {
        if(!method){
            throw new Error("method not provided");
        }

        var token = _crypto.getToken();
        if (method == 'GET') {
            data = token;
        }
        if (method == 'POST'){
            data = JSON.stringify(data);
        }
            
        var signedMessage = await _crypto.signMessage(data, this._passport.privateKey, this._passphrase, true);

        //Set the required request headers
        let headers = {
            "BridgePassportPublicKey": this._passport.publicKey,
            "BridgePassportVersion": this._passport.version,
            "BridgeSignature": signedMessage
        };
        if (method == "POST") {
            headers = {
                "BridgePassportPublicKey": this._passport.publicKey,
                "BridgePassportVersion": this._passport.version,
                "BridgeSignature": signedMessage,
                "Content-Type": 'application/json',
                "Content-Length": Buffer.byteLength(data, 'utf8')
            };
        }

        let options = {
            method: method,
            headers: headers
        };

        if (method == "POST") {
            options.body = data;
        }

        const response = await _fetch(this._apiBaseUrl + endpoint, options);

        if (response.ok) {
            let text = await response.text();
            if (text.length > 0)
                return JSON.parse(text);
            else
                return true;
        }
        else {
            var error = response.statusText;
            let text = await response.text();
            if (text) {
                var res = JSON.parse(text);
                if (res && res.message)
                    error = res.message;
            }
            else
                text = response.statusText;

            console.log(error);
            return {};
        }
    }
};

exports.APIUtility = APIUtility;