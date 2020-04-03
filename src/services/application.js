const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "application/";

class ApplicationApi
{
    async getActiveApplications(passport, passphrase){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", "true", null);

        if(res.applications){
            return res.applications;
        }

        return null; 
    }

    async getAllApplications(passport, passphrase){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", "false", null);

        if(res.applications){
            return res.applications;
        }
        
        return null;
    }

    async getApplication(passport, passphrase, applicationId){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", applicationId + "/details", null);

        if(res.application){
            return res.application;
        }

        return null;
    }

    async createApplication(passport, passphrase, partner){
        var obj = {
            partner
        };
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("POST", "create/", obj);

        if(res.application){
            return res.application;
        }

        return null;
    }

    async updatePaymentTransaction(passport, passphrase, applicationId, network, sender, transactionId){
        var obj = {
            applicationId,
            network,
            sender,
            transactionId
        };
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("POST", "updatetransaction/", obj);

        if(res.application){
            return res.application;
        }

        return null;
    }

    async retrySend(passport, passphrase, applicationId){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", applicationId + "/retry/", null);
        
        if(res.application){
            return res.application;
        }

        return null;
    }

    async getStatus(passport, passphrase, applicationId){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", applicationId + "/status/", null);

        if(res.status){
            return res.status;
        }

        return null;
    }
};

exports.ApplicationApi = new ApplicationApi();