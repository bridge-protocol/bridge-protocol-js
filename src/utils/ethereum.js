const Web3 = require("web3");
const _constants = require('../constants').Constants;
const _fetch = require('node-fetch');
const _tx = require("ethereumjs-tx");
const _wallet = require("ethereumjs-wallet");
const _util = require("ethereumjs-util");
const _abi = [{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"addApprovedOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"claimType","type":"string"},{"internalType":"uint256","name":"claimDate","type":"uint256"},{"internalType":"string","name":"claimValue","type":"string"}],"name":"approvePublishClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"claimType","type":"string"},{"internalType":"uint256","name":"claimDate","type":"uint256"},{"internalType":"string","name":"claimValue","type":"string"}],"name":"publishClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"passport","type":"string"}],"name":"publishPassport","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"removeApprovedOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"claimType","type":"string"}],"name":"removeClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"takeOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"unpublishPassport","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"passport","type":"string"}],"name":"getAddressForPassport","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"claimType","type":"string"}],"name":"getClaim","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getPassportForAddress","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];
const _tokenAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"memo","type":"string"}],"name":"Memo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"memo","type":"string"}],"name":"transferWithMemo","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const _rpcUrl = _constants.ethereumJsonRpcUrl;
const _etherscanApiUrl = _constants.etherscanApiUrl;
const _etherscanUrl = _constants.etherscanUrl;
const _chain = _constants.bridgeEthereumChain;
const _gasLimit = _constants.defaultEthereumGasLimit;
const _gasPriceGwei = _constants.defaultEthereumGasPriceGwei;
const _bridgeContractAddress = _constants.bridgeEthereumContractAddress;
const _bridgeTokenContractAddress = _constants.bridgeEthereumERC20Address;
const _web3 = new Web3(new Web3.providers.HttpProvider(_rpcUrl));
const _contract = new _web3.eth.Contract(_abi, _bridgeContractAddress);
const _token = new _web3.eth.Contract(_tokenAbi, _bridgeTokenContractAddress);

class Ethereum {
    //Wallet Management Functions
    createWallet(password, privateKeyString){
        let wallet;
        
        if(!privateKeyString)
            wallet = _wallet.generate();
        else{
            const privateKeyBuffer = _util.toBuffer(privateKeyString);
            wallet = _wallet.fromPrivateKey(privateKeyBuffer);
        }

        return this._getwallet(wallet, password);
    }

    getWalletFromKeystore(keystore, password){
        let wallet = _wallet.fromV3(keystore, password);
        return this._getwallet(wallet, password);
    }

    async unlockWallet(wallet, password){
        if(!wallet || !wallet.key)
            throw new Error("No key provided to unlock");
        if(!password)
            throw new Error("No password provided");

        return this._decryptWallet(wallet.key, password);
    }
    
    _getwallet(wallet, password){
        if(!wallet)
            throw new Error("no wallet specified");
        if(!password)
            throw new Error("no password specified");

        let encryptedKey = wallet.toV3(password);
        return {
            network: "ETH",
            address: wallet.getAddressString(),
            key: encryptedKey
        };
    }

    _decryptWallet(key, password){
        return _wallet.fromV3(key, password);
    }
    //End wallet management functions

   //Asset and transaction management functions
    async getAddressBalances(address){
        let eth = await this.getEthBalance(address);
        let brdg = await this.getBrdgBalance(address);
        return [{asset:"ETH", balance: eth}, {asset: "BRDG", balance: brdg}];
    }

    async getEthBalance(address) {
        let res = await this._callEtherscan("&module=account&action=balance&address=" + address + "&tag=latest");
        if(!res || res.status != "1"){
            console.log("Error getting balance.");
            return 0;
        }

        return _web3.utils.fromWei(res.result,"ether");
    };

    async getBrdgBalance(address){
        let res = await this._callEtherscan("&module=account&action=tokenbalance&contractaddress=" + _bridgeTokenContractAddress + "&address=" + address + "&tag=latest");
        if(!res || res.status != "1"){
            console.log("Error getting balance.");
            return 0;
        }

        return res.result;
    }

    async getBrdgTransactions(address){
        let res = await this._callEtherscan("&module=account&action=tokentx&contractaddress=" + _bridgeTokenContractAddress + "&address=" + address + "&startblock=0&endblock=999999999&sort=desc");
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
                url: _etherscanUrl + "/tx/" + tx.hash
            });
        }
            
        return txs;
    }

    async sendBrdg(wallet, recipient, amount, memo, nonce){
        const data = _token.methods.transferWithMemo(recipient, amount, memo).encodeABI();
        return await this._broadcastTransaction(wallet, _bridgeTokenContractAddress, data, nonce);
    }

    async verifyTransferWithMemoTransactionFromHash(hash, from, to, amount, memo){
        let info = await this._getTransactionInfo(hash);
        if(!info){
            console.log("Unable to retrieve transaction info for " + hash);
            return false;
        }

        return this.verifyTransferWithMemoTransaction(info, from, to, amount, memo);
    }

    async verifyTransferWithMemoTransaction(info, from, to, amount, memo){
        let senderValid = false;
        let recipientValid = false;
        let amountValid = false;
        let memoValid = false;

        if(!info.logs || info.logs.length == 0)
            return false;

        for(let i=0; i<info.logs.length; i++){
            let log = info.logs[i];
            if(log.topics != null && log.topics[0] == "0xb0734c6ca9ae9b7406dd80224cb0488aed0928eef358da7449505fa59b8d7a2a"){
                memoValid = _web3.utils.hexToUtf8(log.data).includes(memo);
            }
            else if(log.topics != null && log.topics.length == 3){
                let amountTopic = _web3.utils.hexToNumber(log.data);
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
    //End asset and transaction management functions

    //Smart contract for passport and claims management
    async approvePublishClaim(wallet, account, claimType, claimDate, claimValue, nonce){
        if(!claimType)
            throw new Error("Claim type is required.");
        if(!claimValue)
            throw new Error("Claimm value is required");
        if(!Number.isInteger(claimDate) || claimDate <= 0)
            throw new Error("Date must be an integer");

        const data = _contract.methods.approvePublishClaim(account, claimType, claimDate, claimValue).encodeABI();
        return await this._broadcastTransaction(wallet, _bridgeContractAddress, data, nonce);
    }

    async publishClaim(wallet, claimType, claimDate, claimValue, nonce){
        if(!claimType)
            throw new Error("Claim type is required.");
        if(!claimValue)
            throw new Error("Claimm value is required");
        if(!Number.isInteger(claimDate) || claimDate <= 0)
            throw new Error("Date must be an integer");

        const data = _contract.methods.publishClaim(claimType, claimDate, claimValue).encodeABI();
        return await this._broadcastTransaction(wallet, _bridgeContractAddress, data, nonce);
    }

    async removeClaim(wallet, claimType, nonce){
        if(!claimType)
            throw new Error("Claim type is required.");

        const data = _contract.methods.removeClaim(claimType).encodeABI();
        return await this._broadcastTransaction(wallet, _bridgeContractAddress, data, nonce);
    }

    async publishPassport(wallet, passport, nonce){
        const data = _contract.methods.publishPassport(passport).encodeABI();
        return await this._broadcastTransaction(wallet, _bridgeContractAddress, data, nonce);
    }

    async getPassportForAddress(address){
        let account = address;
        return await _contract.methods.getPassportForAddress(account).call();
    }

    async getAddressForPassport(passport){
        return await _contract.methods.getAddressForPassport(passport).call();
    }

    async unpublishPassport(wallet, nonce){
        const data = _contract.methods.unpublishPassport().encodeABI();
        return await this._broadcastTransaction(wallet, _bridgeContractAddress, data, nonce);
    }

    async getClaimForAddress(address, claimType){
        let account = address;
        let res = await _contract.methods.getClaim(account, claimType.toString()).call();
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
    //End smart contract for passport and claims management

    async checkConnected(){
        return new Promise(async (resolve, reject) => {
            _web3.eth.net.isListening()
            .then(() => resolve(true))
            .catch(e => reject(e));
        });
    };

    async _broadcastTransaction(wallet, contract, data, nonce){
        if(!wallet.unlocked)
            throw new Error("Wallet is not unlocked.");

        if(!contract)
            throw new Error("Contract is not specified.");

        if(!data)
            throw new Error("No contract data provided.");

        let address = wallet.unlocked.getAddressString();
        let privateKey = wallet.unlocked.getPrivateKey();
        return new Promise((resolve,reject) => {
            _web3.eth.getTransactionCount(address, (err, txCount) => {
                if(!nonce || txCount > nonce)
                    nonce = txCount;

                // Build the transaction
                const txObject = {
                    nonce:    _web3.utils.toHex(nonce), 
                    to:       contract,
                    value:    _web3.utils.toHex(_web3.utils.toWei("0", "ether")),
                    gasLimit: _web3.utils.toHex(_gasLimit),
                    gasPrice: _web3.utils.toHex(_web3.utils.toWei(_gasPriceGwei.toString(), "gwei")),
                    data: data  
                }
                // Sign the transaction
                const tx = new _tx(txObject, {"chain":_chain});
                tx.sign(privateKey);
                
                const serializedTx = tx.serialize();
                const raw = "0x" + serializedTx.toString("hex");
                
                // Broadcast the transaction
                _web3.eth.sendSignedTransaction(raw)
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

    async _getTransactionInfo(hash){
        return await _web3.eth.getTransactionReceipt(hash);
    }

    async _callEtherscan(params) {
        let options = {
            method: 'GET'
        };

        let url = _etherscanApiUrl + params;
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

    _removeHexBytes(hex, startIdx){
        if(!startIdx)
            startIdx = 0;

        let bytes = _web3.utils.hexToBytes(hex);
        return _web3.utils.bytesToHex(bytes.slice(startIdx,bytes.length));
    }
};

exports.Ethereum = new Ethereum();