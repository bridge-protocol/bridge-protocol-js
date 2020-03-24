const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "claim/";

class ClaimApi{
    async getAllTypes(useApi, passport, passphrase){
        if(useApi){
            var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
            var res = await api.callApi("GET", "type", null);
            return res.claimTypes;
        }
        else{
            return _constants.claimTypes;
        }
    }

    async getType(claimTypeId, useApi, passport, passphrase){
        if(useApi){
            var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
            var res = await api.callApi("GET", "type/" + claimTypeId, null);
            return res.claimType;
        }
        else{
            return this._getClaimTypeById(_constants.claimTypes, claimTypeId);
        }
    }

    _getClaimTypeById(claimTypes, claimTypeId){
        for(let i=0; i<claimTypes.length; i++){
            if(claimTypeId == claimTypes[i].id){
                return claimTypes[i];
            }
        } 
    }
};

exports.ClaimApi = new ClaimApi();