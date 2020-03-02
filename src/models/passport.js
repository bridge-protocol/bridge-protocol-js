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
        if(!filePath)
            throw new Error("filePath not provided");

        var buffer = _fs.readFileSync(filePath);
        var content = buffer.toString();
        return await this.open(content, password);
    }

    async open(passportJson, password)
    {
        if(!await this._load(passportJson, password)){
            throw new Error("Could not open Bridge Passport: Invalid or corrupted file");
        }

        try{
            let key = await _crypto.decryptPrivateKey(this.key.private, password);
        }
        catch(err){
            throw new Error("Invalid passphrase");
        }

        return true;
    };

    async save(filePath){
        if(!filePath)
            throw new Error("filePath not provided");

        let passport = this.export();
        if(!passport)
            throw new Error("error serializing passport");

        try {
            _fs.writeFileSync(filePath, JSON.stringify(passport));
            return true;
        }
        catch (err) {
            console.log("Could not save passport to file " + filePath + ": " + err.message);
        }
        return false;
    }

    async export(password){
        //Copy the object
        let serialized = JSON.stringify(this);
        let exp = JSON.parse(serialized);

        //Sanitize the wallets and keys
        for(let i=0; i<exp.wallets.length; i++){
            let wallet = exp.wallets[i];
            exp.wallets[i] = new _wallet.Wallet(wallet.network, wallet.address, wallet.key).export();
        }

        //Create claim packages for secure export
        for(let i=0; i<exp.claims.length; i++){
            let claim = new _claim.Claim(exp.claims[i]);
            exp.claims[i] = await claim.toClaimPackage(this.publicKey, this.publicKey, this.privateKey, password);
        }

        return JSON.stringify(exp);
    }

    async addWallet(network, password, privateKey)
    {
        if(!network)
            throw new Error("network not provided");
        if(!password)
            throw new Error("password not provided");

        let wallet = new _wallet.Wallet(network);
        wallet.create(password, privateKey);

        if(!wallet.key)
            return false;

        this.wallets.push(wallet);
        return true;
    }

    getWalletForNetwork(network){
        if(!network)
            throw new Error("Network not provided.");
        if(!this.wallets || this.wallets.length == 0)
            throw new Error("Wallet not found for " + network);

        for(let i=0; i<this.wallets.length; i++){
            let wallet = this.wallets[i];
            if(wallet.network.toLowerCase() === network.toLowerCase())
                return wallet;
        }

        return null;
    }

    async getDecryptedClaims(password, claimTypeIds){
        let claimPackages;
        if(!claimTypeIds)
            claimPackages = this.claims;
        else
            claimPackages = this.getClaimPackages(claimTypeIds);
        
        if(!claimPackages || claimPackages.length == 0)
            return null;

        let claims = [];
        for(var claimPackage in claimPackages){
            let claim = await claimPackage.decrypt(this.privateKey, password);
            claims.push(claim);
        }
        return claims;
    }

    getClaimPackages(claimTypeIds){
        if(!claimTypeIds)
            throw new Error("no claimTypeIds specified");

        let claimPackages = new Array();
        for(var claimTypeId in claimTypeIds){
            let claimPackage = this.getClaimPackageByType(claimTypeId);
            if(claimPackage != null)
                claimPackages.push(claimPackage);
        }
        return claimPackages;
    }

    getClaimPackage(claimTypeId){
        if(!claimTypeId)
            return null;

        for(var claimPackage in this.claims){
            if(claimPackage.typeId == claimTypeId)
                return claimPackage;
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

    async _load(json, password){
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

        this.wallets = await this._initWallets(passport.wallets, password);
        this.claims = await this._initClaims(passport.claims, password);
        
        return true;
    }

    async _initClaims(claimPackages, password){
        let claims = [];
        if(!claimPackages || claimPackages.length == 0)
            return claims;

        for(let i=0; i<claimPackages.length; i++){
            let c = claimPackages[i];
            let claimPackage = new _claimPackage.ClaimPackage(c.typeId, c.signedBy, c.claim);
            let claim = await claimPackage.decrypt(this.privateKey, password);
            claims.push(claim);
        }
        
        return claims;
    }

    async _initWallets(wallets, password){
        let unlockedWallets = [];
        if(!wallets || wallets.length == 0)
            return unlockedWallets;
        
        for(let i=0; i<wallets.length; i++){
            let w = wallets[i];
            let wallet = new _wallet.Wallet(w.network, w.address, w.key);
            await wallet.unlock(password);
            unlockedWallets.push(wallet);
        }

        return unlockedWallets;
    }
};

exports.Passport = passport;