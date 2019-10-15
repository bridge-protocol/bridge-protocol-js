const _cryptoUtility = require('./crypto');
const _bridgeApi = require('../api/bridge');
const _constants = require('../utils/constants');

var bridgeUtility = class BridgeUtility {
    constructor(apiBaseUrl, passport, passphrase)
    {  
        this._cryptoHelper = _cryptoUtility.CryptoUtility;
        this._bridgeService = new _bridgeApi.BridgeApi(apiBaseUrl, passport, passphrase);
    }

    async getBridgePassportId(useApi){
        if(useApi){
            return await this._bridgeService.getBridgePassportId();
        }
        else{
            return _constants.Constants.bridgePassportId;
        }
    }

    async getBridgePublicKey(useApi){
        if(useApi){
            return await this._bridgeService.getBridgePublicKey();
        }
        else{
            return _constants.Constants.bridgePublicKey;
        }
    }

    //This always has to be live
    async getBridgeNetworkFee(){
        return await this._bridgeService.getBridgeNetworkFee();
    }

    async getBridgeNeoContractScriptHash(useApi){
        if(useApi){
            return await this._bridgeService.getBridgeNeoContractScriptHash();
        }
        else{
            return _constants.Constants.bridgeContractHash;
        }
    }

    async getBridgeNeoContractAddress(useApi){
        if(useApi){
            return await this._bridgeService.getBridgeNeoContractAddress();
        }
        else{
            return _constants.Constants.bridgeContractAddress;
        }
    }

    async getBridgeNeoAddress(useApi){
        if(useApi){
            return await this._bridgeService.getBridgeNeoAddress();
        }
        else{
            return _constants.Constants.bridgeAddress;
        }
    }
};

exports.BridgeUtility = bridgeUtility;