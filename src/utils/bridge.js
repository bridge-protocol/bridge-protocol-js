const _cryptoUtility = require('./crypto');
const _bridgeApi = require('../api/bridge');

var bridgeUtility = class BridgeUtility {
    constructor(apiBaseUrl, passport, passphrase)
    {  
        this._cryptoHelper = _cryptoUtility.CryptoUtility;
        this._bridgeService = new _bridgeApi.BridgeApi(apiBaseUrl, passport, passphrase);
    }

    async getBridgePassportId(){
        return await this._bridgeService.getBridgePassportId();
    }

    async getBridgePublicKey(){
        return await this._bridgeService.getBridgePublicKey();
    }

    async getBridgeScriptHash(){
        return await this._bridgeService.getBridgeScriptHash();
    }

    async getBridgeNetworkFee(){
        return await this._bridgeService.getBridgeNetworkFee();
    }
};

exports.BridgeUtility = bridgeUtility;