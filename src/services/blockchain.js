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
            let verify = await _neo.verifyTransfer(res.info, recipient, amount, paymentIdentifier);
            return verify.success;
        }
        else if(wallet.network.toLowerCase() === "eth"){
            amount = (amount / 100000000);
            let info = await _eth.sendBrdg(wallet, recipient, amount, paymentIdentifier);
            let verify = await _eth.verifyTransfer(info, wallet.address, recipient, amount, paymentIdentifier);
            return verify;
        }
    }

    async verifyPayment(hash, from, to, amount, paymentIdentifier){
        if(!hash)
            throw new Error("hash not provided.");
        if(!from)
            throw new Error("from not unlocked");
        if(!from)
            throw new Error("from not provided");
        if(!amount)
            throw new Error("amount not provided.");
        if(!paymentIdentifier)
            throw new Error("payment identifier not provided.");

        if (wallet.network.toLowerCase() === "neo") {
            //Amount is 100000000 = 1 for NEO
            let verify = await _neo.verifyTransferFromHash(hash, to, amount, paymentIdentifier);
            return verify.success;
        }
        else if(wallet.network.toLowerCase() === "eth"){
            amount = (amount / 100000000);
            let verify = await _eth.verifyTransferFromHash(hash, from, to, amount, paymentIdentifier);
            return verify;
        }
    }

    async addClaim(wallet, claim, hashOnly) {
        if (!wallet) {
            throw new Error("walletnot provided");
        }
        if (!claim) {
            throw new Error("claim not provided");
        }

        if (wallet.network.toLowerCase() === "neo") {
            //For NEO we create a signed preapproval transaction then the user signs and relays
            let tx = await _neoApi.getAddClaimTransaction(this._passport, this._passphrase, claim, wallet.address, hashOnly);
            if(tx == null){
                return null;
            }
            //Secondarily sign it and relay the signed transaction
            let signed = await _neo.secondarySignAddClaimTransaction(tx, wallet);
            return await _neo.sendAddClaimTransaction({ transaction: signed.serialize(), hash: signed.hash });
        }
        else if(wallet.network.toLowerCase() == "eth"){
             //For ETH the user publishes the claim then requests an approval to publish
            await _eth.publishClaim(wallet, claim, hashOnly);
            //TODO: Send a request to the Bridge API to approve the publish
        }

        return null;
    }

    async removeClaim(wallet, claimTypeId) {
        if (!wallet) {
            throw new Error("wallet not provided");
        }
        if (!claimTypeId) {
            throw new Error("claimTypeId not provided");
        }

        if (wallet.network.toLowerCase() === "neo") {
            await _neo.removeClaim(wallet, claimTypeId);
        }
    }

    //Bridge approval function
    async approveClaimPublish(wallet, address, claim, hashOnly)
    {
        if(!wallet)
            throw new Error("wallet not provided");

        if(wallet.network.toLowerCase() == "neo"){
            //For NEO we create a signed preapproval transaction then the user signs and relays
            return await _neo.createApprovedClaimTransaction(wallet, claim, secondaryAddress, hashOnly);
        }
        else if(wallet.network.toLowerCase() == "eth"){
            //For ETH the user publishes the claim then requests an approval to publish
            return await _eth.approvePublishClaim(wallet, address, claim.claimTypeId, claim.createdOn, claim.claimValue, hashOnly);
        }
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