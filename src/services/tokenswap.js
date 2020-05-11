const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "tokenswap/";

class TokenSwapApi
{
    async getTokenSwapInfo(network, transactionId, passport, passphrase){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", network.toLowerCase() + "/" + transactionId, null);
        return res;
    }
};

exports.TokenSwapApi = new TokenSwapApi();