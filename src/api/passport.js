const _constants = require("../utils/constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "passport/";

var passportApi = class PassportApi {
    constructor(passport, passphrase) {
        if (!passport)
            throw new Error("No passport provided.");
        if (!passphrase)
            throw new Error("No passphrase provided.");

        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getDetails(passportId) {
        var api = new _api.APIUtility(_apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", passportId + "/details", null);
        return res.details;
    }
};

exports.PassportApi = passportApi;