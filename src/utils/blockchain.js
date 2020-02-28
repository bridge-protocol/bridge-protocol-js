const _constants = require('../utils/constants').Constants;
const _neo = require('../utils/neo').NEO;
const _eth = require('../utils/ethereum').Ethereum;
const _neoApi = require('../api/neo');

var blockchain = class Blockchain {
    constructor(passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
        this._neoService = new _neoApi.NEOApi(passport, passphrase);
    }

    async getPrivateKey(walletInfo) {
        if (!walletInfo) {
            throw new Error("walletInfo not provided");
        }

        if(!walletInfo.wallet)
            throw new Error("Wallet not unlocked");
        
        if (walletInfo.network.toLowerCase() == "neo") {
            return await _neo.getPrivateKey(walletInfo, this._passphrase);
        }
        else if(walletInfo.network.toLowerCase() == "eth"){
            return _eth.getPrivateKey(walletInfo, this._passphrase);
        }
        return null;
    }

    async publishPassport(walletInfo)
    {
        if (!walletInfo)
            throw new Error("wallet not provided for publish.");
        if(!walletInfo.wallet)
            throw new Error("wallet not unlocked");

        if (walletInfo.network.toLowerCase() === "neo") {
            return await _neo.publishPassport(walletInfo, this._passport);
        }
        else if(walletInfo.network.toLowerCase() === "eth"){
            return await _eth.publishPassport(walletInfo, this._passport.id);
        }

        return null;
    }

    async getPassportForAddress(network, address){
        if(!network)
            throw new Error("network not provided");
        if(!address)
            throw new Error("address not provided");

        if(network.toLowerCase() === "neo"){
            return await _neo.getPassportForAddress(address);
        }
        else if(network.toLowerCase() === "eth"){
            return await _eth.getPassportForAddress(address);
        }
    }

    async getAddressForPassport(network, passportId){
        if(!network)
            throw new Error("network not provided");
        if(!passportId)
            throw new Error("passportId not provided");
            
        if(network.toLowerCase() === "neo"){
            return await _neo.getAddressForPassport(passportId);
        }
        else if(network.toLowerCase() === "eth"){
            return await _eth.getAddressForPassport(passportId);
        }
    }

    async unpublishPassport(walletInfo){
        if(!walletInfo)
            throw new Error("walletInfo not provided");
        if(!walletInfo.wallet)
            throw new Error("Wallet not unlocked");

        if(walletInfo.network.toLowerCase() === "neo"){
            return await _neo.unpublishPassport(walletInfo, this._passport);
        }
        else if(walletInfo.network.toLowerCase() === "eth"){
            return await _eth.unpublishPassport(walletInfo);
        }
    }

    async addBlockchainAddress(network, address, wait) {
        if (!network) {
            throw new Error("network not provided.");
        }
        if (!address) {
            throw new Error("address not provided");
        }

        let wallet = this._getWalletForNetwork(network);

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
            let spendRes = await _neo.sendSpendTokensTransaction(amount, paymentIdentifier, recipient, this._passport, this._passphrase, wait);
            if (!wait)
                return spendRes.txid; 

            console.log("Verifying payment..");
            let verifyRes = await _neo.verifySpendTransactionFromInfo(spendRes.info, amount, recipient, paymentIdentifier);
            if (!verifyRes.success) {
                console.log("Payment failed");
                return null;
            }
            
            if(verifyRes.success){
                console.log("Payment successful");
                return verifyRes.txid;
            }
        }

        return null;
    }

    async waitTransactionStatus(network, txid, amount, recipient, paymentIdentifier){
        if (!network) {
            throw new Error("network not provided.");
        }
        if (!txid) {
            throw new Error("txid not provided.");
        }
        if (!amount) {
            throw new Error("amount not provided.");
        }
        if (!recipient) {
            throw new Error("recipient not provided.");
        }

        if (network.toLowerCase() === "neo") {
            let info = await _neo.checkTransactionComplete(txid);
            console.log("Verifying payment..");
            let verifyRes = await _neo.verifySpendTransactionFromInfo(info, amount, recipient, paymentIdentifier);
            if (!verifyRes.success) {
                console.log("Payment failed");
                return null;
            }

            if(verifyRes.success){
                console.log("Payment successful");
                return verifyRes.txid;
            }
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
            return await _neo.getRegisteredPassportInfo(passportId);
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
            return await _neo.getRegisteredAddressInfo(address);
        }

        return null;
    }

    async getRecentTransactions(network, address) {
        if (network == "NEO") {
            let tx = [];
            let res = await _neo.getLatestAddressTransactions(address);

            if (!res)
                return null;

            for (let i = 0; i < res.entries.length; i++) {
                if (res.entries[i].asset == _constants.brdgHash.replace("0x", "")) {
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
            let res = await _neo.getLatestAddressToTransactions(address, addressTo);
            if (!res)
                return null;

            for (let i = 0; i < res.entries.length; i++) {
                if (res.entries[i].asset == _constants.brdgHash.replace("0x", "")) {
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
            return await _neo.getAddressBalances(this._passport.wallets[0].address);
        }
    }

    async addHash(network, hash) {
        if (network.toLowerCase() === "neo") {
            return _neo.sendAddHashTransaction(hash, this._passport, this._passphrase, true);
            //TODO: Validate response
        }
        return null;
    }

    async removeHash(network, hash) {
        if (network.toLowerCase() === "neo") {
            return _neo.sendRemoveHashTransaction(hash, this._passport, this._passphrase, true);
            //TODO: Validate response
        }

        return null;
    }

    async addClaim(network, claim, hashOnly) {
        if (!network) {
            throw new Error("network not provided");
        }
        if (!claim) {
            throw new Error("claim not provided");
        }

        if (network.toLowerCase() === "neo") {
            let tx = await this._neoService.getAddClaimTransaction(claim, this._passport.wallets[0].address, hashOnly);//  _neoHelper.getAddClaimTransaction(claim, this._passport, this._passphrase);
            if(tx == null){
                return null;
            }
            
            let signed = await _neo.secondarySignAddClaimTransaction(tx, this._passport, this._passphrase);
            return await _neo.sendAddClaimTransaction({ transaction: signed.serialize(), hash: signed.hash }, true);
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
            return _neo.sendRemoveClaimTransaction(claimTypeId, this._passport, this._passphrase, true);
            //TODO: Validate response
        }

        return null;
    }

    //Public get claim for any address
    async getClaim(network, claimTypeId, address) {
        if (network.toLowerCase() === "neo") {
            return await _neo.getClaimForAddress(address, claimTypeId);
        }
        else if(network.toLowerCase() === "eth"){
            return await _eth.getClaimForAddress(address, claimTypeId);
        }

        return null;
    }
};

exports.Blockchain = blockchain;