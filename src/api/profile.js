const _constants = require("../utils/constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "profile/";

var profileApi = class ProfileApi
{
    constructor(passport, passphrase){
        if(!passport)
            throw new Error("No passport provided.");
        if(!passphrase)
            throw new Error("No passphrase provided.");

        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getAllProfileTypes(useApi){
        if(useApi){
            var api = new _api.APIUtility(_apiBaseUrl, this._passport, this._passphrase);
            var res = await api.callApi("GET", "type", null);
            return res.profileTypes;
        }
        else{
            return _constants.Constants.profileTypes;
        } 
    }
    
    async getProfileType(profileTypeId, useApi){
        if(!profileTypeId){
            throw new Error("profileTypeId not provided");
        }

        if(useApi){
            var api = new _api.APIUtility(_apiBaseUrl, this._passport, this._passphrase);
            var res = await api.callApi("GET", "type/" + profileTypeId, null);
            return res.profileType;
        }
        else{
           return this._getProfileTypeById(_constants.Constants.profileTypes);
        }
    }

    _getProfileTypeById(profileTypes, profileTypeId){
        for(let i=0; i<profileTypes.length; i++){
            if(profileTypeId == profileTypes[i].id){
                return profileTypes[i];
            }
        }

        return null;
    }
};

exports.ProfileApi = profileApi;