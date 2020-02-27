const _constants = require("../utils/constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "neo/";

var neoApi = class NEOApi
{
    constructor(passport, passphrase){
        if(!passport)
            throw new Error("No passport provided.");
        if(!passphrase)
            throw new Error("No passphrase provided.");

        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getAddClaimTransaction(claim, address, hashOnly) {
        var obj = {
            claim,
            address,
            hashOnly
        };

        var api = new _api.APIUtility(_apiBaseUrl, this._passport, this._passphrase);
        let res = await api.callApi("POST", "getaddclaimtransaction", obj);

        if(res == false)
            res = null;

        return res;
    }
};

exports.NEOApi = neoApi;