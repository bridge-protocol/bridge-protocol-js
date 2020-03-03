const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "passport/";

class PassportApi {
    async getDetails(passport, passphrase, passportId) {
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", passportId + "/details", null);
        return res.details;
    }
};

exports.PassportApi = new PassportApi;