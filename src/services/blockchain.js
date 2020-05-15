const _constants = require('../constants').Constants;
const _api = require('../utils/api');
const _neo = require('../utils/neo').NEO;
const _eth = require('../utils/ethereum').Ethereum;
const _claimService = require('./claim.js').ClaimApi;
const _tokenSwapService = require('./tokenswap.js').TokenSwapApi;

class Blockchain {
    async publishPassport(wallet, passport, costOnly)
    {
        if (!wallet)
            throw new Error("wallet not provided for publish.");
        if(!wallet.unlocked)
            throw new Error("wallet not unlocked");

        if (wallet.network.toLowerCase() === "neo") {
            if(costOnly)
                return 0;

            return await _neo.publishPassport(wallet, passport);
        }
        else if(wallet.network.toLowerCase() === "eth"){
            return await _eth.publishPassport(wallet, passport.id, null, costOnly);
        }

        return null;
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

    async unpublishPassport(passport, wallet, costOnly){
        if(!wallet)
            throw new Error("wallet not provided");
        if(!wallet.unlocked)
            throw new Error("wallet not unlocked");

        if(wallet.network.toLowerCase() === "neo"){
            if(costOnly)
                return 0;

            return await _neo.unpublishPassport(wallet, passport);
        }
        else if(wallet.network.toLowerCase() === "eth"){
            return await _eth.unpublishPassport(wallet, null, costOnly);
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

    async transferGas(wallet, amount, recipient, paymentIdentifier, wait, costOnly){
        if (!wallet)
            throw new Error("wallet not provided.");
        if(!wallet.unlocked)
            throw new Error("wallet not unlocked");
        if (!amount)
            throw new Error("amount not provided.");

        if (wallet.network.toLowerCase() === "neo") {
            throw new Error("not implemented");
        }
        else if(wallet.network.toLowerCase() === "eth"){
            let info = await _eth.sendEth(wallet, recipient, amount, paymentIdentifier, wait, null, costOnly);
            if(costOnly)
                return info;

            //If we aren't waiting, just return the hash
            if(!wait)
                return info;

            let verify = await this.verifyGasTransfer(wallet.network, info.transactionHash, wallet.address, recipient, amount, paymentIdentifier);
            if(verify.success)
                return info.transactionHash;

            return null;
        }
    }

    async sendPayment(wallet, amount, recipient, paymentIdentifier, wait, costOnly) {
        //Recipient can be null, it will default to bridge contract address
        if (!wallet)
            throw new Error("wallet not provided.");
        if(!wallet.unlocked)
            throw new Error("wallet not unlocked");
        if (!amount)
            throw new Error("amount not provided.");

        if (wallet.network.toLowerCase() === "neo") {
            if(costOnly)
                return 0;

            let res = await _neo.sendBrdg(wallet, recipient, amount, paymentIdentifier, wait);

            //If we aren't waiting, just return the hash
            if(!wait)
                return res.txid;

            let verify = await _neo.verifyTransfer(res.info, wallet.address, recipient, amount, paymentIdentifier);
            return verify.success;
        }
        else if(wallet.network.toLowerCase() === "eth"){
            let info = await _eth.sendBrdg(wallet, recipient, amount, paymentIdentifier, wait, null, costOnly);
            console.log(info);
            if(costOnly)
                return info;

            //If we aren't waiting, just return the hash
            if(!wait)
                return info;

            let verify = await _eth.verifyTokenPayment(info, wallet.address, recipient, amount, paymentIdentifier);
            return verify.success;
        }
    }

    async verifyPayment(network, hash, from, to, amount, paymentIdentifier){
        if(!hash)
            throw new Error("hash not provided.");
        if(!from)
            throw new Error("from not provided");
        if(!amount)
            throw new Error("amount not provided.");
        if(!paymentIdentifier)
            throw new Error("payment identifier not provided.");

        if (network.toLowerCase() === "neo") {
            //Amount is 100000000 = 1 for NEO
            amount = (amount * 100000000);
            return await _neo.verifyTransferFromHash(hash, from, to, amount, paymentIdentifier);
        }
        else if(network.toLowerCase() === "eth"){
            return await _eth.verifyTokenPaymentFromHash(hash, from, to, amount, paymentIdentifier);
        }
    }

    async verifyGasTransfer(network, hash, from, to, amount, paymentIdentifier){
        if(!hash)
            throw new Error("hash not provided.");
        if(!from)
            throw new Error("from not provided");
        if(!amount)
            throw new Error("amount not provided.");
        if(!paymentIdentifier)
            throw new Error("payment identifier not provided.");

        if (network.toLowerCase() === "neo") {
            throw new Error("not implemented");
        }
        else if(network.toLowerCase() === "eth"){
            return await _eth.verifyEthPaymentFromHash(hash, from, to, amount, paymentIdentifier);
        }
    }

    async getTransactionStatus(network, hash){
        if(!network)
            throw new Error("network not provided");
        if(!hash)
            throw new Error("hash not provided");

        if (network.toLowerCase() === "neo") {
            return await _neo.getTransactionStatus(hash);
        }
        else if(network.toLowerCase() === "eth"){
            return await _eth.getTransactionStatus(hash);
        }
    }

    async pollTransactionComplete(network, txid){
        let blockchain = this;
        return new Promise(function (resolve, reject) {
            (async function waitForComplete(){
                let res = await blockchain.getTransactionStatus(network, txid);
                if(res.complete){
                    console.log("Transaction found and complete");
                    return resolve(res);
                }

                console.log("Transaction not complete. Waiting and retrying.");
                setTimeout(waitForComplete, 15000);
            })();
        });
    }

    async removeClaim(wallet, claimTypeId, costOnly) {
        if (!wallet) {
            throw new Error("wallet not provided");
        }
        if (!claimTypeId) {
            throw new Error("claimTypeId not provided");
        }

        if (wallet.network.toLowerCase() === "neo") {
            if(costOnly)
                return 0;

            await _neo.removeClaim(wallet, claimTypeId);
        }
        else if(wallet.network.toLowerCase() === "eth"){
            return await _eth.removeClaim(wallet, claimTypeId, null, costOnly);
        }
    }

    //Public get claim for any address
    async getClaim(network, claimTypeId, address) {
        if (network.toLowerCase() === "neo") {
            let claim = await _neo.getClaimForAddress(address, claimTypeId);
            return{
                claim,
                verified: claim != null
            };
        }
        else if(network.toLowerCase() === "eth"){
            let pending = await _eth.getUnapprovedClaimForAddress(wallet.address, claim.claimTypeId);
            let published = await _eth.getClaimForAddress(address, claimTypeId);

            let claim = null;
            let verified = false;
            if(pending != null)
                claim = pending;
            if(published != null){
                claim = published;
                verified = true;
            }
                
            return{
                claim,
                verified
            };
        }

        return null;
    }

    async getOracleGasPrice(network){
        if(network.toLowerCase() === "neo")
            return null;
        else if(network.toLowerCase() === "eth")
            return await _eth.getOracleGasPrice();
    }

    //Bridge internal use, transaction will fail with non-bridge signatures
    //For NEO we create a signed preapproval transaction then the user signs and relays
    async createClaimPublishTransaction(wallet, address, claim, hashOnly, costOnly)
    {
        if(!wallet)
            throw new Error("wallet not provided");

        if(wallet.network.toLowerCase() == "neo"){
            if(costOnly)
                return 0;

            return await _neo.createApprovedClaimTransaction(wallet, claim, address, hashOnly);
        }
    }
};

exports.Blockchain = new Blockchain();