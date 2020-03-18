const _constants = require('../constants').Constants;
const _neo = require('../utils/neo').NEO;
const _eth = require('../utils/ethereum').Ethereum;
const _neoApi = require('./neo').NEOApi;

class Blockchain {
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

    async unpublishPassport(passport, wallet){
        if(!wallet)
            throw new Error("wallet not provided");
        if(!wallet.unlocked)
            throw new Error("wallet not unlocked");

        if(wallet.network.toLowerCase() === "neo"){
            return await _neo.unpublishPassport(wallet, passport);
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

    async sendPayment(wallet, amount, recipient, paymentIdentifier, wait) {
        //Recipient can be null, it will default to bridge contract address
        if (!wallet)
            throw new Error("wallet not provided.");
        if(!wallet.unlocked)
            throw new Error("wallet not unlocked");
        if (!amount)
            throw new Error("amount not provided.");

        if (wallet.network.toLowerCase() === "neo") {
            //Amount is 100000000 = 1 for NEO
            amount = (amount * 100000000);
            let res = await _neo.sendBrdg(wallet, recipient, amount, paymentIdentifier, wait);

            //If we aren't waiting, just return the hash
            if(!wait)
                return res.txid;

            let verify = await _neo.verifyTransfer(res.info, recipient, amount, paymentIdentifier);
            return verify.success;
        }
        else if(wallet.network.toLowerCase() === "eth"){
            let info = await _eth.sendBrdg(wallet, recipient, amount, paymentIdentifier, wait);

            //If we aren't waiting, just return the hash
            if(!wait)
                return info;

            let verify = await _eth.verifyTransfer(info, wallet.address, recipient, amount, paymentIdentifier);
            return verify.success;
        }
    }

    async verifyPayment(network, hash, from, to, amount, paymentIdentifier){
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

        if (network.toLowerCase() === "neo") {
            //Amount is 100000000 = 1 for NEO
            amount = (amount * 100000000);
            return await _neo.verifyTransferFromHash(hash, to, amount, paymentIdentifier);
        }
        else if(network.toLowerCase() === "eth"){
            return await _eth.verifyTransferFromHash(hash, from, to, amount, paymentIdentifier);
        }
    }

    async addClaim(passport, password, wallet, claim, hashOnly) {
        if (!wallet) {
            throw new Error("walletnot provided");
        }
        if (!claim) {
            throw new Error("claim not provided");
        }

        if (wallet.network.toLowerCase() === "neo") {
            //For NEO we create a signed preapproval transaction then the user signs and relays
            let tx = await _neoApi.getAddClaimTransaction(passport, password, claim, wallet.address, hashOnly);
            if(tx == null)
                throw new Error("Unable to add claim: integrity or signer check failed.");
            
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
        else if(wallet.network.toLowerCase() === "eth"){
            await _eth.removeClaim(wallet, claimTypeId);
        }
    }

    //Bridge approval function
    async approveClaimPublish(wallet, address, claim, hashOnly)
    {
        if(!wallet)
            throw new Error("wallet not provided");

        if(wallet.network.toLowerCase() == "neo"){
            //For NEO we create a signed preapproval transaction then the user signs and relays
            return await _neo.createApprovedClaimTransaction(wallet, claim, address, hashOnly);
        }
        else if(wallet.network.toLowerCase() == "eth"){
            //For ETH the user publishes the claim then requests an approval to publish
            return await _eth.approvePublishClaim(wallet, address, claim, hashOnly);
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

exports.Blockchain = new Blockchain();