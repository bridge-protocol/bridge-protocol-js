const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "tokenswap/";

class TokenSwapApi
{
    async getTokenSwapList(passport, passphrase){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("GET", "all", null);

        if(res.tokenSwap)
            return res.tokenSwap;

        return null;
    }

    async getPendingTokenSwapList(passport, passphrase){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("GET", "pending", null);
        
        if(res.tokenSwap)
            return res.tokenSwap;

        return null;
    }

    async getTokenSwap(passport, passphrase, id){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("GET", id, null);

        if(res.tokenSwap)
            return res.tokenSwap;

        return null;
    }

    async createTokenSwap(passport, passphrase, network, address, receivingNetwork, receivingAddress, amount){
        var obj = {
            network,
            address,
            receivingNetwork,
            receivingAddress,
            amount
        };
        
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("POST", "create", obj);
        if(res.tokenSwap)
            return res.tokenSwap;

        return null;
    }

    async updatePaymentTransaction(passport, passphrase, id, transactionId, gasTransactionId)
    {
        var obj = {
            id,
            transactionId,
            gasTransactionId
        };
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("POST", "update", obj);
        if(res.tokenSwap)
            return res.tokenSwap;

        return null;
    }

    async remove(passport, passphrase, id){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        await api.callApi("GET", id + "/remove", null);
    }

    async retry(passport, passphrase, id){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        await api.callApi("GET", id + "/retry", null);
    }
};

exports.TokenSwapApi = new TokenSwapApi();