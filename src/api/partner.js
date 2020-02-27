const _constants = require("../utils/constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "partner/";

var partnerApi = class PartnerApi{
    constructor(passport, passphrase){
        if(!passport)
            throw new Error("No passport provided.");
        if(!passphrase)
            throw new Error("No passphrase provided.");

        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getAllPartners(useApi) {
        if(useApi){
            var api = new _api.APIUtility(_apiBaseUrl, this._passport, this._passphrase);
            var res = await api.callApi("GET", "", null);
            return res.partners;
        }
        else{
            return _constants.Constants.partners;
        }
    }

    async getPartner(partnerId, useApi) {
        if(!partnerId){
            throw new Error("partnerId not provided");
        }

        if(useApi){
            var api = new _api.APIUtility(_apiBaseUrl, this._passport, this._passphrase);
            var res = await api.callApi("GET", partnerId, null);
            return res.partner;
        }
        else{
            return this._getPartnerById(_constants.Constants.partners, partnerId);
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

exports.PartnerApi = partnerApi;