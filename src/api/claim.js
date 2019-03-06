const _api = require('../utils/api');

var claimApi = class ClaimApi
{
    constructor(apiBaseUrl, passport, passphrase){
        if(!passport)
            throw new Error("No passport provided.");
        if(!passphrase)
            throw new Error("No passphrase provided.");
        if(!apiBaseUrl)
            throw new Error("No base url provided.");

        this._apiBaseUrl = apiBaseUrl + "claim/";
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getAllTypes(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "type", null);
        return res.claimTypes;
    }

    async getType(claimTypeId){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "type/" + claimTypeId, null);
        return res.claimType;
    }
};

exports.ClaimApi = claimApi;