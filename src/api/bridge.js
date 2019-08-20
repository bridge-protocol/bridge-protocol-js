const _api = require('../utils/api');

var bridgeApi = class BridgeApi
{
    constructor(apiBaseUrl, passport, passphrase){
        if(!passport)
            throw new Error("No passport provided.");
        if(!passphrase)
            throw new Error("No passphrase provided.");
        if(!apiBaseUrl)
            throw new Error("No base url provided.");

        this._apiBaseUrl = apiBaseUrl + "bridge/";
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getBridgePublicKey(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "publickey", null);
        return res.publicKey;
    }

    async getBridgePassportId(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "id", null);
        return res.id;
    }

    async getBridgeNetworkFee(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "fee", null);
        return res.networkFee;
    }

    async getBridgeNeoContractScriptHash(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "neocontractscripthash", null);
        return res.scriptHash;
    }

    async getBridgeNeoContractAddress(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "neocontractaddress", null);
        return res.address;
    }

    async getBridgeNeoAddress(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "neoaddress", null);
        return res.address;
    }
};

exports.BridgeApi = bridgeApi;