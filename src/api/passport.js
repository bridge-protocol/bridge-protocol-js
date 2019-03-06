const _api = require('../utils/api');

var passportApi = class PassportApi {
    constructor(apiBaseUrl, passport, passphrase) {
        if (!passport)
            throw new Error("No passport provided.");
        if (!passphrase)
            throw new Error("No passphrase provided.");
        if (!apiBaseUrl)
            throw new Error("No base url provided.");

        this._apiBaseUrl = apiBaseUrl + "passport/";
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async getDetails(passportId) {
        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        var res = await api.callApi("GET", passportId + "/details", null);
        return res.details;
    }

    async addBlockchainAddress(network, transaction) {
        var obj = {
            network,
            address: this._passport.wallets[0].address,
            transactionParameters: transaction.transactionParameters,
            transaction: transaction.transaction,
            hash: transaction.hash
        };

        var api = new _api.APIUtility(this._apiBaseUrl + "address/", this._passport, this._passphrase);
        return await api.callApi("POST", "add", obj);
    }

    async removeBlockchainAddress(network, transaction) {
        var obj = {
            network,
            address: this._passport.wallets[0].address,
            transactionParameters: transaction.transactionParameters,
            transaction: transaction.transaction,
            hash: transaction.hash
        };

        var api = new _api.APIUtility(this._apiBaseUrl + "address/", this._passport, this._passphrase);
        return await api.callApi("POST", "remove", obj);
    }

    async sendPayment(network, recipient, amount, transaction) {
        var obj = {       
            network,
            address: this._passport.wallets[0].address,
            recipient,
            amount,
            transactionParameters: transaction.transactionParameters,
            transaction: transaction.transaction,
            hash: transaction.hash
        };

        var api = new _api.APIUtility(this._apiBaseUrl, this._passport, this._passphrase);
        return await api.callApi("POST", "payment", obj);
    }
};

exports.PassportApi = passportApi;