const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "application/";

class ApplicationApi
{
    async getApplicationList(passport, passphrase){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", "all", null);

        if(res.applications){
            return res.applications;
        }
        
        return null;
    }

    async getApplication(passport, passphrase, id){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", id, null);

        if(res.application){
            return res.application;
        }

        return null;
    }

    async createApplication(passport, passphrase, partner, network, address){
        var obj = {
            partner,
            network,
            address
        };
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("POST", "create", obj);

        if(res.application){
            return res.application;
        }

        return null;
    }

    async updatePaymentTransaction(passport, passphrase, id, transactionId){
        var obj = {
            id,
            transactionId
        };
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("POST", "update", obj);

        if(res.application){
            return res.application;
        }

        return null;
    }

    async retry(passport, passphrase, id){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", id + "/retry", null);
        
        if(res.application){
            return res.application;
        }

        return null;
    }
};

exports.ApplicationApi = new ApplicationApi();