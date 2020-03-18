const _constants = require("../constants").Constants;
const _api = require('../utils/api');
const _apiBaseUrl = _constants.bridgeApiUrl + "bridge/";

class BridgeApi
{
    async getBridgePassportId(useApi, passport, passphrase){
        if(useApi){
            var api = new _api.APIUtility(this._apiBaseUrl, passport, passphrase);
            var res = await api.callApi("GET", "id", null);
            return res.id;
        }
        else{
            return _constants.bridgePassportId;
        }
    }

    async getBridgePublicKey(useApi, passport, passphrase){
        if(useApi){
            var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
            var res = await api.callApi("GET", "publickey", null);
            return res.publicKey;
        }
        else{
            return _constants.bridgePublicKey;
        }
    }

    async getBridgeNetworkFee(passport, passphrase){
        var api = new _api.APIUtility(_apiBaseUrl, passport, passphrase);
        var res = await api.callApi("GET", "fee", null);
        return res.networkFee;
    }
};

exports.BridgeApi = new BridgeApi();