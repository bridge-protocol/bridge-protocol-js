const _constants = require('../constants').Constants;
const _api = require('../utils/api');
const _neo = require('../utils/neo').NEO;
const _eth = require('../utils/ethereum').Ethereum;

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
            if(costOnly)
                return info;

            //If we aren't waiting, just return the hash
            if(!wait)
                return info;

            let verify = await _eth.verifyTokenPayment(info, wallet.address, recipient, amount, paymentIdentifier);
            return verify.success;
        }
    }
    
    async sendSwapRequest(walletFrom, walletTo, amount, costOnly){
        if(!walletFrom)
            throw new Error("wallet from not provided");
        if(!walletTo)
            throw new Error("wallet to not provided");
        if(!amount || amount <= 0)
            throw new Error("valid amount not provided");

        let swapAddress = null;
        let swapInfo = null;
        if(walletFrom.network.toLowerCase() === "neo"){
            swapAddress = _constants.neoSwapAddress;

            //To do a NEO to ETH transfer, the GAS fees of the swap transfer needs to be prepaid to the swap service
            //The fee being calculated is all the ETH GAS fees required as prepayment on the backend ETH swap
            //NEO will have no GAS transfer costs for the BRDG to be transfered to the swap address
            let brdgSendCost = await _eth.sendBrdg(walletTo, _constants.ethereumSwapAddress, amount, "costonly", false, null, true);
            let gasTransferCost = await _eth.sendEth(walletTo, _constants.ethereumSwapAddress, brdgSendCost, "costonly", false, null, true);
            let cost = parseFloat(brdgSendCost) + parseFloat(gasTransferCost);
            if(costOnly)
                return cost.toFixed(9);

            //Send a gas prepayment tx to the swap address
            let gasTx = await _eth.sendEth(walletTo, _constants.ethereumSwapAddress, cost, walletFrom.address, false, null, false);
            
            //The gas prepayment tx and the target NEO address for the swap
            swapInfo = walletTo.address + "-" + gasTx;
        }
        else if(walletFrom.network.toLowerCase() === "eth"){
            swapAddress = _constants.ethereumSwapAddress;
            
            //The cost will be the price of the GAS to transfer the BRDG to the swap address
            let cost = await _eth.sendBrdg(walletFrom, _constants.ethereumSwapAddress, amount, "costonly", false, null, true);
            if(costOnly)
                return parseFloat(cost).toFixed(9);

            //No prepayment transaction, just the target ETH address for the swap
            swapInfo = walletTo.address;
        }

        console.log("Sending swap request for " + amount + " BRDG from " + walletFrom.network + ":" + walletFrom.address + " to " + walletTo.network + ":" + walletTo.address + " identifier:" + swapInfo);
        return await this.sendPayment(walletFrom, amount, swapAddress, swapInfo, false, false); //This will be long running, no need to wait
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

    async addClaim(passport, password, wallet, claim, hashOnly, costOnly) {
        if (!wallet) {
            throw new Error("wallet not provided");
        }
        if (!claim) {
            throw new Error("claim not provided");
        }

        if (wallet.network.toLowerCase() === "neo") {
            if(costOnly)
                return 0;

            console.log("Retrieving Bridge claim publish transaction...")
            //For Bridge creates a signed preapproval transaction that the user signs and relays
            let tx = await this.getClaimPublishApproval(passport, password, null, wallet, claim, hashOnly);
            if(tx == null)
                throw new Error("Unable to add claim: integrity or signer check failed.");
            //Secondarily sign it and relay the signed transaction
            let signed = await _neo.secondarySignAddClaimTransaction(tx, wallet);
            return await _neo.sendAddClaimTransaction({ transaction: signed.serialize(), hash: signed.hash });
        }
        else if(wallet.network.toLowerCase() == "eth"){
            let pending = await _eth.getUnapprovedClaimForAddress(wallet.address, claim.claimTypeId);
            let pendingClaim = (pending != null && pending.value == claim.claimValue.toString() && pending.date == claim.createdOn.toString());

            //We need to account for both transaction costs
            let publishCost = await _eth.publishClaim(wallet, claim, hashOnly, null, true);
            let approveCost = await _eth.approvePublishClaim(wallet, wallet.address, claim, hashOnly, null, true);
            let sendGasCost = await _eth.sendEth(wallet, wallet.address, approveCost, "identifier", false, null, true);
            let totalCost = parseFloat(publishCost) + parseFloat(approveCost) + parseFloat(sendGasCost);
            if(pendingClaim) //We already have a pending publish, just get it approved and don't re-send the first tx
                totalCost = parseFloat(approveCost) + parseFloat(sendGasCost);
            if(costOnly)
                return totalCost.toFixed(9);

            if(!pendingClaim){
                //For ETH the user publishes the claim then requests an approval to publish
                console.log("Pending claim not found, publishing");
                await _eth.publishClaim(wallet, claim, hashOnly);
            }
            else{
                console.log("Pending claim found, skipping to approval");
            }

            console.log("Claim publish request received.  Sending Bridge claim publish approval request.");
            let gasTxId = await this.transferGas(wallet, approveCost, _constants.bridgeEthereumAddress, claim.identifier, true);
            if(!gasTxId)
                throw new Error("gas transfer transaction failed");

            //Bridge verify and approve the prepublish
            let txid = await this.getClaimPublishApproval(passport, password, gasTxId, wallet, claim, hashOnly);
            if(txid == null)
                throw new Error("Unable to get publish approval: transaction failed.");

            //Poll to wait for complettion
            return await this.pollTransactionComplete(wallet.network, txid);
        }

        return null;
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

    //Bridge approval API call
    async getClaimPublishApproval(passport, password, transactionId, wallet, claim, hashOnly) {
        let apiBaseUrl = _constants.bridgeApiUrl + "blockchain/";
        claim.createdOn = claim.createdOn.toString();
        var obj = {
            network: wallet.network,
            claim,
            address: wallet.address,
            hashOnly,
            transactionId
        };

        var api = new _api.APIUtility(apiBaseUrl, passport, password);
        let res = await api.callApi("POST", "approveclaimpublish", obj);

        if(res == false)
            res = null;

        return res;
    }

    //Bridge approval function, internal
    async approveClaimPublish(wallet, address, claim, hashOnly, costOnly)
    {
        if(!wallet)
            throw new Error("wallet not provided");

        if(wallet.network.toLowerCase() == "neo"){
            if(costOnly)
                return 0;

            //For NEO we create a signed preapproval transaction then the user signs and relays
            return await _neo.createApprovedClaimTransaction(wallet, claim, address, hashOnly);
        }
        else if(wallet.network.toLowerCase() == "eth"){
            //For ETH the user publishes the claim then requests an approval to publish
            return await _eth.approvePublishClaim(wallet, address, claim, hashOnly, null, costOnly);
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