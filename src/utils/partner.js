//Utilities
const _cryptoUtility = require('../utils/crypto');
//Services
const _partnerApi = require('../api/partner');
const _applicationApi = require('../api/application');
//Models


var partnerUtility = class PartnerUtility {
    constructor(apiBaseUrl, passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
        this._cryptoHelper = _cryptoUtility.CryptoUtility;

        this._partnerService = new _partnerApi.PartnerApi(apiBaseUrl, passport, passphrase);
        this._applicationService = new _applicationApi.ApplicationApi(apiBaseUrl, passport, passphrase);
    }

    async getAllPartners() {
        return await this._partnerService.getAllPartners();
    }

    getPartnerById(partners, id){
        for(let i=0; i<partners.length; i++){
            if(partners[i].id == id){
                return partners[i];
            }
        }
    
        return null;
    }

    async getPartner(partnerId) {
        if(!partnerId){
            throw new Error("partnerId not provided");
        }

        return await this._partnerService.getPartner(partnerId);
    }
};

exports.PartnerUtility =  partnerUtility;