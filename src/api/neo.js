const _api = require('../utils/api');

var neoApi = class NEOApi
{
    constructor(apiBaseUrl, passport, passphrase){
        if(!passport)
            throw new Error("No passport provided.");
        if(!passphrase)
            throw new Error("No passphrase provided.");
        if(!apiBaseUrl)
            throw new Error("No base url provided.");

        this._apiBaseUrl = apiBaseUrl + "neo/";
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getBridgeWallet(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "wallet", null);
        return res.address;
    }

    async getBridgeAddress(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "address", null);
        return res.address;
    }

    async getBridgeScriptHash(){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "scripthash", null);
        return res.scriptHash;
    }

    async getPassportStatus(passportId){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "id/" + passportId, null);
        return res;
    }

    async getAddressStatus(address){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "address/" + address, null);
        return res;
    }

    async addHash(address, digest, transaction) {
        var obj = {
            digest,
            transactionParameters: transaction.transactionParameters,
            transaction: transaction.transaction,
            hash: transaction.hash
        };

        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        return await api.callApi("POST", "address/" + address + "/hash/add", obj);
    }

    async getHash(address, hash){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "address/" + address + "/hash/" + hash,  null);
        return res.found;
    }

    async removeHash(address, transaction){
        var obj = {
            address,
            transactionParameters: transaction.transactionParameters,
            transaction: transaction.transaction,
            hash: transaction.hash
        };

        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        return await api.callApi("POST", "address/" + address + "/hash/remove", obj);
    }

    async addClaim(address, claim, transaction) {
        var obj = {
            address,
            claim,
            transactionParameters: transaction.transactionParameters,
            transaction: transaction.transaction,
            hash: transaction.hash
        };

        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        return await api.callApi("POST", "address/" + address + "/claim/add", obj);
    }

    async getClaim(address, claimTypeId){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "address/" + address + "/claim/" + claimTypeId, null);
        return res.claim;
    }

    async removeClaim(address, transaction) {
        var obj = {
            address,
            transactionParameters: transaction.transactionParameters,
            transaction: transaction.transaction,
            hash: transaction.hash
        };

        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        return await api.callApi("POST", "address/" + address + "/claim/remove", obj);
    }

    async sendTransaction(address, transaction){
        var obj = {
            address,
            transactionParameters: transaction.transactionParameters,
            transaction: transaction.transaction,
            hash: transaction.hash
        };

        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        return await api.callApi("POST", "transaction", obj);
    }

    async getTransactionStatus(transactionId){
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", "transaction/" + transactionId, null);
        return res;
    }
};

exports.NEOApi = neoApi;