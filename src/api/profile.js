const _api = require('../utils/api');

var profileApi = class ProfileApi
{
    constructor(apiBaseUrl, passport, passphrase){
        if(!passport)
            throw new Error("No passport provided.");
        if(!passphrase)
            throw new Error("No passphrase provided.");
        if(!apiBaseUrl)
            throw new Error("No base url provided.");

        this._apiBaseUrl = apiBaseUrl + "profile/";
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getAllProfileTypes()
    {
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "type", null);
        return res.profileTypes;
    }

    async getProfileType(profileTypeId)
    {
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "type/" + profileTypeId, null);
        return res.profileType;
    }
};

exports.ProfileApi = profileApi;