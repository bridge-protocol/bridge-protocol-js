const _constants = require('../utils/constants');
const Web3 = require("web3");
const _tx = require("ethereumjs-tx");
const _wallet = require("ethereumjs-wallet");
const _util = require("ethereumjs-util");
const _abi = [{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"addApprovedOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"claimType","type":"string"},{"internalType":"uint256","name":"claimDate","type":"uint256"},{"internalType":"string","name":"claimValue","type":"string"}],"name":"approvePublishClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"claimType","type":"string"},{"internalType":"uint256","name":"claimDate","type":"uint256"},{"internalType":"string","name":"claimValue","type":"string"}],"name":"publishClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"passport","type":"string"}],"name":"publishPassport","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"removeApprovedOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"claimType","type":"string"}],"name":"removeClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"takeOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"unpublishPassport","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"passport","type":"string"}],"name":"getAddressForPassport","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"claimType","type":"string"}],"name":"getClaim","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getPassportForAddress","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];
const _tokenAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"memo","type":"string"}],"name":"Memo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"memo","type":"string"}],"name":"transferWithMemo","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const _pollInterval = 15000;
const _pollRetries = 20;
const _gasLimit = 2100000;
const _gasPriceGwei = 6;

var ethereum = class Ethereum {
    constructor(rpcUrl) {
        this._rpcUrl = rpcUrl;
        this._web3 = new Web3(new Web3.providers.HttpProvider(this._rpcUrl));
        this._bridgeContractAddress = _constants.Constants.bridgeEthereumContractAddress;
        this._bridgeTokenContractAddress = _constants.Constants.bridgeEthereumERC20Address;
        this._chain = _constants.Constants.bridgeEthereumChain;
        this._contract = new this._web3.eth.Contract(_abi, this._bridgeContractAddress);
        this._token = new this._web3.eth.Contract(_tokenAbi, this._bridgeTokenContractAddress);
    }

    createWallet(password){
        let wallet = _wallet.generate();
        return this._getWalletInfo(wallet, password);
    }

    getWalletFromPrivateKey(privateKeyString, password){
        const privateKeyBuffer = _util.toBuffer(privateKeyString);
        let wallet = _wallet.fromPrivateKey(privateKeyBuffer);
        return this._getWalletInfo(wallet, password);
    }

    getWalletFromKeystore(keystore, password){
        let wallet = _wallet.fromV3(keystore, password);
        return this._getWalletInfo(wallet, password);
    }

    unlockWallet(walletInfo, password){
        walletInfo.wallet = _wallet.fromV3(walletInfo.key, password);
    }

    _getWalletKeystore(wallet, password){
        return wallet.toV3(password);
    }

    _getWalletInfo(wallet, password){
        return {
            network: "ETH",
            address: wallet.getAddressString(),
            key: this._getWalletKeystore(wallet, password)
        };
    }

    async getEthBalance(address) {
        let balance = await this._web3.eth.getBalance(address);
        return this._web3.utils.fromWei(balance,"ether");
    };

    async getBrdgBalance(account){
        return await this._token.methods.balanceOf(account).call();
    }

    async sendBrdg(wallet, recipient, amount, memo, nonce, wait){
        const data = this._token.methods.transferWithMemo(recipient, amount, memo).encodeABI();
        if(wait)
            return await this._broadcastTransactionWaitStatus(wallet, this._bridgeTokenContractAddress, data, nonce); 
        else
            return await this._broadcastTransaction(wallet, this._bridgeTokenContractAddress, data, nonce);
    }

    
    async verifyTransactionMemo(hash, memo){
        let res = await this._getTransactionInfo(hash);
        if(!res)
            return false;

        for(let i=0; i<res.logs.length; i++){
            let log = res.logs[i];
            if(log.topics[0] == "0xb0734c6ca9ae9b7406dd80224cb0488aed0928eef358da7449505fa59b8d7a2a"){
                return this._web3.utils.hexToUtf8(log.data).includes(memo);
            }
        }
        
        return false;
    }

    async approvePublishClaim(wallet, account, claimType, claimDate, claimValue, nonce, wait){
        if(!claimType)
            throw new Error("Claim type is required.");
        if(!claimValue)
            throw new Error("Claimm value is required");
        if(!Number.isInteger(claimDate) || claimDate <= 0)
            throw new Error("Date must be an integer");

        const data = this._contract.methods.approvePublishClaim(account, claimType, claimDate, claimValue).encodeABI();

        if(wait)
            return await this._broadcastTransactionWaitStatus(wallet, this._bridgeContractAddress, data, nonce);
        else
            return await this._broadcastTransaction(wallet, this._bridgeContractAddress, data, nonce);
    }

    async publishClaim(wallet, claimType, claimDate, claimValue, nonce, wait){
        if(!claimType)
            throw new Error("Claim type is required.");
        if(!claimValue)
            throw new Error("Claimm value is required");
        if(!Number.isInteger(claimDate) || claimDate <= 0)
            throw new Error("Date must be an integer");

        const data = this._contract.methods.publishClaim(claimType, claimDate, claimValue).encodeABI();
        if(wait)
            return await this._broadcastTransactionWaitStatus(wallet, this._bridgeContractAddress, data, nonce);
        else
            return await this._broadcastTransaction(wallet, this._bridgeContractAddress, data, nonce);
    }

    async removeClaim(wallet, claimType, nonce, wait){
        if(!claimType)
            throw new Error("Claim type is required.");

        const data = this._contract.methods.removeClaim(claimType).encodeABI();
        if(wait)
            return await this._broadcastTransactionWaitStatus(wallet, this._bridgeContractAddress, data, nonce);
        else
            return await this._broadcastTransaction(wallet, this._bridgeContractAddress, data, nonce);
    }

    async publishPassport(wallet, passport, nonce, wait){
        const data = this._contract.methods.publishPassport(passport).encodeABI();
        if(wait)
            return await this._broadcastTransactionWaitStatus(wallet, this._bridgeContractAddress, data, nonce);
        else
            return await this._broadcastTransaction(wallet, this._bridgeContractAddress, data, nonce);
    }

    async unpublishPassport(wallet, nonce, wait){
        const data = this._contract.methods.unpublishPassport().encodeABI();
        if(wait)
            return await this._broadcastTransactionWaitStatus(wallet, this._bridgeContractAddress, data, nonce);
        else
            return await this._broadcastTransaction(wallet, this._bridgeContractAddress, data, nonce);
    }

    async getClaimForAddress(account, claimType){
        let res = await this._contract.methods.getClaim(account, claimType.toString()).call();
        if(res.length == 0)
            return null;

        res = res.replace(/\0/g,"").trim();
        let idx1 = res.indexOf(" ");
        let idx2 = res.indexOf(" ", idx1+1);
        let claim = {
            type: res.substring(0, idx1),
            date: res.substring(idx1+1,idx2),
            value: res.substring(idx2+1, res.length)
        };

        return claim;
    };

    async getPassportForAddress(account){
        return await this._contract.methods.getPassportForAddress(account).call();
    }

    async getAddressForPassport(passport){
        return await this._contract.methods.getAddressForPassport(passport).call();
    }

    async checkConnected(){
        return new Promise(async (resolve, reject) => {
            this._web3.eth.net.isListening()
            .then(() => resolve(true))
            .catch(e => reject(e));
        });
    };

    async checkTransactionSuccess(hash){
        let res = await this._getTransactionStatus(hash);
        if(res && res.status)
            return res.status;

        return null;
    }

    async _broadcastTransactionWaitStatus(wallet, contract, data, nonce) {
        let eth = this;
        return new Promise(async (resolve, reject) => {
            eth._broadcastTransaction(wallet, contract, data, nonce)
                .then(async res => {
                    eth._checkTransactionComplete(res.hash, function (info) {
                        resolve({ hash: res.hash, nonce: res.nonce, info });
                    });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    async _checkTransactionComplete(hash, callback, count) {
        let eth = this;

        if (!count)
            count = 0;

        if (count >= _pollRetries) {
            console.log("Retry count exceeded.");
            callback(null);
        }

        if (count == 0) {
            console.log("Waiting for completion.");
        }

        count++;
        setTimeout(async function () {
            console.log("Checking transaction complete for " + hash + " (" + count + ")");
            let res = await eth._getTransactionInfo(hash);
            if(res)
            {
                console.log("Transaction found and complete");
                callback(res);
            }  
            else
            {
                console.log("Transaction not found or not complete, waiting and retrying...");
                await eth._checkTransactionComplete(hash, callback, count);
            }      
        }, _pollInterval);
    }

    async _getTransactionInfo(hash){
        return await this._web3.eth.getTransactionReceipt(hash);
    }

    async _broadcastTransaction(wallet, contract, data, nonce){
        if(!wallet.wallet)
            throw new Error("Wallet is not unlocked.");

        if(!contract)
            throw new Error("Contract is not specified.");

        if(!data)
            throw new Error("No contract data provided.");

        let address = wallet.wallet.getAddressString();
        let privateKey = wallet.wallet.getPrivateKey();
        return new Promise((resolve,reject) => {
            this._web3.eth.getTransactionCount(address, (err, txCount) => {
                if(!nonce || txCount > nonce)
                    nonce = txCount;

                // Build the transaction
                const txObject = {
                    nonce:    this._web3.utils.toHex(nonce), 
                    to:       contract,
                    value:    this._web3.utils.toHex(this._web3.utils.toWei("0", "ether")),
                    gasLimit: this._web3.utils.toHex(_gasLimit),
                    gasPrice: this._web3.utils.toHex(this._web3.utils.toWei(_gasPriceGwei.toString(), "gwei")),
                    data: data  
                }
                // Sign the transaction
                const tx = new _tx(txObject, {"chain":this._chain});
                tx.sign(privateKey);
                
                const serializedTx = tx.serialize();
                const raw = "0x" + serializedTx.toString("hex");
                
                // Broadcast the transaction
                this._web3.eth.sendSignedTransaction(raw, (err, hash) => {
                    if(err)
                        reject(err);

                    resolve({ hash, nonce });
                });
            });
        });
    }
};

exports.Ethereum = ethereum;