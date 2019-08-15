const _neo = require('../utils/neo');
const _neoApi = require('../api/neo');
const _claims = require('../utils/claim');
const _crypto = require('../utils/crypto');

var blockchainUtility = class BlockchainUtility {
    constructor(apiBaseUrl, passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
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
            return _neo.NEOUtility.getWifFromNep2Key(key, this._passphrase);
        }

        return null;
    }

    async getBridgeScriptHash(network) {
        if (!network) {
            throw new Error("network not provided");
        }

        if (network == "NEO") {
            return await this._neoService.getBridgeScriptHash();
        }

        return null;
    }

    async getBridgeWallet(network) {
        if (!network) {
            throw new Error("network not provided");
        }

        if (network == "NEO") {
            return await this._neoService.getBridgeWallet();
        }

        return null;
    }

    async getBridgeAddress(network){
        if(!network){
            throw new Error("network not provided");
        }

        if(network == "NEO"){
            return await this._neoService.getBridgeAddress();
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
            return await this._neoService.getPassportStatus(passportId);
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
            return await this._neoService.getAddressStatus(address);
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

    async getGasBalance(network){
        if(network.toLowerCase() === "neo"){
            return await _neo.NEOUtility.getGasBalance(this._passport.wallets[0].address);
        }
    }

    async addHash(network, hash) {
        if (network.toLowerCase() === "neo") {
            let transaction = _neo.NEOUtility.getAddHashTransaction(hash, this._passport, this._passphrase, this._scripthash);
            let success = await this._neoService.addHash(this._passport.wallets[0].address, hash, transaction);
            if (success) {
                return transaction.hash;
            }
        }
        return null;
    }

    async removeHash(network, hash){
        if(network.toLowerCase() === "neo"){
            let transaction = _neo.NEOUtility.getRemoveHashTransaction(hash, this._passport, this._passphrase, this._scripthash)
            let success = await this._neoService.removeHash(this._passport.wallets[0].address, transaction);
            if(success){
                return transaction.hash;
            }
        }

        return null;
    }

    async addClaim(network, claim, bridgeAddress) {
        if(!network){
            throw new Error("network not provided");
        }
        if(!claim){
            throw new Error("claim not provided");
        }
        if(!bridgeAddress){
            throw new Error("bridgeAddress not provided");
        }

        if (network.toLowerCase() === "neo") {
            let transaction = _neo.NEOUtility.getAddClaimTransaction(claim, this._passport, this._passphrase, this._scripthash, bridgeAddress);
            let success = await this._neoService.addClaim(this._passport.wallets[0].address, claim, transaction);
            if (success) {
                return transaction.hash;
            }
        }

        return null;
    }

    async removeClaim(network, claimTypeId){
        if(!network){
            throw new Error("network not provided");
        }
        if(!claimTypeId){
            throw new Error("claimTypeId not provided");
        }
        
        if(network.toLowerCase() === "neo"){
            let transaction = _neo.NEOUtility.getRemoveClaimTransaction(claimTypeId, this._passport, this._passphrase, this._scripthash);
            let success = await this._neoService.removeClaim(this._passport.wallets[0].address, transaction);
            if(success){
                return transaction.hash;
            }
        }

        return null;
    }

    //Public check hash for any address
    async checkHash(network, address, hash) {
        if (network.toLowerCase() === "neo") {
            return await this._neoService.getHash(address, hash);
        }
        return false;
    }

    //Public get claim for any address
    async getClaim(network, address, claimTypeId) {
        if (network.toLowerCase() === "neo") {
            let res = await this._neoService.getClaim(address, claimTypeId);
            //res.createdOn = _crypto.CryptoUtility.hexDecode(res.createdOn);
            //res.claimValue = _crypto.CryptoUtility.hexDecode(res.claimValue);
            return res;
        }
        return null;
    }
};

exports.BlockchainUtility = blockchainUtility;