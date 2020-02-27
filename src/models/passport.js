const _constants = require('../utils/constants').Constants;
const _crypto = require('../utils/crypto').Crypto;

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

    async open(passportJson, passphrase)
    {
        if(!this._load(passportJson)){
            throw new Error("Could not open Bridge Passport: Invalid or corrupted file");
        }

        try{
            let key = await _crypto.decryptPrivateKey(this.key.private, passphrase);
        }
        catch(err){
            throw new Error("Invalid passphrase");
        }

        return true;
    };

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

    getClaimsPackagesByType(claimTypeIds){
        let claimPackages = new Array();

        if(!claimTypeIds)
            return null;

        for(let i=0; i<claimTypeIds.length; i++){
            let claimType = claimTypeIds[i];
            let claimPackage = this.getClaimPackageByType(claimType);
            if(claimPackage)
            {
                claimPackages.push(claimPackage);
            }
        }

        return claimPackages;
    }

    getClaimPackageByType(claimTypeId){
        if(!claimTypeId)
            return null;

        for(let i=0; i<this.claims.length; i++){
            let claimPackage = this.claims[i];
            if(claimPackage.typeId == claimTypeId){
                return claimPackage;
            }
        }
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

    _load(json){
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
        this.wallets = passport.wallets;
        this.claims = passport.claims;

        return true;
    }
};

exports.Passport = passport;
