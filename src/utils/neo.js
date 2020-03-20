const _constants = require('../constants').Constants;
const _fetch = require('node-fetch');
const _neon = require('@cityofzion/neon-js');
const _crypto = require('./crypto').Crypto;
const _neoscanUrl = _constants.neoscanUrl;
const _neoscanApiUrl = _constants.neoscanApiUrl;
const _pollInterval = _constants.neoscanPollInterval;
const _pollRetries = _constants.neoscanPollRetries;
const _bridgeContractHash = _constants.bridgeContractHash;
const _bridgeContractAddress = _constants.bridgeContractAddress;
const _brdgHash = _constants.brdgHash;

class NEO {
    //Wallet management functions
    async createWallet(password, wif) {
        if (!password) 
            throw new Error("password not provided");
        
        return this.getWalletFromPrivateKey(wif, password);
    }

    async getWalletFromPrivateKey(wif, password){
        if (!password) 
            throw new Error("password not provided");
        
        if(wif)
            console.log("importing NEO wallet from private key");
        else
            console.log("creating new NEO wallet");

        let account = new _neon.wallet.Account(wif);
        return await this._getWalletInfo(account, password);
    }

    async getWalletFromEncryptedKey(nep2, password){
        if(!nep2)
            throw new Error("nep2 not provided");
        if (!password) 
            throw new Error("password not provided");

        return this._decryptWallet(nep2, password);
    }

    async unlockWallet(wallet, password){
        if(!wallet || !wallet.key)
            throw new Error("No key provided to unlock");
        if(!password)
            throw new Error("No password provided");
        
        return await this._decryptWallet(wallet.key, password);
    }

    async _getWalletInfo(account, password){
        if (!account)
            throw new Error("account not provided");
        if(!password)
            throw new Error("password not provided");

        let encryptedKey = await _neon.wallet.encrypt(account.WIF, password);
        return {
            network: "NEO",
            address: account.address,
            key: encryptedKey
        };
    }

    async _decryptWallet(key, password){
        if (!key)
            throw new Error("key not provided");
        if(!password)
            throw new Error("password not provided");

        let wif = await _neon.wallet.decrypt(key, password);
        return new _neon.wallet.Account(wif);
    }
    //End wallet management functions


    //Asset and transaction management functions
    async getLatestAddressTransactions(address) {
        let res = await this._callNeoscan("get_address_abstracts", address + "/1");
        if(!res || !res.entries || res.entries.length == 0)
            return null;

        let transactions = [];
        res.entries.forEach((tx) => {
            if(tx.asset === _brdgHash.replace("0x","")){
                transactions.push({
                    hash: tx.txid,
                    timmeStamp: tx.time,
                    amount: tx.amount,
                    from: tx.address_from,
                    to: tx.address_to,
                    url: _neoscanUrl + "transaction/" + tx.txid
                });
            }
        });

        return transactions;
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
    //End asset and transaction management functions

    //Smart contract for passport and claims management
    async publishPassport(wallet, passport){
        let neo = this;
        return new Promise(async (resolve, reject) => {
            if (!wallet) {
                reject("wallet not provided");
            }
            if (!passport) {
                reject("passport not provided");
            }

            try {
                //Create the transaction
                let publicKeyHash = _crypto.getHash(passport.publicKey);
                let addressScriptHash = this._getAddressScriptHash(wallet.address);
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
                let tx = await this._createAndSignTransaction(wallet, _bridgeContractHash, 'publish', args);
                //console.log(JSON.stringify(tx));

                //Relay the transaction
                resolve(await this._relayTransactionWaitStatus(tx));
            }
            catch (err) {
                reject(err);
                return;
            }
        });
    }

    async getAddressForPassport(passportId) {
        let storage = await this._getStorage(_bridgeContractHash, passportId);
        if (!storage) {
            console.log("Address not registered.");
            return null;
        }
        var deserialized = this._deserialize(storage);

        //For each NEO address we are going to get the token balance
        let addresslist = deserialized[1];
        for (var scripthash in addresslist) {
            return this._getAddressFromScriptHash(addresslist[scripthash]);
        }

        return null;
    }

    async getPassportForAddress(address) {
        let addressScriptHash = this._getAddressScriptHash(address);
        let storage = await this._getStorage(_bridgeContractHash, addressScriptHash);
        if (!storage) {
            console.log("Address not registered.");
            return null;
        }
        return storage;
    }

    async unpublishPassport(wallet, passport){
        let neo = this;
        return new Promise(async (resolve, reject) => {
            if (!wallet) {
                reject("wallet not provided");
            }
            if (!passport) {
                reject("passport not provided");
            }

            try {
                //Create the transaction
                let addressScriptHash = this._getAddressScriptHash(wallet.address);
                let args = [
                    addressScriptHash,
                    passport.id,
                    addressScriptHash
                ];
                //invoke <contracthash> "revoke" [address, identity, userr]
                //address = your public neo address being used to sign the invocation / tx
                //identity = bridge passport id
                //user = the address to remove
                let tx = await this._createAndSignTransaction(wallet, _bridgeContractHash, 'revoke', args);
                //console.log(JSON.stringify(tx));

                //Relay the transaction
                resolve(await this._relayTransactionWaitStatus(tx));
            }
            catch (err) {
                reject(err);
                return;
            }
        });
    }

    //Amount is 100000000 = 1
    async sendBrdg(wallet, recipient, amount, paymentIdentifier, wait) {
        let neo = this;
        return new Promise(async (resolve, reject) => {
            if (!wallet)
                reject("wallet not provided");
            if(!wallet.unlocked)
                reject("wallet not unlocked");
            if (!amount)
                reject("amount not provided");
            if (!recipient)
                recipient = _bridgeContractAddress;

            try {
                let addressScriptHash = this._getAddressScriptHash(wallet.address);
                let recipientScriptHash = this._getAddressScriptHash(recipient);
                let args = [
                    addressScriptHash,
                    recipientScriptHash,
                    amount
                ];

                //invoke <contracthash> "transfer" [address, to, amount]
                //arguments[0] = address
			    //arguments[1] = to
			    //arguments[2] = amount
                let tx = await this._createAndSignTransaction(wallet, _brdgHash, 'transfer', args, paymentIdentifier);

                //Relay the transaction
                if(!wait)
                    resolve(await this._relayTransaction(tx));
                else
                    resolve(await this._relayTransactionWaitStatus(tx));
            }
            catch (err) {
                reject(err);
                return;
            }
        });
    }

    async verifyTransfer(info, recipient, amount, identifier) {
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
                                console.log("transaction confirmed");
                                return { complete: true, success: true, txid };
                            }
                        }
                        //Look for a straight nep5 transfer
                        if (notify.contract == _brdgHash && notify.values[0] == "transfer" && notify.values.length == 4) {
                            //let from = notify.values[1];
                            let to = notify.values[2];
                            let amt = notify.values[3];

                            if (amt >= amount && to == recipient) {
                                console.log("transaction confirmed");
                                return { complete: true, success: true, txid };
                            }
                        }
                    }
                }
            }
        }

        console.log("transaction could not be confirmed");
        return { complete: true, success: false, txid };
    }

    async verifyTransferFromHash(txid, recipient, amount, identifier) {
        //Get the transaction info
        let info = await this._getTransactionInfo(txid);
        if (info == null) {
            console.log("transaction not found");
            return { complete: false, success: false };
        }

        return await this.verifyTransfer(info, recipient, amount, identifier);
    }

    //Bridge is the only accepted passport to sign this transaction
    async createApprovedClaimTransaction(wallet, claim, secondaryAddress, hashOnly) {
        return new Promise(async (resolve, reject) => {
            if (!claim) {
                reject("claims not provided");
            }
            if (!wallet) {
                reject("wallet not provided");
            }

            let bridgeContractHash = _bridgeContractHash;
            if (bridgeContractHash.startsWith("0x")) {
                bridgeContractHash = bridgeContractHash.slice(2);
            }

            let secondaryPassportId = await this.getPassportForAddress(secondaryAddress);
            if(!secondaryPassportId)
                throw new Error("Passport is not registered");
            const secondaryAddressScriptHash = this._getAddressScriptHash(secondaryAddress);
            const addressScriptHash = this._getAddressScriptHash(wallet.address);
            const account = new _neon.wallet.Account(wallet.privateKey);

            //Allow publishing the actual or hash value
            let claimValue = claim.claimValue.toString();
            if(hashOnly)
                claimValue = _crypto.getHash(claimValue);

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
                    _crypto.hexEncode(claim.claimTypeId.toString()),
                    _crypto.hexEncode(claimValue),
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
    async secondarySignAddClaimTransaction(tx, wallet) {
        return new Promise(async (resolve, reject) => {
            let account = new _neon.wallet.Account(wallet.privateKey);
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
            config.signingFunction = _neon.api.signWithPrivateKey(wallet.privateKey);
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
    async sendAddClaimTransaction(tx) {
        return new Promise(async (resolve, reject) => {
            if (!tx) {
                reject("tx not provided");
            }

            try {
                //Relay the transaction
                resolve(await this._relayTransactionWaitStatus(tx));
            }
            catch (err) {
                reject(err);
                return;
            }
        });
    }

    async removeClaim(wallet, claimTypeId) {
        return new Promise(async (resolve, reject) => {
            if (!claimTypeId) {
                reject("claimTypeIds not provided");
            }
            if (!wallet) {
                reject("wallet not provided");
            }

            let passportId = await this.getPassportForAddress(wallet.address);
            try {
                let addressScriptHash = this._getAddressScriptHash(wallet.address);
                let args = [
                    addressScriptHash,
                    passportId,
                    _crypto.hexEncode(claimTypeId.toString())
                ];

                //invoke <contracthash> "revokeclaims" [address, identity, claims]
                //address
                //identity
                //claims - [[claimtypeid,claimvalue,createdon]]
                let tx = await this._createAndSignTransaction(wallet, _bridgeContractHash, 'revokeclaim', args);

                //Relay the transaction
                resolve(await this._relayTransactionWaitStatus(tx));
            }
            catch (err) {
                reject(err);
                return;
            }
        });
    }

    async getClaimForPassport(passportId, claimType) {
        claimType = _crypto.hexEncode(claimType.toString());

        let storageKey = (passportId + '3032' + claimType);
        let storage = await this._getStorage(_bridgeContractHash, storageKey);
        if (!storage || storage.length == 0)
            return null;

        let type = claimType;
        let date = 0;
        let value = null;
        try{
            let deserialized = await this._deserialize(storage);
            type = _crypto.hexDecode(claimType);
            date = parseInt(deserialized[1]);
            value = this._unhexlify(deserialized[0]);
        }
        catch(err){
            console.log("Could not deserialize claim data: " + err.message);
        }
        return { type, date, value };
    }

    async getClaimForAddress(address, claimType) {
        let passportId = await this.getPassportForAddress(address);
        if (!passportId)
            return null;

        return await this.getClaimForPassport(passportId, claimType);
    }
    //End smart contract for passport and claims management


    async _createAndSignTransaction(wallet, scriptHash, operation, args, remark) {
        if (!wallet) {
            throw new Error("wallet not provided");
        }
        if(!wallet.unlocked){
            throw new Error("wallet not unlocked");
        }
        if (!scriptHash) {
            throw new Error("scriptHash not provided");
        }
        if (!operation) {
            throw new Error("operation not provided");
        }
        if (!args) {
            throw new Error("args not provided");
        }

        //Sanitize the scripthash
        if (scriptHash.startsWith("0x")) {
            scriptHash = scriptHash.slice(2);
        }

        //Ensure remark for uniqueness
        if (!remark) {
            remark = this._getRandom();
        }

        // Create a transaction script and parameters
        let primaryAddress = wallet.address;
        let scriptParams = { scriptHash, operation, args };
        let transactionParameters = {
            scriptParams,
            remark,
            primaryAddress
        };

        // Create the transaction
        let transaction = this._createTransaction(transactionParameters);

        //User signs it
        transaction.sign(wallet.unlocked.privateKey);

        //console.log(JSON.stringify(transaction));

        //Get the hash
        let hash = transaction.hash; //_neon.tx.getTransactionHash(transaction);
        let deserialized = transaction;

        //Serialize
        transaction = transaction.serialize(); //_neon.tx.serializeTransaction(transaction);

        return { hash, transaction, transactionParameters, deserialized };
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

        let url = _neoscanApiUrl + "/" + endpoint + "/" + param;
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

            let string = _crypto.hexDecode(hex);

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

exports.NEO = new NEO();