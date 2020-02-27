const _constants = require('../utils/constants');
const Web3 = require("web3");
const _fetch = require('node-fetch');
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
    constructor(jsonRpcUrl, etherscanApiUrl, etherscanUrl) {
        this._rpcUrl = jsonRpcUrl;
        this._etherscanApiUrl = etherscanApiUrl;
        this._etherscanUrl = etherscanUrl;
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

    getPrivateKey(walletInfo){
        if(!walletInfo.wallet){
            throw new Error("Wallet is not unlocked.");
        }

        return walletInfo.wallet.getPrivateKeyString();
    }

    async getEthBalance(address) {
        console.log("Retrieving ETH balance");
        let res = await this._callEtherscan("&module=account&action=balance&address=" + address + "&tag=latest");
        if(!res || res.status != "1"){
            console.log("Error getting balance.");
            return 0;
        }

        return this._web3.utils.fromWei(res.result,"ether");
    };

    async getBrdgBalance(address){
        console.log("Retrieving BRDG balance")
        let res = await this._callEtherscan("&module=account&action=tokenbalance&contractaddress=" + this._bridgeTokenContractAddress + "&address=" + address + "&tag=latest");
        if(!res || res.status != "1"){
            console.log("Error getting balance.");
            return 0;
        }

        return res.result;
    }

    async getBrdgTransactions(address){
        console.log("Retrieving transactions");
        let res = await this._callEtherscan("&module=account&action=tokentx&contractaddress=" + this._bridgeTokenContractAddress + "&address=" + address + "&startblock=0&endblock=999999999&sort=desc");
        if(!res || res.status != "1"){
            console.log("Error getting transactions.");
            return null;
        }

        let txs = [];
        for(let i=0; i<res.result.length; i++){
            let tx = res.result[i];
            txs.push({
                hash: tx.hash,
                timeStamp: tx.timeStamp,
                amount: tx.value,
                from: tx.from,
                to: tx.to,
                url: this._etherscanUrl + "/tx/" + tx.hash
            });
        }
            
        return txs;
    }

    async sendBrdg(wallet, recipient, amount, memo, nonce){
        const data = this._token.methods.transferWithMemo(recipient, amount, memo).encodeABI();
        console.log("Creating BRDG-ERC20.sendBrdg transaction");
        return await this._broadcastTransaction(wallet, this._bridgeTokenContractAddress, data, nonce);
    }

    async verifyTransferWithMemoTransaction(hash, from, to, amount, memo){
        console.log("Retrieving transaction info for " + hash);
        let info = await this._getTransactionInfo(hash);
        if(!info){
            console.log("Unable to retrieve transaction info for " + hash);
            return false;
        }

        return this._verifyTransferWithMemoTransaction(info, from, to, amount, memo);
    }

    async approvePublishClaim(wallet, account, claimType, claimDate, claimValue, nonce){
        if(!claimType)
            throw new Error("Claim type is required.");
        if(!claimValue)
            throw new Error("Claimm value is required");
        if(!Number.isInteger(claimDate) || claimDate <= 0)
            throw new Error("Date must be an integer");

        const data = this._contract.methods.approvePublishClaim(account, claimType, claimDate, claimValue).encodeABI();
        console.log("Creating BridgeProtocol.approvePublishClaim transaction");
        return await this._broadcastTransaction(wallet, this._bridgeContractAddress, data, nonce);
    }

    async publishClaim(wallet, claimType, claimDate, claimValue, nonce){
        if(!claimType)
            throw new Error("Claim type is required.");
        if(!claimValue)
            throw new Error("Claimm value is required");
        if(!Number.isInteger(claimDate) || claimDate <= 0)
            throw new Error("Date must be an integer");

        console.log("Creating BridgeProtocol.publishClaim transaction");
        const data = this._contract.methods.publishClaim(claimType, claimDate, claimValue).encodeABI();
        return await this._broadcastTransaction(wallet, this._bridgeContractAddress, data, nonce);
    }

    async removeClaim(wallet, claimType, nonce){
        if(!claimType)
            throw new Error("Claim type is required.");

        console.log("Creating BridgeProtocol.removeClaim transaction");
        const data = this._contract.methods.removeClaim(claimType).encodeABI();
        return await this._broadcastTransaction(wallet, this._bridgeContractAddress, data, nonce);
    }

    async publishPassport(wallet, passport, nonce){
        console.log("Creating BridgeProtocol.publishPassport transaction");
        const data = this._contract.methods.publishPassport(passport).encodeABI();
        return await this._broadcastTransaction(wallet, this._bridgeContractAddress, data, nonce);
    }

    async unpublishPassport(wallet, nonce){
        console.log("Creating BridgeProtocol.unpublishPassport transaction");
        const data = this._contract.methods.unpublishPassport().encodeABI();
        return await this._broadcastTransaction(wallet, this._bridgeContractAddress, data, nonce);
    }

    async getClaimForAddress(account, claimType){
        console.log("Calling BridgeProtocol.getClaim");
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
        console.log("Calling BridgeProtocol.getPassportForAddress");
        return await this._contract.methods.getPassportForAddress(account).call();
    }

    async getAddressForPassport(passport){
        console.log("Calling BridgeProtocol.getAddressForPassport");
        return await this._contract.methods.getAddressForPassport(passport).call();
    }

    async checkConnected(){
        console.log("Checking JSON RPC connection");
        return new Promise(async (resolve, reject) => {
            this._web3.eth.net.isListening()
            .then(() => resolve(true))
            .catch(e => reject(e));
        });
    };

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

    async _getTransactionInfo(hash){
        return await this._web3.eth.getTransactionReceipt(hash);
    }

    async _verifyTransferWithMemoTransaction(info, from, to, amount, memo){
        console.log("Verifying BRDG-ERC20.transferWithMemo transaction");
        let senderValid = false;
        let recipientValid = false;
        let amountValid = false;
        let memoValid = false;

        if(!info.logs || info.logs.length == 0)
            return false;

        for(let i=0; i<info.logs.length; i++){
            let log = info.logs[i];
            if(log.topics != null && log.topics[0] == "0xb0734c6ca9ae9b7406dd80224cb0488aed0928eef358da7449505fa59b8d7a2a"){
                memoValid = this._web3.utils.hexToUtf8(log.data).includes(memo);
            }
            else if(log.topics != null && log.topics.length == 3){
                let amountTopic = this._web3.utils.hexToNumber(log.data);
                let senderTopic = this._removeHexBytes(log.topics[1],12);
                let recipientTopic = this._removeHexBytes(log.topics[2],12);

                //Set the flags
                senderValid = from.toLowerCase() == senderTopic; 
                recipientValid = to.toLowerCase() == recipientTopic;
                amountValid = amount == amountTopic;
            }
        }

        return senderValid && recipientValid && amountValid && memoValid;
    };

    _removeHexBytes(hex, startIdx){
        if(!startIdx)
            startIdx = 0;

        let bytes = this._web3.utils.hexToBytes(hex);
        return this._web3.utils.bytesToHex(bytes.slice(startIdx,bytes.length));
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
                this._web3.eth.sendSignedTransaction(raw)
                    .on('transactionHash',(hash) => console.log("Transaction " + hash + " sent.  Waiting for completion."))
                    .on('receipt', (info) => {
                        console.log("Transaction confirmed.");
                        resolve(info);
                    })
                    .catch((err) => { 
                        console.log(err); 
                        resolve(null); 
                    });
            });
        });
    }

    async _callEtherscan(params) {
        let options = {
            method: 'GET'
        };

        let url = this._etherscanApiUrl + params;
        const response = await _fetch(url, options);

        if (response.ok) {
            let text = await response.text();
            if (text.length > 0)
                return JSON.parse(text);
            else
                return true;
        }
        else {
            var error = response.statusText;
            let text = await response.text();
            if (text) {
                var res = JSON.parse(text);
                if (res && res.message)
                    error = res.message;
            }
            else
                text = response.statusText;

            console.log(error);
            return {};
        }
    }
};

exports.Ethereum = ethereum;