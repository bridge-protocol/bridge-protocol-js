const _api = require('../utils/api');

var neoApi = class NEOApi
{
    constructor(apiBaseUrl, passport, passphrase){
        if(!passport)
            throw new Error("No passport provided.");
        if(!passphrase)
            throw new Error("No passphrase provided.");
        if(!apiBaseUrl)
            throw new Error("No base url provided.");

        this._apiBaseUrl = apiBaseUrl + "neo/";
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getBridgeWallet(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "wallet", null);
        return res.address;
    }

    async getBridgeAddress(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "address", null);
        return res.address;
    }

    async getBridgeScriptHash(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "scripthash", null);
        return res.scriptHash;
    }

    async verifyAndSignAddClaimTransaction(claim, transaction) {
        var obj = {
            claim,
            transactionParameters: transaction.transactionParameters,
            transaction: transaction.transaction,
            hash: transaction.hash
        };

        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        return await api.callApi("POST", "signclaimtransaction", obj);
    }
};

exports.NEOApi = neoApi;