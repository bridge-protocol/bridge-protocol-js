const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "profile/";

class ProfileApi
{
    async getAllProfileTypes(useApi, passport, passphrase){
        if(useApi){
            var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
            var res = await api.callApi("GET", "type", null);
            return res.profileTypes;
        }
        else{
            return _constants.profileTypes;
        } 
    }
    
    async getProfileType(profileTypeId, useApi, passport, passphrase){
        if(!profileTypeId){
            throw new Error("profileTypeId not provided");
        }

        if(useApi){
            var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
            var res = await api.callApi("GET", "type/" + profileTypeId, null);
            return res.profileType;
        }
        else{
           return this._getProfileTypeById(_constants.profileTypes);
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

exports.ProfileApi = new ProfileApi();