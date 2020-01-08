const _constants = require('../utils/constants');
const _fetch = require('node-fetch');
const _neon = require('@cityofzion/neon-js');
const _crypto = require('./crypto');
const _neoscanUrl = "https://neoscan.io/api/main_net/v1";
const _pollInterval = 15000;
const _pollRetries = 20;
const _bridgeContractHash = _constants.Constants.bridgeContractHash;
const _bridgeContractAddress = _constants.Constants.bridgeContractAddress;
const _bridgeAddress = _constants.Constants.bridgeAddress;
const _brdgHash = _constants.Constants.brdgHash;
const _gasHash = _constants.Constants.gasHash;

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

    async getLatestAddressToTransactions(address1, address2) {
        return await this._callNeoscan("get_address_to_address_abstracts", address1 + "/" + address2 + "/1");
    }

    async getLatestAddressTransactions(address) {
        return await this._callNeoscan("get_address_abstracts", address + "/1");
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

    async sendPublishAddressTransaction(passport, passphrase, address, wait) {
        let neo = this;
        return new Promise(async (resolve, reject) => {
            if (!passport) {
                reject("passport not provided");
            }
            if (!passphrase) {
                reject("passphrase not provided");
            }
            if (!passport.publicKey) {
                reject("passport public key missing");
            }
            if (!address) {
                reject("address not provided");
            }

            try {
                //Create the transaction
                let publicKeyHash = _crypto.CryptoUtility.getHash(passport.publicKey);
                let addressScriptHash = this._getAddressScriptHash(address);
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
                console.log(JSON.stringify(tx));

                //Relay the transaction
                if (wait)
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

    //Amount is 100000000 = 1
    async sendSpendTokensTransaction(amount, paymentIdentifier, recipient, passport, passphrase, wait) {
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

            if (!recipient)
                recipient = _bridgeContractAddress;

            try {
                let addressScriptHash = this._getAddressScriptHash(passport.wallets[0].address);
                let recipientScriptHash = this._getAddressScriptHash(recipient);
                let args = [
                    addressScriptHash,
                    passport.id,
                    recipientScriptHash,
                    amount,
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
                if (wait)
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
                if (wait)
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
                if (wait)
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

    //Need to get the transaction, send to bridge, then relay
    async getAddClaimTransaction(claim, passport, passphrase, secondaryPassportId, secondaryAddress, hashOnly) {
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

            
            let bridgeContractHash = _bridgeContractHash;
            if (bridgeContractHash.startsWith("0x")) {
                bridgeContractHash = bridgeContractHash.slice(2);
            }
            const address = passport.wallets[0].address;
            const addressScriptHash = this._getAddressScriptHash(address);
            const secondaryAddressScriptHash = this._getAddressScriptHash(secondaryAddress);
            const privateKey = await this.getWifFromNep2Key(passport.wallets[0].key, passphrase);
            const account = new _neon.wallet.Account(privateKey);

            //Allow publishing the actual or hash value
            let claimValue = claim.claimValue.toString();
            if(hashOnly)
                claimValue = _crypto.CryptoUtility.getHash(claimValue);

            //invoke <contracthash> "addclaim" [address, identity, claimtypeid, claimvalue, createdon, provider]
            //address
            //identity
            //claimtypeid
            //claimvalue
            //createdon
            //provider = the account paying the tokens for the action
            const props = {
                scriptHash: bridgeContractHash,
                operation: 'addclaim',
                args: [
                    secondaryAddressScriptHash,
                    secondaryPassportId,
                    _crypto.CryptoUtility.hexEncode(claim.claimTypeId.toString()),
                    _crypto.CryptoUtility.hexEncode(claimValue),
                    claim.createdOn,
                    secondaryAddressScriptHash
                ]
            }

            const provider = new _neon.api.neoscan.instance("MainNet");
            const gasFee = 0;
            const additionalInvocationGas = 0;
            const additionalIntents = [];
            const script = _neon.sc.createScript(props);
            const gas = additionalInvocationGas;
            const intent = additionalIntents;
            const config = {
                api: provider,
                account: account,
                intents: intent,
                script: script,
                fees: gasFee,
                gas: gas
            };

            _neon.api.fillSigningFunction(config)
                .then(c => { return _neon.api.fillUrl(c) })
                .then(c => { return _neon.api.fillBalance(c) })
                .then(c => { return _neon.api.createInvocationTx(c) })
                .then(c => {
                    c.tx.addRemark(this._getRandom(5));
                    c.tx.attributes.push(
                        new _neon.tx.TransactionAttribute({
                            usage: 32,
                            data: addressScriptHash
                        })
                    );
                    c.tx.attributes.push(
                        new _neon.tx.TransactionAttribute({
                            usage: 32,
                            data: secondaryAddressScriptHash
                        })
                    );
                    return c;
                })
                .then(c => { return _neon.api.signTx(c) })
                .then(c => {
                    resolve(c.tx);
                })
                .catch(c => {
                    reject("Error getting add claim transaction");
                });
        });
    }

    //Secondary sign the add claim transaction
    async secondarySignAddClaimTransaction(tx, passport, passphrase) {
        return new Promise(async (resolve, reject) => {
            const privateKey = await this.getWifFromNep2Key(passport.wallets[0].key, passphrase);
            const account = new _neon.wallet.Account(privateKey);

            const provider = new _neon.api.neoscan.instance("MainNet");
            const script = tx.script;
            const config = {
                api: provider,
                account: account,
                intents: [],
                script: script,
                fees: 0,
                gas: 0
            };
            config.tx = new _neon.tx.InvocationTransaction(tx);
            config.signingFunction = _neon.api.signWithPrivateKey(privateKey);
            config.account = account;
            _neon.api.signTx(config)
                .then(c => {
                    //TODO: this may need to be sorted, something strange about witness order vs scripts order with NEO
                    //c.tx.scripts.reverse();
                    resolve(c.tx);
                })
                .catch(c => {
                    reject(c);
                });
        });
    }

    //This is the secondary signed transaction by Bridge for publish
    //If it's not signed by Bridge the smart contract will reject it
    async sendAddClaimTransaction(tx, wait) {
        let neo = this;
        return new Promise(async (resolve, reject) => {
            if (!tx) {
                reject("tx not provided");
            }

            try {
                //Relay the transaction
                if (wait)
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

    async sendRemoveClaimTransaction(claimTypeId, passport, passphrase, wait) {
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
                    _crypto.CryptoUtility.hexEncode(claimTypeId.toString())
                ];

                //invoke <contracthash> "revokeclaims" [address, identity, claims]
                //address
                //identity
                //claims - [[claimtypeid,claimvalue,createdon]]
                let tx = await this._createAndSignTransaction(_bridgeContractHash, 'revokeclaim', args, passport, passphrase);

                //Relay the transaction
                if (wait)
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

    async getRegisteredPassportInfo(passportId) {
        let storage = await this._getStorage(_bridgeContractHash, passportId);
        if (!storage) {
            console.log("Address not registered.");
            return null;
        }

        var deserialized = this._deserialize(storage);
        var passport = {
            passportId,
            publicKeyHash: deserialized[0],
            addresses: []
        };

        // For each NEO address we are going to get the token balance
        let addresslist = deserialized[1];
        for (var scripthash in addresslist) {
            let address = this._getAddressFromScriptHash(addresslist[scripthash]);
            let balances = await this.getAddressBalances(address);
            passport.addresses.push({ address, balances })
        }

        return passport;
    }

    async getRegisteredAddressInfo(address) {
        let addressScriptHash = this._getAddressScriptHash(address);
        let storage = await this._getStorage(_bridgeContractHash, addressScriptHash);
        if (!storage) {
            console.log("Address not registered.");
            return null;
        }

        if (storage) {
            let balances = await this.getAddressBalances(address);
            return {
                passportId: storage,
                balances
            }
        }

        return null;
    }

    async getHashForPassport(hash, passportId) {
        let storageKey = (passportId + '3031' + hash);
        let storage = await this._getStorage(_bridgeContractHash, storageKey);
        if (!storage || storage.length == 0)
            return false;

        return await this._unhexlify(storage);
    }

    async getHashForAddress(hash, address) {
        let info = await this.getRegisteredAddressInfo(address);
        if (!info || !info.passportId)
            return null;

        return await this.getHashForPassport(hash, info.passportId);
    }

    async getClaimForPassport(claimType, passportId) {
        claimType = _crypto.CryptoUtility.hexEncode(claimType.toString());

        let storageKey = (passportId + '3032' + claimType);
        let storage = await this._getStorage(_bridgeContractHash, storageKey);
        if (!storage || storage.length == 0)
            return null;

        let deserialized = await this._deserialize(storage);
        let time = this._unhexlify(deserialized[1]);
        let value = this._unhexlify(deserialized[0]);

        return { time, value };
    }

    async getClaimForAddress(claimType, address) {
        let info = await this.getRegisteredAddressInfo(address);
        if (!info || !info.passportId)
            return null;

        return await this.getClaimForPassport(claimType, info.passportId);
    }

    async verifySpendTransactionFromInfo(info, amount, recipient, identifier) {
        if (!recipient)
            recipient = _bridgeContractAddress;
        if (!amount) {
            throw new Error("amount not provided");
        }

        if (!info) {
            console.log("transaction info was null");
            return { complete: true, success: false };
        }
        if (!Array.isArray(info.tx)) {
            console.log("transaction values not found");
            return { complete: true, success: false };;
        }
        if (!info.log.executions || !Array.isArray(info.log.executions)) {
            console.log("log executions is null");
            return { complete: true, success: false };
        }
        if (!info.log.txid) {
            console.log("log does not contain the txid");
            return { complete: true, success: false };
        }

        //get the txid
        let txid = info.log.txid;
        if (txid.startsWith("0x")) {
            txid = txid.slice(2);
        }

        //If an identifier to match is specified, make sure it exists on the transaction
        if (identifier) {
            //Find the remark and see if it matches
            let remark;
            for (let t in info.tx) {
                let val = info.tx[t];
                if (val.type && val.type == "Remark") {
                    remark = val.value;
                }
            };
            if (remark == null) {
                console.log("remark not found on transaction");
                return { complete: true, success: false, txid };
            }
            if (!remark.includes(identifier)) {
                console.log("transaction remark does not match requested identifier");
                return { complete: true, success: false, txid };
            }
        }

        //Get the notifications about the transaction
        for (let e in info.log.executions) {
            let execution = info.log.executions[e];
            if (Array.isArray(execution.notifications)) {
                for (let n in execution.notifications) {
                    let notify = execution.notifications[n];
                    if (notify.values && Array.isArray(notify.values)) {
                        //Look for spend tx to the smart contract
                        if (notify.contract == _bridgeContractHash && notify.values[0] == "spend" && notify.values.length == 6) {
                            //let from = notify.values[1];
                            let to = notify.values[3];
                            let amt = notify.values[4];

                            if (amt >= amount && to == recipient) {
                                return { complete: true, success: true, txid };
                            }
                        }
                        //Look for a straight nep5 transfer
                        if (notify.contract == _brdgHash && notify.values[0] == "transfer" && notify.values.length == 4) {
                            //let from = notify.values[1];
                            let to = notify.values[2];
                            let amt = notify.values[3];

                            if (amt >= amount && to == recipient) {
                                return { complete: true, success: true, txid };
                            }
                        }
                    }
                }
            }
        }

        return { complete: true, success: false, txid };
    }

    async verifySpendTransaction(txid, amount, recipient, identifier) {
        //Get the transaction info
        let info = await this._getTransactionInfo(txid);
        if (info == null) {
            console.log("transaction not found");
            return { complete: false, success: false };
        }

        return await this.verifySpendTransactionFromInfo(info, amount, recipient, identifier);
    }

    deserializeTransaction(serializedTx){
        return _neon.tx.Transaction.deserialize(serializedTx);
    }

    initInvocationTransaction(tx){
        return tx instanceof _neon.tx.ContractTransaction;
    }

    _createTransaction(transactionParameters) {
        //Create the transaction
        let transaction = new _neon.tx.InvocationTransaction();
        transaction.script = _neon.sc.createScript(transactionParameters.scriptParams);

        let rand = this._getRandom(5);
        transaction.addRemark(transactionParameters.remark + "-" + rand); //Add randomness to the remark in case the identifier needs to be reused

        let address = this._getAddressScriptHash(transactionParameters.primaryAddress);
        transaction.addAttribute(32, address);

        return transaction;
    }

    async _createAndSignTransaction(scriptHash, operation, args, passport, passphrase, remark) {
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

        //Sanitize the scripthash
        if (scriptHash.startsWith("0x")) {
            scriptHash = scriptHash.slice(2);
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

        // Create the transaction
        let transaction = this._createTransaction(transactionParameters);

        //User signs it
        transaction.sign(wallet.privateKey);

        console.log(JSON.stringify(transaction));

        //Get the hash
        let hash = transaction.hash; //_neon.tx.getTransactionHash(transaction);
        let deserialized = transaction;

        //Serialize
        transaction = transaction.serialize(); //_neon.tx.serializeTransaction(transaction);

        return { hash, transaction, transactionParameters, deserialized };
    }

    async _relayTransactionWaitStatus(tx) {
        let neo = this;
        return new Promise(async (resolve, reject) => {
            neo._relayTransaction(tx)
                .then(async res => {
                    neo._checkTransactionComplete(res.txid, function (info) {
                        resolve({ txid: res.txid, info });
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
                    if (!success)
                        throw new Error("Transaction relay failed.");

                    console.log("Transaction " + tx.hash + " relayed successfully.");
                    resolve({ txid: tx.hash });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    async _getTransactionInfo(txid) {
        try {
            let log = await this._getApplicationLog(txid);
            let tx = await this._getRawTransaction(txid);
            return { tx, log };
        }
        catch (err) {

        }

        return null;
    }

    async checkTransactionComplete(txid) {
        return new Promise(async (resolve, reject) => {
            try {
                await this._checkTransactionComplete(txid, function (res) {
                    resolve(res);
                });
            }
            catch (err) {
                resolve(err);
            }
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

        if (count == 0) {
            console.log("Waiting for completion.");
        }

        count++;
        setTimeout(async function () {
            try {
                console.log("Checking transaction complete for " + txid + " (" + count + ")");
                let log = await neo._getApplicationLog(txid);
                let tx = await neo._getRawTransaction(txid);
                console.log("Transaction found and complete");
                callback({ tx, log });
            }
            catch (err) {
                console.log("Transaction not found or not complete, waiting and retrying...");
                await neo._checkTransactionComplete(txid, callback, count);
            }
        }, _pollInterval);
    }

    async _invokeFunction(scriptHash, operation, params) {
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
                    resolve(this._parseRawTransaction(res));
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    _parseRawTransaction(raw) {
        let attributes = [];
        if (Array.isArray(raw.attributes)) {
            for (let a in raw.attributes) {
                attributes.push({
                    type: raw.attributes[a].usage,
                    value: this._unhexlify(raw.attributes[a].data)
                });
            };
        };
        return attributes;
    }

    async _getApplicationLog(txid) {
        return new Promise(async (resolve, reject) => {
            let client = await this._getRpcClient();
            let query = _neon.default.create.query({ method: "getapplicationlog", params: [txid] });
            client.execute(query)
                .then(res => {
                    resolve(this._parseApplicationLog(res));
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    _parseApplicationLog(log) {
        let result = {};
        result.txid = log.result.txid;
        result.executions = [];

        for (let e = 0; e < log.result.executions.length; e++) {
            let ex = log.result.executions[e];
            let execution = {
                trigger: ex.trigger,
                contract: ex.contract,
                vmstate: ex.vmstate,
                gas_consumed: ex.gas_consumed,
                stack: ex.stack,
                notifications: []
            };

            if (Array.isArray(ex.notifications)) {
                for (let n = 0; n < ex.notifications.length; n++) {
                    let no = ex.notifications[n];
                    let notification = {
                        contract: no.contract,
                        values: []
                    };

                    if (Array.isArray(no.state.value)) {
                        for (let s = 0; s < no.state.value.length; s++) {
                            let val = no.state.value[s];
                            let unhex = this._unhexlify(val.value);
                            notification.values.push(unhex);
                        }
                    }
                    else if (no.state.value) {
                        let deserialized = this._deserialize(no.state.value);
                        if (Array.isArray(deserialized)) {
                            for (let d = 0; d < deserialized.length; d++) {
                                let de = deserialized[d];
                                if (Array.isArray(de)) {
                                    for (let d2 = 0; d2 < de.length; d2++) {
                                        let dval = de[d2];
                                        let unhex = this._unhexlify(dval);
                                        //We have a passport ID we don't want to have converted to a NEO address
                                        if (d2 == 1) {
                                            notification.values.push(dval);
                                        }
                                        else {
                                            notification.values.push(unhex);
                                        }
                                    }
                                }
                                else {
                                    let unhex = this._unhexlify(de);
                                    notification.values.push(unhex);
                                }
                            }
                        }
                        else {
                            let unhex = this._unhexlify(deserialized);
                            notification.values.push(unhex);
                        }
                    }

                    execution.notifications.push(notification);
                }
            }

            result.executions.push(execution);
        }

        return result;
    }

    async _getRpcClient(provider) {
        return new Promise((resolve, reject) => {
            try {
                //Test with a local running node
                //let nodeUrl = "http://localhost:10332";
                //let client = _neon.default.create.rpcClient(nodeUrl);
                //resolve(client);
                if(!provider)
                    provider = new _neon.api.neoscan.instance("MainNet");

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

    _getAddressFromScriptHash(scripthash) {
        return _neon.wallet.getAddressFromScriptHash(_neon.u.reverseHex(scripthash));
    }

    _getRandom(len) {
        let date = new Date();
        let str = _neon.u.sha256(_neon.u.str2hexstring(date.toISOString() + Math.random()));

        if (len)
            str = str.substring(0, len);

        return str;
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
            hex = hex.toString();

            // Try to convert the hex to an address
            if (hex.length == 40) {
                let reversed = _neon.u.reverseHex(hex);
                // Try to get a NEO address from the parameter value
                let address = _neon.wallet.getAddressFromScriptHash(reversed);
                // Check if the value is a correct NEO address
                if (_neon.wallet.isAddress(address)) {
                    return address;
                };
            }

            let string = _crypto.CryptoUtility.hexDecode(hex);

            //We have a valid string value, just get it
            let invalidChars = (/[\u0000-\u001F]/.test(string));
            if(!invalidChars){
                return string;
            }
            else //The value is an integer
            {
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
            }

            //Just return the raw value if we don't know what to do with it
            return hex;
        };
    }
};

exports.NEOUtility = new NEOUtility();