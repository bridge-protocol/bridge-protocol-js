const _constants = require('../utils/constants');
const Web3 = require("web3");
const _tx = require("ethereumjs-tx").Transaction;
const _abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"claimType","type":"string"},{"internalType":"uint256","name":"claimDate","type":"uint256"},{"internalType":"string","name":"claimValue","type":"string"}],"name":"approvePublishClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"passport","type":"string"}],"name":"getAddressForPassport","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"claimType","type":"string"}],"name":"getClaim","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getPassportForAddress","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"claimType","type":"string"},{"internalType":"uint256","name":"claimDate","type":"uint256"},{"internalType":"string","name":"claimValue","type":"string"}],"name":"publishClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"passport","type":"string"}],"name":"publishPassport","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"claimType","type":"string"}],"name":"removeClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpublishPassport","outputs":[],"stateMutability":"nonpayable","type":"function"}];

var ethereum = class Ethereum {
    constructor(rpcUrl, account, privateKey) {
        this._rpcUrl = rpcUrl;
        this._account = account;
        this._privatekey = Buffer.from(privateKey, "hex");
        this._web3 = new Web3(new Web3.providers.HttpProvider(this._rpcUrl));
        this._bridgeContractAddress = _constants.Constants.bridgeEthereumContractAddress;
        this._chain = _constants.Constants.bridgeEthereumChain;
        this._contract = new this._web3.eth.Contract(_abi, this._bridgeContractAddress);
    }

    async approvePublishClaim(account, claimType, claimDate, claimValue, nonce){
        if(!claimType)
            throw new Error("Claim type is required.");
        if(!claimValue)
            throw new Error("Claimm value is required");
        if(!Number.isInteger(claimDate) || claimDate <= 0)
            throw new Error("Date must be an integer");

        const data = this._contract.methods.approvePublishClaim(account, claimType, claimDate, claimValue).encodeABI();
        return await this._broadcastTransaction(data, nonce);
    }

    async publishClaim(claimType, claimDate, claimValue, nonce){
        if(!claimType)
            throw new Error("Claim type is required.");
        if(!claimValue)
            throw new Error("Claimm value is required");
        if(!Number.isInteger(claimDate) || claimDate <= 0)
            throw new Error("Date must be an integer");

        const data = this._contract.methods.publishClaim(claimType, claimDate, claimValue).encodeABI();
        return await this._broadcastTransaction(data, nonce);
    }

    async removeClaim(claimType, nonce){
        if(!claimType)
            throw new Error("Claim type is required.");

        const data = this._contract.methods.removeClaim(claimType).encodeABI();
        return await this._broadcastTransaction(data, nonce);
    }

    async publishPassport(passport, nonce){
        const data = this._contract.methods.publishPassport(passport).encodeABI();
        return await this._broadcastTransaction(data, nonce);
    }

    async unpublishPassport(nonce){
        const data = this._contract.methods.unpublishPassport().encodeABI();
        return await this._broadcastTransaction(data, nonce);
    }

    async getClaimForAddress(account, claimType){
        let res = await this._contract.methods.getClaim(account, claimType.toString()).call();
        res = res.replace(/\0/g,"").trim();
        let idx = res.indexOf(" ");

        let claim = {
            date: res.substring(0,idx),
            value: res.substring(idx+1, res.length)
        };

        return claim;
    };

    async getPassportForAddress(account){
        return await this._contract.methods.getPassportForAddress(account).call();
    }

    async getAddressForPassport(passport){
        return await this._contract.methods.getAddressForPassport(passport).call();
    }

    async getbalance(address) {
        let balance = await this._web3.eth.getBalance(address);
        return this._web3.utils.fromWei(balance,"ether");
    };

    async checkConnected(){
        return new Promise(async (resolve, reject) => {
            this._web3.eth.net.isListening()
            .then(() => resolve(true))
            .catch(e => reject(e));
        });
    };

    async _broadcastTransaction(data, nonce){
        return new Promise((resolve,reject) => {
            this._web3.eth.getTransactionCount(this._account, (err, txCount) => {
                if(!nonce || txCount > nonce)
                    nonce = txCount;

                // Build the transaction
                const txObject = {
                    nonce:    this._web3.utils.toHex(nonce), 
                    to:       this._bridgeContractAddress,
                    value:    this._web3.utils.toHex(this._web3.utils.toWei("0", "ether")),
                    gasLimit: this._web3.utils.toHex(2100000),
                    gasPrice: this._web3.utils.toHex(this._web3.utils.toWei("6", "gwei")),
                    data: data  
                }
                // Sign the transaction
                const tx = new _tx(txObject, {"chain":this._chain});
                tx.sign(this._privatekey);
                
                const serializedTx = tx.serialize();
                const raw = "0x" + serializedTx.toString("hex");
                
                // Broadcast the transaction
                const transaction = this._web3.eth.sendSignedTransaction(raw, (err, hash) => {
                    if(err)
                        reject(err);

                    resolve({ hash, nonce });
                });
            });
        });
    }
};

exports.Ethereum = ethereum;