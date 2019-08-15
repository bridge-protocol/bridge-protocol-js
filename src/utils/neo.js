const _fetch = require('node-fetch');
const _neon = require('@cityofzion/neon-js');
const _crypto = require('./crypto');
const _neoscanUrl = "https://neoscan.io/api/main_net/v1";
const _pollInterval = 15000;
const _pollRetries = 20;
const _bridgeContractHash = "e7692ab0005cda56121e4d5384e7647f97f3035d";
const _bridgeContractAddress = "AS6suhfGBbj9temaLLHSQRZ363xdx8e94n";
const _bridgeAddress = "ALEN8KC46GLaadRxaWdvYBUhdokT3RhxPC";
const _brdgHash = "0xbac0d143a547dc66a1d6a2b7d66b06de42614971";
const _neoHash = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
const _gasHash = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";

class NEOUtility {
    async getWifFromNep2Key(nep2Key, passphrase) {
        if (!nep2Key) {
            throw new Error("nep2Key not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }

        return await _neon.wallet.decrypt(nep2Key, passphrase);
    };

    getNeoAccountFromWif(wif) {
        if (!wif) {
            throw new Error("wif not provided");
        }

        return new _neon.wallet.Account(wif);
    };

    async createNep2Key(passphrase) {
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }

        let privateKey = _neon.wallet.generatePrivateKey();
        let wif = _neon.wallet.getWIFFromPrivateKey(privateKey);
        return await _neon.wallet.encrypt(wif, passphrase);
    }

    async createNep2KeyFromWif(wif, passphrase) {
        if (!wif) {
            throw new Error("wif not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }

        return await _neon.wallet.encrypt(wif, passphrase);
    }

    async createNeoWallet(passphrase, wif) {
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }

        let nep2Key;
        if (wif) {
            nep2Key = await this.createNep2KeyFromWif(wif, passphrase);
        }
        else {
            nep2Key = await this.createNep2Key(passphrase);
        }

        return this.getNeoWallet(nep2Key, passphrase);
    }

    async getNeoAccountFromNep2Key(nep2Key, passphrase) {
        if (!nep2Key) {
            throw new Error("nep2Key not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }

        try {
            let wif = await this.getWifFromNep2Key(nep2Key, passphrase);
            return this.getNeoAccountFromWif(wif);
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    async getNeoWallet(nep2Key, passphrase) {
        if (!nep2Key) {
            throw new Error("messageText not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }

        let account = await this.getNeoAccountFromNep2Key(nep2Key, passphrase);
        return {
            network: "NEO",
            address: account.address,
            key: nep2Key
        };
    }

    async getGasBalance(address) {
        return new Promise((resolve, reject) => {
            const provider = new _neon.api.neoscan.instance("MainNet");
            _neon.settings.httpsOnly = true;

            // Get an RPC Endpoint (Neo Node)
            provider.getRPCEndpoint().then(nodeUrl => {
                let client = _neon.default.create.rpcClient(nodeUrl);
                client.getAccountState(address).then(response => {
                    let gasBalance = -1;
                    for (let i = 0; i < response.balances.length; i++) {
                        let balance = response.balances[i];
                        if (balance.asset == _gasHash) {
                            gasBalance = balance.value;
                        }
                    }
                    if (gasBalance >= 0)
                        resolve(gasBalance);
                    else
                        reject("Could not get GAS balance");
                });
            });
        });
    }

    async getAddressBalances(address) {
        let addressBalances = [];
        let balances = await this._callNeoscan("get_balance", address);
        for (let i = 0; i < balances.balance.length; i++) {
            addressBalances.push({
                asset: balances.balance[i].asset_symbol,
                balance: balances.balance[i].amount
            });
        }
        return addressBalances;
    }

    async sendPublishAddressTransaction(passport, passphrase, wait) {
        let neo = this;
        return new Promise(async (resolve, reject) => {
            if (!passport) {
                reject("passport not provided");
            }
            if (!passphrase) {
                reject("passphrase not provided");
            }

            try {
                //Create the transaction
                let publicKeyHash = _crypto.CryptoUtility.getHash(passport.publicKey);
                let addressScriptHash = this._getAddressScriptHash(passport.wallets[0].address);
                let args = [
                    addressScriptHash,
                    passport.id,
                    publicKeyHash,
                    addressScriptHash
                ];
                //invoke <contracthash> "publish" [address, identity, key, provider]
                //address = your public neo address being used to sign the invocation / tx
                //identity = bridge passport id
                //key = bridge passport public key
                //provider = the account paying the tokens for the action
                let tx = await this._createAndSignTransaction(_bridgeContractHash, 'publish', args, passport, passphrase);

                //Relay the transaction
                if(wait)
                    resolve(await this._relayTransactionWaitStatus(tx));
                else
                    resolve(this._relayTransaction(tx));
            }
            catch (err) {
                reject(err);
                return;
            }
        });
    }

    async sendSpendTokensTransaction(amount, paymentIdentifier, passport, passphrase, wait) {
        let neo = this;
        return new Promise(async (resolve, reject) => {
            if (!amount) {
                reject("amount not provided");
            }
            if (!passport) {
                reject("passport not provided");
            }
            if (!passphrase) {
                reject("passphrase not provided");
            }

            try {
                let addressScriptHash = this._getAddressScriptHash(passport.wallets[0].address);
                let recipientScriptHash = this._getAddressScriptHash(_bridgeContractAddress);
                let args = [
                    addressScriptHash,
                    passport.id,
                    recipientScriptHash,
                    (amount * 100000000),
                    addressScriptHash
                ];

                //invoke <contracthash> "spend" [address, identity, amount, provider]
                //address = your public neo address being used to sign the invocation / tx
                //identity = bridge passport id to deposit funds to
                //recipient = the recipient address for the payment
                //amount = number of tokens
                //provider = the account paying the tokens for the action
                let tx = await this._createAndSignTransaction(_bridgeContractHash, 'spend', args, passport, passphrase, paymentIdentifier);

                //Relay the transaction
                if(wait)
                    resolve(await this._relayTransactionWaitStatus(tx));
                else
                    resolve(this._relayTransaction(tx));     
            }
            catch (err) {
                reject(err);
                return;
            }
        });
    }

    async sendAddHashTransaction(hash, passport, passphrase, wait) {
        let neo = this;
        return new Promise(async (resolve, reject) => {
            if (!hash) {
                reject("hash not provided");
            }
            if (!passport) {
                reject("passport not provided");
            }
            if (!passphrase) {
                reject("passphrase not provided");
            }

            try {
                let addressScriptHash = this._getAddressScriptHash(passport.wallets[0].address);
                let args = [
                    addressScriptHash,
                    passport.id,
                    hash,
                    addressScriptHash
                ];

                
                //invoke <contracthash> "addhash" [address, identity, digest, provider]
                //address = your public neo address being used to sign the invocation / tx
                //identity = bridge passport id to deposit funds to
                //digest = SHA256 hash payload
                //provider = the account paying the tokens for the action
                let tx = await this._createAndSignTransaction(_bridgeContractHash, 'addhash', args, passport, passphrase);

                //Relay the transaction
                if(wait)
                    resolve(await this._relayTransactionWaitStatus(tx));
                else
                    resolve(this._relayTransaction(tx));
            }
            catch (err) {
                reject(err);
                return;
            }
        });
    }

    async sendRemoveHashTransaction(hash, passport, passphrase, wait) {
        let neo = this;
        return new Promise(async (resolve, reject) => {
            if (!hash) {
                reject("hash not provided");
            }
            if (!passport) {
                reject("passport not provided");
            }
            if (!passphrase) {
                reject("passphrase not provided");
            }

            try {
                let addressScriptHash = this._getAddressScriptHash(passport.wallets[0].address);
                let args = [
                    addressScriptHash,
                    passport.id,
                    hash
                ];
        
                //invoke <contracthash> "revokehash" [address, identity, digest]
                //address = your public neo address being used to sign the invocation / tx
                //identity = bridge passport id to deposit funds to
                //digest = SHA256 hash payload
                let tx = await this._createAndSignTransaction(_bridgeContractHash, 'revokehash', args, passport, passphrase);

                //Relay the transaction
                if(wait)
                    resolve(await this._relayTransactionWaitStatus(tx));
                else
                    resolve(this._relayTransaction(tx));
            }
            catch (err) {
                reject(err);
                return;
            }
        });
    }

    async sendAddClaimTransaction(claim, passport, passphrase) {
        let neo = this;
        return new Promise(async (resolve, reject) => {
            if (!claim) {
                reject("claims not provided");
            }
            if (!passport) {
                reject("passport not provided");
            }
            if (!passphrase) {
                reject("passphrase not provided");
            }

            try {
                let addressScriptHash = this._getAddressScriptHash(passport.wallets[0].address);
                let args = [
                    addressScriptHash,
                    passport.id,
                    claim.claimTypeId,
                    _crypto.CryptoUtility.hexEncode(claim.claimValue),
                    claim.createdOn,
                    addressScriptHash
                ];
        
                //invoke <contracthash> "addclaim" [address, identity, claimtypeid, claimvalue, createdon, provider]
                //address
                //identity
                //claimtypeid
                //claimvalue
                //createdon
                //provider = the account paying the tokens for the action
                let tx = await this._createAndSignTransaction(_bridgeContractHash, 'addclaim', args, passport, passphrase, null, _bridgeAddress);

                //TODO: This tx has to be sent to Bridge for claim validation and secondary signing

                //Relay the transaction
                if(wait)
                    resolve(await this._relayTransactionWaitStatus(tx));
                else
                    resolve(this._relayTransaction(tx));
            }
            catch (err) {
                reject(err);
                return;
            }
        });
    }

    async sendRemoveClaimTransaction(claimTypeId, passport, passphrase, scripthash) {
        let neo = this;
        return new Promise(async (resolve, reject) => {
            if (!claimTypeId) {
                reject("claimTypeIds not provided");
            }
            if (!passport) {
                reject("passport not provided");
            }
            if (!passphrase) {
                reject("passphrase not provided");
            }

            try {
                let addressScriptHash = this._getAddressScriptHash(passport.wallets[0].address);
                let args = [
                    addressScriptHash,
                    passport.id,
                    claimTypeId
                ];
        
                //invoke <contracthash> "revokeclaims" [address, identity, claims]
                //address
                //identity
                //claims - [[claimtypeid,claimvalue,createdon]]
                let tx = await this._createAndSignTransaction(_bridgeContractHash, 'revokeclaim', args, passport, passphrase);

                //Relay the transaction
                if(wait)
                    resolve(await this._relayTransactionWaitStatus(tx));
                else
                    resolve(this._relayTransaction(tx));
            }
            catch (err) {
                reject(err);
                return;
            }
        });
    }

    async getRegisteredAddressInfo(address)
    {    
        let addressScriptHash = this._getAddressScriptHash(address);
        let storage = await this._getStorage(_bridgeContractHash, addressScriptHash);
        if(!storage){
            console.log("Address not registered.");
            return null;
        }

        if(storage){
            let balances = await this.getAddressBalances(address);
            return {
                passportId: storage,
                balances
            }
        }

        return null;
    }

    async getHashForPassport(hash, passportId){
        let storageKey = ( passportId + '3031' + hash );
        let storage = await this._getStorage(_bridgeContractHash, storageKey);
        if(!storage || storage.length == 0)
            return false;

        return await this._unhexlify(storage);
    }

    async getHashForAddress(hash, address){
        let info = await this.getRegisteredAddressInfo(address);
        if(!info || !info.passportId)
            return null;

        return await this.getHashForPassport(hash, info.passportId);
    }

    async getClaimForPassport(claimType, passportId){
        claimType = parseInt(claimType).toString(16);

        // We need a reverse hex, so we need an even number of characters in our hexstring
        if (Math.abs(claimType.length % 2)) 
        { 
            claimType = '0' + claimType; 
        }
        claimType = _neon.u.reverseHex(claimType);

        let storageKey = ( passportId + '3032' + claim );
        let storage = await this._getStorage(_bridgeContractHash, storageKey);
        if(!storage || storage.length == 0)
            return null;

        return await this._deserialize(storage);
    }

    async getClaimForAddress(claimType, address){
        let info = await this.getRegisteredAddressInfo(address);
        if(!info || !info.passportId)
            return null;
        
        return await this.getClaimForPassport(claimType, info.passportId);
    }

    secondarySignTransaction(transactionParameters, transaction, hash, wif) {
        //The transaction we want to sign
        let primaryTransaction = _neon.tx.deserializeTransaction(transaction);

        //Create a second transaction with the same properties
        let secondaryTransaction = this._createTransaction(transactionParameters);

        //Sign the transaction
        var wallet = new _neon.wallet.Account(wif);
        secondaryTransaction.sign(wallet.privateKey);

        // Create a new unsigned transaction with the same properties
        transaction = this._createTransaction(transactionParameters);

        // Merge signatures from both signed transactions to the unsigned transaction
        transaction.scripts = [primaryTransaction, secondaryTransaction].map(tx => tx.scripts[0]);

        // Reverse the signature scripts
        transaction.scripts.reverse();

        // Get the transaction hash
        hash = _neon.tx.getTransactionHash(transaction);

        //Serialize the transaction
        transaction = transaction.serialize();

        return { hash, transaction };
    }

    _createTransaction(transactionParameters) {
        //Create the transaction
        let transaction = new _neon.tx.InvocationTransaction();
        transaction.script = _neon.sc.createScript(transactionParameters.scriptParams);
        transaction.addRemark(transactionParameters.remark);
        transaction.addAttribute(32, _neon.u.reverseHex(_neon.wallet.getScriptHashFromAddress(transactionParameters.primaryAddress)));
        if (transactionParameters.secondaryAddress) {
            transaction.addAttribute(32, _neon.u.reverseHex(_neon.wallet.getScriptHashFromAddress(transactionParameters.secondaryAddress)));
        }
        return transaction;
    }

    async _createAndSignTransaction(scriptHash, operation, args, passport, passphrase, remark, secondaryAddress) {
        if (!scriptHash) {
            throw new Error("scriptHash not provided");
        }
        if (!operation) {
            throw new Error("operation not provided");
        }
        if (!args) {
            throw new Error("args not provided");
        }
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }

        //The user's address and unlocked wallet for signing
        let primaryAddress = passport.wallets[0].address;
        let wallet = await this.getNeoAccountFromNep2Key(passport.wallets[0].key, passphrase);
        if (!wallet) {
            throw new Error("could not open wallet for signing");
        }

        if (!remark) {
            remark = this._getRandom();
        }

        // Create a transaction script and parameters
        let scriptParams = { scriptHash, operation, args };
        let transactionParameters = {
            scriptParams,
            remark,
            primaryAddress
        };
        if (secondaryAddress) {
            transactionParameters.secondaryAddress = secondaryAddress;
        }

        // Create the transaction
        let transaction = this._createTransaction(transactionParameters);

        //User signs it
        transaction.sign(wallet.privateKey);

        //Get the hash
        let hash = transaction.hash; //_neon.tx.getTransactionHash(transaction);

        //Serialize
        transaction = transaction.serialize(); //_neon.tx.serializeTransaction(transaction);

        return { hash, transaction, transactionParameters };
    }

    async _relayTransactionWaitStatus(tx) {
        let neo = this;
        return new Promise(async (resolve, reject) => {
            neo._relayTransaction(tx)
                .then(async txid => {
                    neo._checkTransactionComplete(txid, function (info) {
                        resolve(info);
                    });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    async _relayTransaction(tx) {
        console.log("Relaying transaction " + tx.hash + " to NEO node.");
        return new Promise(async (resolve, reject) => {
            let client = await this._getRpcClient();
            client.sendRawTransaction(tx.transaction)
                .then(success => {
                    if(!success)
                        throw new Error("Transaction relay failed.");

                    console.log("Transaction " + tx.hash + " relayed successfully.");
                    resolve(tx.hash);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    async _checkTransactionComplete(txid, callback, count) {
        let neo = this;

        if (!count)
            count = 0;

        if (count >= _pollRetries) {
            console.log("Retry count exceeded.");
            callback(null);
        }

        if(count == 0){
            console.log("Waiting for completion.");
        }

        count++;
        setTimeout(async function () {
            try {
                console.log("Checking transaction complete for " + txid + " (" + count + ")");
                let log = await neo._getApplicationLog(txid);
                let tx = await neo._getRawTransaction(txid);
                tx.executions = log.result.executions;
                console.log("Transaction found and complete");
                callback(tx);
            }
            catch (err) {
                console.log("Transaction not found or not complete, waiting and retrying...");
                await neo._checkTransactionComplete(txid, callback, count);
            }
        }, _pollInterval);
    }

    async _invokeFunction(scriptHash, operation, params){
        return new Promise(async (resolve, reject) => {
            let client = await this._getRpcClient();
            client.invokeFunction(scriptHash, operation, params)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    async _getStorage(scriptHash, key) {
        return new Promise(async (resolve, reject) => {
            let client = await this._getRpcClient();
            client.getStorage(scriptHash, key)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    async _getRawTransaction(txid) {
        return new Promise(async (resolve, reject) => {
            let client = await this._getRpcClient();
            client.getRawTransaction(txid)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    async _getApplicationLog(txid) {
        return new Promise(async (resolve, reject) => {
            let client = await this._getRpcClient();
            let query = _neon.default.create.query({ method: "getapplicationlog", params: [txid] });
            client.execute(query)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    async _getRpcClient() {
        return new Promise((resolve, reject) => {
            try {
                const provider = new _neon.api.neoscan.instance("MainNet");
                _neon.settings.httpsOnly = true;
                provider.getRPCEndpoint().then(nodeUrl => {
                    let client = _neon.default.create.rpcClient(nodeUrl);
                    resolve(client);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }

    async _callNeoscan(endpoint, param) {
        let options = {
            method: 'GET'
        };

        let url = _neoscanUrl + "/" + endpoint + "/" + param;
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

    _getAddressScriptHash(address) {
        if (!address) {
            throw new Error("address not provided");
        }

        return _neon.u.reverseHex(_neon.wallet.getScriptHashFromAddress(address));
    }

    _getRandom() {
        let date = new Date();
        return _neon.u.sha256(_neon.u.str2hexstring(date.toISOString() + Math.random()));
    }

    _isHex(input) {
        if (typeof (input) == 'undefined') {
            return false;
        }

        if (Math.abs(input.length % 2) == 1) {
            return false;
        };

        return /^[0-9A-F]*$/i.test(input);
    }

    _deserialize(input) {
        let list = [];

        if (this._isHex(input)) {
            let result = _neon.sc.StackItem.deserialize(input).value;

            if (Array.isArray(result)) {
                // The result is an array, let go through the items in the array
                for (let i = 0; i < result.length; i++) {
                    let item = result[i];
                    if (Array.isArray(item.value)) {
                        let array = [];
                        for (i of item.value) {
                            array.push(i.value);
                        }
                        list.push(array);
                    } else {
                        list.push(item.value);
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }

        return list;
    }

    _unhexlify(hex) {
        if (typeof (hex) == 'undefined') {
            return false;
        } else if (hex == '' || hex == '00') {
            return false;
        } else if (hex == '01') {
            return true;
        } else if (!this._isHex(hex)) {
            return false;
        } else {
            let string = '';
            hex = hex.toString();

            // Try to convert the hex to an address
            if (hex.length == 40) {
                let reversed = _neon.u.reverseHex(hex);

                // Try to get a NEO address from the parameter value
                let address = _neon.wallet.getAddressFromScriptHash(reversed);

                // Check if the value is a correct NEO address
                if (_neon.wallet.isAddress(address)) {
                    string = address;
                    return string;
                };
            }

            // Try to convert the hex to a string
            for (var i = 0; (i < hex.length && hex.substr(i, 2) !== "00"); i += 2) {
                string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            };

            // Check if we have a valid string
            if (/^[\x00-\x7F]*$/.test(string)) {
                return string;
            }

            // Try to convert the hex to an integer
            try {
                let reversed = _neon.u.reverseHex(hex);
                let number = parseInt(reversed, 16);

                if (!isNaN(parseFloat(number)) && isFinite(number)) {
                    return parseInt(number);
                }
            }
            catch (error) {
                
            }

            return hex;
        };
    }
};

exports.NEOUtility = new NEOUtility();