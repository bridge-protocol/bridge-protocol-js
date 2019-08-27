const _neo = require('../utils/neo');
const _neoApi = require('../api/neo');
const _claims = require('../utils/claim');
const _crypto = require('../utils/crypto');
const _constants = require('../constants');

var blockchainUtility = class BlockchainUtility {
    constructor(apiBaseUrl, passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
        this._neoHelper = _neo.NEOUtility;
        this._neoService = new _neoApi.NEOApi(apiBaseUrl, passport, passphrase);
    }

    getPrivateKey(network, key) {
        if (!network) {
            throw new Error("network not provided");
        }
        if (!key) {
            throw new Error("key not provided");
        }

        if (network == "NEO") {
            return this._neoHelper.getWifFromNep2Key(key, this._passphrase);
        }

        return null;
    }

    async addBlockchainAddress(network, address, wait) {
        if (!network) {
            throw new Error("network not provided.");
        }
        if (!address) {
            throw new Error("address not provided");
        }

        if (network.toLowerCase() === "neo") {
            return await this._neoHelper.sendPublishAddressTransaction(this._passport, this._passphrase, address, wait);
        }

        return null;
    }

    //Amount is 100000000 = 1
    async sendPayment(network, amount, recipient, paymentIdentifier, wait) {
        //Recipient can be null, it will default to bridge contract address
        if (!network) {
            throw new Error("network not provided.");
        }
        if (!amount) {
            throw new Error("amount not provided.");
        }

        if (network.toLowerCase() === "neo") {
            let info = await this._neoHelper.sendSpendTokensTransaction(amount, paymentIdentifier, recipient, this._passport, this._passphrase, wait);
            if (!wait)
                return info; //This will just be the tx hash

            console.log("Verifying payment..");
            let res = await this._neoHelper.verifySpendTransactionFromInfo(info, amount, recipient, paymentIdentifier);
            if (!res.success) {
                console.log("Payment failed");
            }
            return res.success;
        }

        return null;
    }

    async getPassportStatus(network, passportId) {
        if (!network) {
            throw new Error("network not provided");
        }
        if (!passportId) {
            throw new Error("passportId not provided");
        }

        if (network == "NEO") {
            return await this._neoHelper.getRegisteredPassportInfo(passportId);
        }

        return null;
    }

    async getAddressStatus(network, address) {
        if (!network) {
            throw new Error("network not provided");
        }
        if (!address) {
            throw new Error("address not provided");
        }

        if (network == "NEO") {
            return await this._neoHelper.getRegisteredAddressInfo(address);
        }

        return null;
    }

    async getTransactionStatus(network, transactionId) {
        if (!network) {
            throw new Error("network not provided");
        }
        if (!transactionId) {
            throw new Error("transactionId not provided");
        }

        if (network == "NEO") {
            return await this._neoService.getTransactionStatus(transactionId);
        }
        return null;
    }

    async getRecentTransactions(network, address) {
        if (network == "NEO") {
            let tx = [];
            let res = await this._neoHelper.getLatestAddressTransactions(address);

            if (!res)
                return null;

            for (let i = 0; i < res.entries.length; i++) {
                if (res.entries[i].asset == _constants.Constants.brdgHash.replace("0x", "")) {
                    tx.push(res.entries[i]);
                }
            }

            return tx;
        }

        return null;
    }

    async getRecentToTransactions(network, address, addressTo) {
        if (network == "NEO") {
            let tx = [];
            let res = await this._neoHelper.getLatestAddressToTransactions(address, addressTo);
            if (!res)
                return null;

            for (let i = 0; i < res.entries.length; i++) {
                if (res.entries[i].asset == _constants.Constants.brdgHash.replace("0x", "")) {
                    tx.push(res.entries[i]);
                }
            }

            return tx;
        }

        return null;
    }

    async checkTransactionComplete(network, transactionId) {
        if (!network) {
            throw new Error("network not provided");
        }
        if (!transactionId) {
            throw new Error("transactionId not provided");
        }

        var res = await this.getTransactionStatus(network, transactionId);
        if (res && res.complete)
            return true;

        return false;
    }

    async getBalances(network) {
        if (network.toLowerCase() === "neo") {
            return await this._neoHelper.getAddressBalances(this._passport.wallets[0].address);
        }
    }

    async addHash(network, hash) {
        if (network.toLowerCase() === "neo") {
            return this._neoHelper.sendAddHashTransaction(hash, this._passport, this._passphrase, true);
            //TODO: Validate response
        }
        return null;
    }

    async removeHash(network, hash) {
        if (network.toLowerCase() === "neo") {
            return this._neoHelper.sendRemoveHashTransaction(hash, this._passport, this._passphrase, true);
            //TODO: Validate response
        }

        return null;
    }

    async addClaim(network, claim) {
        if (!network) {
            throw new Error("network not provided");
        }
        if (!claim) {
            throw new Error("claim not provided");
        }

        if (network.toLowerCase() === "neo") {
            let transaction = await this._neoHelper.getAddClaimTransaction(claim, this._passport, this._passphrase, true);
            let res = await this._neoService.verifyAndSignAddClaimTransaction(claim, transaction);
            if (!res || !res.transaction)
                return false;

            return await this._neoHelper.sendAddClaimTransaction(res);
        }

        return null;
    }

    async removeClaim(network, claimTypeId) {
        if (!network) {
            throw new Error("network not provided");
        }
        if (!claimTypeId) {
            throw new Error("claimTypeId not provided");
        }

        if (network.toLowerCase() === "neo") {
            return this._neoHelper.sendRemoveClaimTransaction(claimTypeId, this._passport, this._passphrase, true);
            //TODO: Validate response
        }

        return null;
    }

    //Public check hash for any address
    async checkHash(network, address, hash) {
        if (network.toLowerCase() === "neo") {
            return await this._neoHelper.getHashForAddress(hash, address);
        }
        return false;
    }

    //Public get claim for any address
    async getClaim(network, claimTypeId, address) {
        if (network.toLowerCase() === "neo") {
            return await this._neoHelper.getClaimForAddress(claimTypeId, address);
        }
        return null;
    }
};

exports.BlockchainUtility = blockchainUtility;