const _constants = require('../constants').Constants;
const _api = require('../utils/api');
const _neo = require('../utils/neo').NEO;
const _eth = require('../utils/ethereum').Ethereum;
const _bridgeService = require('./bridge.js').BridgeApi;
const _passportService = require('./passport.js').PassportApi;
const _claimService = require('./claim.js').ClaimApi;
const _tokenSwapService = require('./tokenswap.js').TokenSwapApi;
const _applicationService = require('./application.js').ApplicationApi;

class Blockchain {
    async publishPassport(wallet, passport, wait, costOnly)
    {
        if (!wallet)
            throw new Error("wallet not provided for publish.");
        if(!wallet.unlocked && !costOnly)
            throw new Error("wallet not unlocked");

        if (wallet.network.toLowerCase() === "neo") {
            if(costOnly)
                return 0;

            return await _neo.publishPassport(wallet, passport, wait);
        }
        else if(wallet.network.toLowerCase() === "eth"){
            return await _eth.publishPassport(wallet, passport.id, wait, null, costOnly);
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

    async unpublishPassport(passport, wallet, wait, costOnly){
        if(!wallet)
            throw new Error("wallet not provided");
        if(!wallet.unlocked && !costOnly)
            throw new Error("wallet not unlocked");

        if(wallet.network.toLowerCase() === "neo"){
            if(costOnly)
                return 0;

            return await _neo.unpublishPassport(wallet, passport, wait);
        }
        else if(wallet.network.toLowerCase() === "eth"){
            return await _eth.unpublishPassport(wallet, wait, null, costOnly);
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
        if(!wallet.unlocked && !costOnly)
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
        if(!wallet.unlocked && !costOnly)
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

    async removeClaim(wallet, claimTypeId, wait, costOnly) {
        if (!wallet) {
            throw new Error("wallet not provided");
        }
        if (!claimTypeId) {
            throw new Error("claimTypeId not provided");
        }

        if (wallet.network.toLowerCase() === "neo") {
            if(costOnly)
                return 0;

            await _neo.removeClaim(wallet, claimTypeId, wait);
        }
        else if(wallet.network.toLowerCase() === "eth"){
            return await _eth.removeClaim(wallet, claimTypeId, wait, null, costOnly);
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
            let pending = await _eth.getUnapprovedClaimForAddress(address, claimTypeId);
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

    async sendApplicationRequest(passport, password, wallet, partnerId, costOnly){
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!password) {
            throw new Error("password not provided");
        }
        if (!wallet) {
            throw new Error("wallet not provided");
        }
        if (!partnerId) {
            throw new Error("partnerId not provided");
        }

        let networkFee = await _bridgeService.getBridgeNetworkFee(passport, password);

        let recipient = null;
        if(wallet.network.toLowerCase() === "neo")
            recipient = _constants.bridgeAddress;
        else if (wallet.network.toLowerCase() === "eth")
            recipient = _constants.bridgeEthereumAddress;

        let brdgTransferFee = 0;
        if(wallet.network.toLowerCase() === "eth")   
            brdgTransferFee = await this.sendPayment(wallet, networkFee, recipient, "costonly", false, true);
 
        //The initial token transfer fee, the bridge network token send fee, and the gas transfer fee for the token send fee
        if(costOnly)
            return parseFloat(brdgTransferFee);

        let application = null;
        let error = null;
        try{
            application = await _applicationService.createApplication(passport, password, partnerId, wallet.network, wallet.address);

            //Transfer the BRDG to pay network fees
            let transactionId = await this.sendPayment(wallet, networkFee, recipient, application.id);
                
            //Update the transaction info
            return await _applicationService.updatePaymentTransaction(passport, password, application.id, transactionId);
        }
        catch(err){
            error = err.message;
            await _applicationService.remove(passport, password, application.id);
        }
    
        throw new Error(error);
    }

    async sendTokenSwapRequest(passport, password, wallet, receivingWallet, amount, costOnly){
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!password) {
            throw new Error("password not provided");
        }
        if (!wallet) {
            throw new Error("wallet not provided");
        }
        if (!receivingWallet) {
            throw new Error("receiving wallet not provided");
        }
        if(!amount || amount <= 0){
            throw new Error("valid amount not provided");
        }

        let swapAddress = null;
        if(wallet.network.toLowerCase() === "neo")
            swapAddress = _constants.neoSwapAddress;
        else if (wallet.network.toLowerCase() === "eth")
            swapAddress = _constants.ethereumSwapAddress;

        let swapFee = 0;
        let gasTransferFee = 0;
        let brdgTransferFee = 0;
        
        if(receivingWallet.network.toLowerCase() === "eth")
        {
            //If we are sending from NEO -> ETH there's no cost of transferring tokens to the swap address
            //But the gas needed to transfer the tokens on ETH needs to be prepaid to the swap address
            swapFee = await this.sendPayment(receivingWallet, amount, swapAddress, "costonly", false, true);
            gasTransferFee = await this.transferGas(receivingWallet, swapFee, swapAddress, "costonly", false, true);
        }        
        else 
        {
            //We're sending from ETH -> NEO we just have the cost of transferring tokens to the swap address
            brdgTransferFee = await this.sendPayment(wallet, amount, swapAddress, "costonly", false, true);
        }

        //The initial token transfer fee, the bridge network token send fee, and the gas transfer fee for the token send fee
        if(costOnly)
            return parseFloat(swapFee * 2) + parseFloat(brdgTransferFee) + parseFloat(gasTransferFee);
    
        swapFee = parseFloat(swapFee).toFixed(9);

        let tokenSwap = null;
        let error = null;
        try{
            tokenSwap = await _tokenSwapService.createTokenSwap(passport, password, wallet.network, wallet.address, receivingWallet.address, amount);
            if(!tokenSwap && !tokenSwap.id)
                throw new Error("Could not create token swap request on Bridge Network.");

            //Send the GAS for the ethereum swap to the Bridge Network
            let gasTransactionId = null;
            //If we're sending from NEO, we need to prepay the gas from the ETH wallet
            if(receivingWallet.network.toLowerCase() === "eth")
                gasTransactionId = await this.transferGas(receivingWallet, swapFee, _constants.ethereumSwapAddress, tokenSwap.id);
            
            //Transfer the BRDG to the swap address
            let transactionId = await this.sendPayment(wallet, amount, swapAddress, tokenSwap.id);
                
            //Update the transaction info
            return await _tokenSwapService.updatePaymentTransaction(passport, password, tokenSwap.id, transactionId, gasTransactionId);
        }
        catch(err){
            error = err.message;
            await _tokenSwapService.remove(passport, password, tokenSwap.id);
        }

        throw new Error(error);
    }

    async sendClaimPublishRequest(passport, password, wallet, claim, hashOnly, costOnly){
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!password) {
            throw new Error("password not provided");
        }
        if (!wallet) {
            throw new Error("wallet not provided");
        }
        if (!claim) {
            throw new Error("claim not provided");
        }

        let networkFee = await _bridgeService.getBridgeNetworkFee(passport, password);
        let recipient = null;
        if(wallet.network.toLowerCase() === "neo")
            recipient = _constants.bridgeAddress;
        else if (wallet.network.toLowerCase() === "eth")
            recipient = _constants.bridgeEthereumAddress;
    
        let publishFee = 0;
        let gasTransferFee = 0;
        let brdgTransferFee = 0;
        if(wallet.network.toLowerCase() === "eth")
        {
            publishFee = await this.publishClaimTransaction(passport, password, wallet, claim, hashOnly, "costonly", false, true);
            gasTransferFee = await this.transferGas(wallet, publishFee, recipient, "costonly", false, true);
            brdgTransferFee = await this.sendPayment(wallet, networkFee, recipient, "costonly", false, true);
        }        
        //Unverified publish tx cost + Network fee transfer cost + Bridge approval tx cost gas cost + gas transfer cost 
        if(costOnly)
            return parseFloat(publishFee * 2) + parseFloat(brdgTransferFee) + parseFloat(gasTransferFee);
    
        publishFee = parseFloat(publishFee).toFixed(9);
    
        let claimPublish;
        let error;
        try{
            //Create the claim publish request on the Bridge Network
            claimPublish = await _claimService.createClaimPublish(passport, password, wallet.network, wallet.address, claim);
            if(!claimPublish || !claimPublish.id)
                throw new Error("Unable to create claim publish request");

            //Pre-publish the claim to the blockchain unverified first
            if(wallet.network.toLowerCase() === "eth")
                await this.publishClaimTransaction(passport, password, wallet, claim, false, claimPublish.id);
        
            //Send the network fee BRDG transaction using blockchain
            let transactionId = await this.sendPayment(wallet, networkFee, recipient, claimPublish.id);
        
            //Send the GAS approval fee transaction using blockchain (ethereum only)
            let gasTransactionId = null;
            if(wallet.network.toLowerCase() === "eth")
                gasTransactionId = await this.transferGas(wallet, publishFee, recipient, claimPublish.id);
        
            //Update the transaction info
            return await _claimService.updateClaimPaymentTransaction(passport, password, claimPublish.id, transactionId, gasTransactionId);
        }
        catch(err){
            error = err.message;
            await _claimService.remove(claimPublish.id);
        }

        throw new Error(error);
    }

    async sendPassportPublishRequest(passport, password, wallet, costOnly){
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!password) {
            throw new Error("password not provided");
        }
        if (!wallet) {
            throw new Error("wallet not provided");
        }

        if(costOnly)
            return await this.publishPassport(wallet, passport, false, true);

        let passportPublish;
        let error;
        try{
            //Send the tx first to make sure it doesn't fail
            let tx = await this.publishPassport(wallet, passport);
            
            //Create the claim publish request on the Bridge Network
            passportPublish = await _passportService.createPassportPublish(passport, password, wallet.network, wallet.address);
            if(!passportPublish || !passportPublish.id)
                throw new Error("Unable to create claim publish request");

            return passportPublish;
        }
        catch(err){
            error = err.message;
            await _passportService.remove(passport, password, passportPublish.id);
        }

        throw new Error(error);
    }
    
    async publishClaimTransaction(passport, password, wallet, claim, hashOnly, claimPublishId, wait, costOnly) {
        if (!wallet) {
            throw new Error("wallet not provided");
        }
        if (!claimPublishId) {
            throw new Error("claimPublishId not provided");
        }
        if (!claim) {
            throw new Error("claim not provided");
        }

        if (wallet.network.toLowerCase() === "neo") {
            if(costOnly)
                return 0;

            //We do this after the approval process is complete
            console.log("Retrieving Bridge claim publish transaction...");
            let tx = await _claimService.getClaimPublishTransaction(passport, password, claimPublishId);
            console.log(tx);
            if(!tx)
                throw new Error("Unable to retrieve publish transaction for publish");

            //Secondarily sign it and relay the signed transaction
            let signed = await _neo.secondarySignAddClaimTransaction(tx, wallet);
            return await _neo.sendAddClaimTransaction({ transaction: signed.serialize(), hash: signed.hash });
        }
        else if(wallet.network.toLowerCase() == "eth")
        {
            //Publish the unverified claim to Ethereum
            return await _eth.publishClaim(wallet, claim, hashOnly, wait, null, costOnly);
        }

        return null;
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