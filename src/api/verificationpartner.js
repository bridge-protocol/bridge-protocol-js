const _api = require('../utils/api');

var verificationPartnerApi = class VerificationPartnerApi{
    constructor(apiBaseUrl, passport, passphrase){
        if(!passport)
            throw new Error("No passport provided.");
        if(!passphrase)
            throw new Error("No passphrase provided.");
        if(!apiBaseUrl)
            throw new Error("No base url provided.");

        this._apiBaseUrl = apiBaseUrl + "verificationpartner/";
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getAllPartners(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "", null);
        return res.partners;
    }

    async getPartners(partnerIds){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("POST", "", partnerIds);
        return res.partners;
    }

    async getPartner(partnerId){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", partnerId, null);
        return res.partner;
    }
};

exports.VerificationPartnerApi = verificationPartnerApi;