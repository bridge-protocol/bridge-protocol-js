const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "passport/";

class PassportApi {
    async getDetails(passport, passphrase, passportId) {
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", passportId + "/details", null);
        return res.details;
    }

    async createPassportPublish(passport, passphrase, network, address){
        let obj = {
            network,
            address
        };
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("POST", "publish/create", obj);

        if(res.passportPublish)
            return res.passportPublish;

        return null;
    }

    async getPendingPassportPublishList(passport, passphrase){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("GET", "publish/pending", null);
        
        if(res.passportPublish)
            return res.passportPublish;

        return null;
    }
};

exports.PassportApi = new PassportApi;