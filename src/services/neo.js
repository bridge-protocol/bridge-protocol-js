const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "neo/";

class NEOApi
{
    async getAddClaimTransaction(passport, passphrase, claim, address, hashOnly) {
        claim.createdOn = claim.createdOn.toString();
        var obj = {
            claim,
            address,
            hashOnly
        };

        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        let res = await api.callApi("POST", "getaddclaimtransaction", obj);

        if(res == false)
            res = null;

        return res;
    }
};

exports.NEOApi = new NEOApi();