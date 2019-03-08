const _applicationApi = require('../api/application');
const _verificationPartnerApi = require('../api/verificationpartner');

var applicationUtility = class ApplicationUtility{
    constructor(apiBaseUrl, passport, passphrase) {
        this._passport = passport;
        this._applicationService = new _applicationApi.ApplicationApi(apiBaseUrl, passport, passphrase);
        this._verificationPartnerService = new _verificationPartnerApi.VerificationPartnerApi(apiBaseUrl, passport, passphrase);
    }

    async createApplication(verificationPartnerId){
        return await this._applicationService.createApplication(verificationPartnerId);
    }

    async updatePaymentTransaction(applicationId, network, transactionId){
        return await this._applicationService.updatePaymentTransaction(applicationId, network, transactionId);
    }

    async retrySend(applicationId){
        if(!applicationId){
            throw new Error("applicationId not provided.");
        }

        return await this._applicationService.retrySend(applicationId);
    }

    async getActiveApplications(){
        return await this._applicationService.getActiveApplications();
    }

    async getAllApplications(){
        return await this._applicationService.getAllApplications();
    }

    async getApplication(applicationId){
        if(!applicationId){
            throw new Error("applicationId not provided.");
        }

        return await this._applicationService.getApplication(applicationId);
    }

    async getStatus(applicationId){
        if(!applicationId){
            throw new Error("applicationId not provided.");
        }

        return await this._applicationService.getStatus(applicationId);
    }

    async setStatus(applicationId, status) {
        if(!applicationId || !status){
            return;
        }

        await this._applicationService.setApplicationStatus(applicationId, status);
    }

    async addClaims(applicationId, claimPackages) {
        if (!applicationId) {
            throw new Error("applicationId not provided.");
        }
        if (!claimPackages || claimPackages.length == 0) {
            throw new Error("claimPackages not provided.");
        }

        await this._applicationService.addClaimPackagesToApplication(applicationId, claimPackages);
    }

    async getClaims(applicationId, isPublic){
        if(!applicationId){
            throw new Error("applicationId not provided.");
        }
        
        if(!isPublic){
            isPublic = true;
        }

        return await this._applicationService.getClaims(applicationId, isPublic);
    }

    async removeClaims(applicationId){
        if(!applicationId){
            throw new Error("applicationId not provided.");
        }

        return await this._applicationService.removeClaims(applicationId);
    }
};

exports.ApplicationUtility = applicationUtility;