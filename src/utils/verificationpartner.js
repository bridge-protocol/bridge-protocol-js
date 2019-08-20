//Utilities
const _cryptoUtility = require('../utils/crypto');
//Services
const _verificationPartnerApi = require('../api/verificationpartner');
const _applicationApi = require('../api/application');
//Models


var verificationPartnerUtility = class VerificationPartnerUtility {
    constructor(apiBaseUrl, passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
        this._cryptoHelper = _cryptoUtility.CryptoUtility;

        this._verificationPartnerService = new _verificationPartnerApi.VerificationPartnerApi(apiBaseUrl, passport, passphrase);
        this._applicationService = new _applicationApi.ApplicationApi(apiBaseUrl, passport, passphrase);
    }

    async getAllPartners() {
        return await this._verificationPartnerService.getAllPartners();
    }

    async getPartners(partnerIds) {
        if(!partnerIds){
            throw new Error("partnerIds not provided");
        }

        return await this._verificationPartnerService.getPartners(partnerIds);
    }

    getPartnerById(verificationPartners, id){
        for(let i=0; i<verificationPartners.length; i++){
            if(verificationPartners[i].id == id){
                return verificationPartners[i];
            }
        }
    
        return null;
    }

    async getPartner(partnerId) {
        if(!partnerId){
            throw new Error("partnerId not provided");
        }

        return await this._verificationPartnerService.getPartner(partnerId);
    }
};

exports.VerificationPartnerUtility = verificationPartnerUtility;