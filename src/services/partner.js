const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "partner/";

class PartnerApi{
    async getAllPartners(useApi, passport, passphrase) {
        if(useApi){
            var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
            var res = await api.callApi("GET", "", null);
            return res.partners;
        }
        else{
            return _constants.partners;
        }
    }

    async getPartner(partnerId, useApi, passport, passphrase) {
        if(!partnerId){
            throw new Error("partnerId not provided");
        }

        if(useApi){
            var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
            var res = await api.callApi("GET", partnerId, null);
            return res.partner;
        }
        else{
            return this._getPartnerById(_constants.partners, partnerId);
        }
    }
    
    _getPartnerById(partners, id){
        for(let i=0; i<partners.length; i++){
            if(partners[i].id == id){
                return partners[i];
            }
        }
    
        return null;
    }
};

exports.PartnerApi = new PartnerApi();