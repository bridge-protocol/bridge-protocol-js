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

    async getAddClaimTransaction(claim, address) {
        var obj = {
            claim,
            address
        };

        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        let res = await api.callApi("POST", "getaddclaimtransaction", obj);

        if(res == false)
            res = null;

        return res;
    }
};

exports.NEOApi = neoApi;