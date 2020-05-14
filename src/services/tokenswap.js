const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "tokenswap/";

class TokenSwapApi
{
    async getTokenSwapList(){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        return await api.callApi("GET", null, null);
    }

    async getPendingTokenSwapList(){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        return await api.callApi("GET", "pending", null);
    }

    async getTokenSwap(id){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        return await api.callApi("GET", id, null);
    }

    async createTokenSwap(network, address, amount){
        let obj = {
            network,
            address,
            amount
        };
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        return await api.callApi("POST", "create", obj);
    }

    async updatePaymentTransaction(id, transactionId, gasTransactionId)
    {
        let obj = {
            id,
            transactionId,
            gasTransactionId
        };
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        return await api.callApi("POST", "update", obj);
    }

    async retry(id){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        return await api.callApi("GET", id + "/retry", null);
    }
};

exports.TokenSwapApi = new TokenSwapApi();