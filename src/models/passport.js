const _fs = require('fs');
const _constants = require('../constants').Constants;
const _crypto = require('../utils/crypto').Crypto;
const _wallet = require('./wallet');
const _claim = require('./claim');
const _claimPackage = require('./claimPackage');

var passport = class Passport
{
    constructor(){
        this._reset();
    };

    get publicKey(){
        return this.key.public;
    }

    get privateKey(){
        return this.key.private;
    }

    async create(password) {
        console.log("creating passport");
        if(!password)
            throw new Error("password not specified.");
            
        //Generate the passport key
        var generatedKey = await _crypto.generateKey(password);
    
        this.key = {
            public: generatedKey.public,
            private: generatedKey.private
        };

        this.id = generatedKey.passportId;
        this.version = _constants.passportVersion;
    };

    async openFile(filePath, password){
        console.log(`opening passport from ${filePath}`);
        if(!filePath)
            throw new Error("filePath not provided");

        var buffer = _fs.readFileSync(filePath);
        var content = buffer.toString();
        return await this.open(content, password);
    }

    async open(passportJson, password)
    {
        console.log("opening passport from content");
        if(!await this._load(passportJson)){
            throw new Error("Could not open Bridge Passport: Invalid or corrupted file");
        }

        try{
            console.log("verifying passport password");
            let key = await _crypto.decryptPrivateKey(this.key.private, password);
        }
        catch(err){
            this._reset();
            return false;
        }

        return true;
    };

    async save(filePath){
        console.log("saving passport");
        if(!filePath)
            throw new Error("filePath not provided");

        let passport = await this.export();
        if(!passport)
            throw new Error("error serializing passport");

        try {
            console.log(`saving passport to ${filePath}`);
            _fs.writeFileSync(filePath, JSON.stringify(passport));
            return true;
        }
        catch (err) {
            console.log("Could not save passport to file " + filePath + ": " + err.message);
        }
        return false;
    }

    async export(){
        console.log("preparing passport for export");
        //Copy the object
        let serialized = JSON.stringify(this);
        let exp = JSON.parse(serialized);

        //Sanitize the wallets and keys
        for(let i=0; i<exp.wallets.length; i++){
            let wallet = exp.wallets[i];
            exp.wallets[i] = new _wallet.Wallet(wallet.network, wallet.address, wallet.key).export();
        }

        return exp;
    }

    async addWallet(network, password, privateKey)
    {
        console.log(`adding ${network.toUpperCase()} wallet`);
        if(!network)
            throw new Error("network not provided");
        if(!password)
            throw new Error("password not provided");

        let wallet = new _wallet.Wallet(network);
        await wallet.create(password, privateKey);

        if(!wallet.key)
            return false;

        this.wallets.push(wallet);
    }

    getWalletForNetwork(network){
        console.log(`getting wallet for ${network.toUpperCase()}`);
        if(!network)
            throw new Error("Network not provided.");
        if(!this.wallets || this.wallets.length == 0)
            throw new Error("Wallet not found for " + network);

        for(const wallet of this.wallets){
            if(wallet.network.toLowerCase() === network.toLowerCase())
                return wallet;
        }

        return null;
    }

    getWalletAddresses(networks){
        let addresses = [];
        for(let i=0; i<networks.length; i++){
            let wallet = this.getWalletForNetwork(networks[i]);
            if(wallet)
                addresses.push({ network: wallet.network, address: wallet.address });
        }
        return addresses;
    }

    async getDecryptedClaim(claimTypeId, password){
        let claimPackage = this.getClaimPackage(claimTypeId);
        if(claimPackage)
            return await claimPackage.decrypt(this.privateKey, password);

        return null;
    }

    async getDecryptedClaims(claimTypeIds, password)
    {
        let claims = [];
        let claimPackages = this.getClaimPackages(claimTypeIds);
        if(claimPackages){
            for(let i=0; i<claimPackages.length; i++){
                let claim = await claimPackages[i].decrypt(this.privateKey, password);
                if(claim)
                    claims.push(claim);
            }
        }

        return claims;
    }

    getClaimPackages(claimTypeIds){
        if(!claimTypeIds)
            throw new Error("no claimTypeIds specified");

        let claims = new Array();
        for(let i=0; i<claimTypeIds.length; i++){
            let claim = this.getClaimPackage(claimTypeIds[i]);
            if(claim)
                claims.push(claim);
        }

        return claims;
    }

    getClaimPackage(claimTypeId){
        if(!claimTypeId)
            return null;

        for(let i=0; i<this.claims.length; i++){
            if(this.claims[i].typeId == claimTypeId)
                return this.claims[i];
        }

        return null;
    }

    _reset(){
        this.id = null;
        this.version = null;
        this.key = {
            public: null,
            private: null
        };
        this.wallets = new Array();
        this.claims = new Array();
    }

    async _load(json){
        let passport = JSON.parse(json);

        if(!passport)
            return false;

        if(!passport.id ||
            !passport.version || 
            !passport.key ||
            !passport.key.public ||
            !passport.key.private){
                return false;
        }

        this._reset();

        this.id = passport.id;
        this.version = passport.version;
        this.key = passport.key;

        this.wallets = await this._initWallets(passport.wallets);
        this.claims = await this._initClaims(passport.claims);
        
        return true;
    }

    async _initClaims(claimPackages){
        let claims = [];
        if(!claimPackages || claimPackages.length == 0)
            return claims;

        for(const c of claimPackages){
            let claimPackage = new _claimPackage.ClaimPackage(c.typeId, c.signedBy, c.claim);
            claims.push(claimPackage);
        };

        return claims;
    }

    async _initWallets(wallets){
        if(!wallets || wallets.length == 0)
            return unlockedWallets;
        
        for(let i=0; i<wallets.length; i++){
            wallets[i] = new _wallet.Wallet(wallets[i].network, wallets[i].address, wallets[i].key);
        }

        return wallets;
    }
};

exports.Passport = passport;