const _neon = require('@cityofzion/neon-js');
const _crypto = require('./crypto');
const neoHash = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
const gasHash = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";

class NEOUtility {
    _getSalt() {
        const date = new Date();
        const random = Neon.u.sha256(Neon.u.str2hexstring(date.toISOString() + Math.random()));
        return random;
    }

    _getRandom() {
        let date = new Date();
        return _neon.u.sha256(_neon.u.str2hexstring(date.toISOString() + Math.random()));
    }

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
        if(!wif){
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
        if(wif){
            nep2Key = await this.createNep2KeyFromWif(wif, passphrase);
        }
        else{
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

    getAddressScriptHash(address) {
        if (!address) {
            throw new Error("address not provided");
        }

        return _neon.u.reverseHex(_neon.wallet.getScriptHashFromAddress(address));
    }


    async getGasBalance(address){
        return new Promise((resolve, reject) => {
            const provider = new _neon.api.neoscan.instance("MainNet");
            _neon.settings.httpsOnly = true;

            // Get an RPC Endpoint (Neo Node)
            provider.getRPCEndpoint().then(nodeUrl => {
                let client = _neon.default.create.rpcClient(nodeUrl);
                client.getAccountState(address).then(response => {
                    let gasBalance = -1;
                    for(let i=0; i<response.balances.length; i++){
                        let balance = response.balances[i];
                        if(balance.asset == gasHash){
                            gasBalance = balance.value;
                        }
                    }
                    if(gasBalance >= 0)
                        resolve(gasBalance);
                    else
                        reject("Could not get GAS balance");
                });
            });
        });
    }

    async relayTransaction(transaction)
    {
        return new Promise((resolve, reject) => {
            const provider = new _neon.api.neoscan.instance("MainNet");
            _neon.settings.httpsOnly = true;
            provider.getRPCEndpoint().then(nodeUrl => {
                let client = _neon.default.create.rpcClient(nodeUrl);
                client.sendRawTransaction(transaction)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
            });
        });
    }

    async checkTransactionComplete(txid, callback) {
        let neo = this;
        setTimeout(async function () {
            let tx;
            
            try{
              tx = await neo.getRawTransaction(txid);
            }
            catch{

            }
            
            if(!tx || !tx.blockhash){
                console.log("Transaction not found or not complete, waiting 15s and retrying...");
                await neo.checkTransactionComplete(txid, callback);
            }
            else{
                console.log("Transaction found and complete");
                callback(tx);
            }
        }, 15000);
    }

    async getRawTransaction(txid){
        return new Promise((resolve, reject) => {
            const provider = new _neon.api.neoscan.instance("MainNet");
            _neon.settings.httpsOnly = true;
            provider.getRPCEndpoint().then(nodeUrl => {
                let client = _neon.default.create.rpcClient(nodeUrl);
                client.getRawTransaction(txid)            
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
            });
        });
    }

    async getPublishAddressTransaction(passport, passphrase, scripthash, publicKeyHash) {
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }
        if (!scripthash) {
            throw new Error("scripthash not provided");
        }
        if(!publicKeyHash){
            throw new Error("public key hash not provided");
        }

        let addressScriptHash = this.getAddressScriptHash(passport.wallets[0].address);
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
        return await this._createTransaction(scripthash, 'publish', args, passport, passphrase);
    }

    async getAddAddressTransaction(passport, passphrase, scripthash) {
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }
        if (!scripthash) {
            throw new Error("scripthash not provided");
        }

        let addressScriptHash = this.getAddressScriptHash(passport.wallets[0].address);
        let args = [
            addressScriptHash,
            passport.id,
            addressScriptHash,
            addressScriptHash
        ];

        //invoke <contracthash> "publish" [address, identity, key, provider]
        //address = your public neo address being used to sign the invocation / tx
        //identity = bridge passport id
        //user = the address scripthash
        //provider = the account paying the tokens for the action
        return await this._createTransaction(scripthash, 'add', args, passport, passphrase);
    }

    async getRevokeAddressTransaction(passport, passphrase, scripthash) {
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }
        if (!scripthash) {
            throw new Error("scripthash not provided");
        }

        let addressScriptHash = this.getAddressScriptHash(passport.wallets[0].address);
        let args = [
            addressScriptHash,
            passport.id,
            addressScriptHash
        ];

        //invoke <contracthash> "remove" [address, identity, user]
        //address = your public neo address being used to sign the invocation / tx
        //identity = bridge passport id
        //user = the signer of the transaction
        return await this._createTransaction(scripthash, 'revoke', args, passport, passphrase);
    }

    async getSpendTokensTransaction(recipient, amount, passport, passphrase, scripthash, paymentIdentifier) {
        if (!amount) {
            throw new Error("amount not provided");
        }
        if (!recipient) {
            throw new Error("Recipient not provided");
        }
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }
        if (!scripthash) {
            throw new Error("scripthash not provided");
        }

        let addressScriptHash = this.getAddressScriptHash(passport.wallets[0].address);
        let recipientScriptHash = this.getAddressScriptHash(recipient);
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
        return await this._createTransaction(scripthash, 'spend', args, passport, passphrase, paymentIdentifier);
    }

    async getAddHashTransaction(hash, passport, passphrase, scripthash) {
        if (!hash) {
            throw new Error("hash not provided");
        }
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }
        if (!scripthash) {
            throw new Error("scripthash not provided");
        }

        let addressScriptHash = this.getAddressScriptHash(passport.wallets[0].address);
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
        return await this._createTransaction(scripthash, 'addhash', args, passport, passphrase);
    }

    async getRemoveHashTransaction(hash, passport, passphrase, scripthash) {
        if (!hash) {
            throw new Error("hash not provided");
        }
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }
        if (!scripthash) {
            throw new Error("scripthash not provided");
        }

        let addressScriptHash = this.getAddressScriptHash(passport.wallets[0].address);
        let args = [
            addressScriptHash,
            passport.id,
            hash
        ];

        //invoke <contracthash> "revokehash" [address, identity, digest]
        //address = your public neo address being used to sign the invocation / tx
        //identity = bridge passport id to deposit funds to
        //digest = SHA256 hash payload
        return await this._createTransaction(scripthash, 'revokehash', args, passport, passphrase);
    }

    async getAddClaimTransaction(claim, passport, passphrase, scripthash, bridgeAddress) {
        if (!claim) {
            throw new Error("claims not provided");
        }
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }
        if (!scripthash) {
            throw new Error("scripthash not provided");
        }
        if(!bridgeAddress){
            throw new Error("bridgeAddress not provided");
        }

        let addressScriptHash = this.getAddressScriptHash(passport.wallets[0].address);
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
        return await this._createTransaction(scripthash, 'addclaim', args, passport, passphrase, null, bridgeAddress);
    }

    async getRemoveClaimTransaction(claimTypeId, passport, passphrase, scripthash) {
        if (!claimTypeId) {
            throw new Error("claimTypeIds not provided");
        }
        if (!passport) {
            throw new Error("passport not provided");
        }
        if (!passphrase) {
            throw new Error("passphrase not provided");
        }
        if (!scripthash) {
            throw new Error("scripthash not provided");
        }

        let addressScriptHash = this.getAddressScriptHash(passport.wallets[0].address);
        let args = [
            addressScriptHash,
            passport.id,
            claimTypeId
        ];

        //invoke <contracthash> "revokeclaims" [address, identity, claims]
        //address
        //identity
        //claims - [[claimtypeid,claimvalue,createdon]]
        return await this._createTransaction(scripthash, 'revokeclaim', args, passport, passphrase);
    }

    _createTx(transactionParameters){
        //Create the transaction
        let transaction = new _neon.tx.InvocationTransaction();
        transaction.script = _neon.sc.createScript(transactionParameters.scriptParams);
        transaction.addRemark(transactionParameters.remark);
        transaction.addAttribute(32, _neon.u.reverseHex(_neon.wallet.getScriptHashFromAddress(transactionParameters.primaryAddress)));
        if(transactionParameters.secondaryAddress){
            transaction.addAttribute(32, _neon.u.reverseHex(_neon.wallet.getScriptHashFromAddress(transactionParameters.secondaryAddress)));
        }
        return transaction;
    }

    async _createTransaction(scriptHash, operation, args, passport, passphrase, remark, secondaryAddress) {
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

        if(!remark){
            remark = this._getRandom();
        }

        // Create a transaction script and parameters
        let scriptParams = { scriptHash, operation, args };
        let transactionParameters = {
            scriptParams,
            remark,
            primaryAddress
        };
        if(secondaryAddress){
            transactionParameters.secondaryAddress = secondaryAddress;
        }

        // Create the transaction
        let transaction = this._createTx(transactionParameters);
        
        //User signs it
        transaction.sign(wallet.privateKey);

        //Get the hash
        let hash = transaction.hash; //_neon.tx.getTransactionHash(transaction);

        //Serialize
        transaction = transaction.serialize(); //_neon.tx.serializeTransaction(transaction);
        
        return { transactionParameters, transaction, hash };
    }

    secondarySignTransaction(transactionParameters, transaction, hash, wif){
        //The transaction we want to sign
        let primaryTransaction = _neon.tx.deserializeTransaction(transaction);

        //Create a second transaction with the same properties
        let secondaryTransaction = this._createTx(transactionParameters);

        //Sign the transaction
        var wallet = new _neon.wallet.Account(wif);
        secondaryTransaction.sign(wallet.privateKey);

        // Create a new unsigned transaction with the same properties
        transaction = this._createTx(transactionParameters);

        // Merge signatures from both signed transactions to the unsigned transaction
        transaction.scripts = [primaryTransaction, secondaryTransaction].map(tx => tx.scripts[0]);

        // Reverse the signature scripts
        transaction.scripts.reverse();

        // Get the transaction hash
        hash = _neon.tx.getTransactionHash(transaction);

        //Serialize the transaction
        transaction = transaction.serialize();

        return { transactionParameters, transaction, hash };
    }
};

exports.NEOUtility = new NEOUtility();