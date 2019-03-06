const _api = require('../utils/api');

var applicationApi = class ApplicationApi
{
    constructor(apiBaseUrl, passport, passphrase){
        if(!passport)
            throw new Error("No passport provided.");
        if(!passphrase)
            throw new Error("No passphrase provided.");
        if(!apiBaseUrl)
            throw new Error("No base url provided.");

        this._apiBaseUrl = apiBaseUrl + "application/";
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getActiveApplications(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "true", null);

        if(res.applications){
            return res.applications;
        }

        return null; 
    }

    async getAllApplications(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "false", null);

        if(res.applications){
            return res.applications;
        }
        
        return null;
    }

    async getApplication(applicationId){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", applicationId + "/details", null);

        if(res.application){
            return res.application;
        }

        return null;
    }

    async createApplication(verificationPartner, paymentNetwork, paymentTransactionId){
        var obj = {
            "verificationPartner": verificationPartner,
            "transactionNetwork": paymentNetwork,
            "transactionId": paymentTransactionId
        };
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("POST", "create/", obj);

        if(res.application){
            return res.application;
        }

        return null;
    }

    async retrySend(applicationId){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", applicationId + "/retry/", null);
        
        if(res.application){
            return res.application;
        }

        return null;
    }

    async getStatus(applicationId){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", applicationId + "/status/", null);

        if(res.status){
            return res.status;
        }

        return null;
    }

    async getClaims(applicationId, isPublic){
        var scope = "private";
        if(isPublic == true)
            scope = "public";

        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", applicationId + "/claims/" + scope, null);

        if(res.claims){
            return res.claims;
        }

        return null;
    }

    async removeClaims(applicationId){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        await api.callApi("GET", applicationId + "/claims/remove", null);
    }

    async setApplicationStatus(applicationId, status){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        await api.callApi("POST", applicationId + "/status/", status);
    }

    async addClaimPackagesToApplication(applicationId, claimPackages){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        await api.callApi("POST", applicationId + "/claims/", claimPackages);
    }
};

exports.ApplicationApi = applicationApi;