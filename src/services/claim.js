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

    async getClaimPublish(passport, passphrase, id){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("GET", "publish/" + id, null);
        
        if(res.claimPublish)
            return res.claimPublish;

        return null;
    }

    async getPendingClaimPublishList(passport, passphrase){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("GET", "publish/pending", null);
        
        if(res.claimPublish)
            return res.claimPublish;

        return null;
    }

    async getClaimPublishList(passport, passphrase){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res =  await api.callApi("GET", "publish/all", null);
        
        
        if(res.claimPublish)
            return res.claimPublish;

        return null;
    }

    async createClaimPublish(passport, passphrase, network, address, claim){
        let obj = {
            network,
            address,
            claim
        };
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("POST", "publish/create", obj);

        if(res.claimPublish)
            return res.claimPublish;

        return null;
    }

    async updateClaimPaymentTransaction(passport, passphrase, id, transactionId, gasTransactionId){
        let obj = {
            id,
            transactionId,
            gasTransactionId
        };
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("POST", "publish/update", obj);

        if(res.claimPublish)
            return res.claimPublish;

        return null;
    }

    async getClaimPublishTransaction(passport, passphrase, id){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        return await api.callApi("GET", "publish/" + id + "/transaction", null);
    }

    async retry(passport, passphrase, id){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        return await api.callApi("GET", "publish/" + id  + "/retry", null);
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