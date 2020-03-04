const _constants = require('../constants').Constants;
const _neo = require('../utils/neo').NEO;
const _eth = require('../utils/ethereum').Ethereum;
const _neoApi = require('./neo').NEOApi;

var blockchain = class Blockchain {
    constructor(passport, passphrase) {
        this._passport = passport;
        this._passphrase = passphrase;
    }

    async publishPassport(wallet, passport)
    {
        if (!wallet)
            throw new Error("wallet not provided for publish.");
        if(!wallet.unlocked)
            throw new Error("wallet not unlocked");

        if (wallet.network.toLowerCase() === "neo") {
            return await _neo.publishPassport(wallet, passport);
        }
        else if(wallet.network.toLowerCase() === "eth"){
            return await _eth.publishPassport(wallet, passport.id);
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

    async unpublishPassport(wallet){
        if(!wallet)
            throw new Error("wallet not provided");
        if(!wallet.unlocked)
            throw new Error("wallet not unlocked");

        if(wallet.network.toLowerCase() === "neo"){
            return await _neo.unpublishPassport(wallet, this._passport);
        }
        else if(wallet.network.toLowerCase() === "eth"){
            return await _eth.unpublishPassport(wallet);
        }
    }

    async getBalances(network, address) {
        if (network.toLowerCase() === "neo") {
            return await _neo.getAddressBalances(address);
        }
        else if(network.toLowerCase() === "eth"){
            return await _eth.getAddressBalances(address);
        }
    }

    async getRecentTransactions(network, address) {
        if (network.toLowerCase() === "neo") {
            return await _neo.getLatestAddressTransactions(address);
        }
        else if(network.toLowerCase() === "eth"){
            return await _eth.getBrdgTransactions(address);
        }

        return null;
    }

    async sendPayment(passportId, wallet, amount, recipient, paymentIdentifier) {
        //Recipient can be null, it will default to bridge contract address
        if(!passportId)
            throw new Error("passport not provided.");
        if (!wallet)
            throw new Error("wallet not provided.");
        if(!wallet.unlocked)
            throw new Error("wallet not unlocked");
        if (!amount)
            throw new Error("amount not provided.");

        if (wallet.network.toLowerCase() === "neo") {
            //Amount is 100000000 = 1 for NEO
            let res = await _neo.sendBrdg(wallet, recipient, amount, paymentIdentifier);
            let verify = await _neo.verifyTransfer(res.info, amount, recipient, paymentIdentifier);
            return verify.success;
        }
        else if(wallet.network.toLowerCase() === "eth"){
            amount = (amount / 100000000);
            let info = await _eth.sendBrdg(wallet, recipient, amount, paymentIdentifier);
            let verify = await _eth.verifyTransfer(info, wallet.address, recipient, amount, paymentIdentifier);
            return verify;
        }
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
    
    async addClaim(network, claim, hashOnly) {
        if (!network) {
            throw new Error("network not provided");
        }
        if (!claim) {
            throw new Error("claim not provided");
        }

        if (network.toLowerCase() === "neo") {
            let tx = await _neoApi.getAddClaimTransaction(claim, this._passport.wallets[0].address, hashOnly);//  _neoHelper.getAddClaimTransaction(claim, this._passport, this._passphrase);
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