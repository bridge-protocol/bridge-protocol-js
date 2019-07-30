const _currentVersion = 1.1;
const _crypto = require('../utils/crypto');
const _neo = require('../utils/neo');
//const _claim = require('./claim');
//const _profile = require('./profile');

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

    async create(createPassportOptions) {
        let wallet = await _neo.NEOUtility.createNeoWallet(createPassportOptions.passphrase, createPassportOptions.neoKey);
        if(wallet)
            this.wallets.push(wallet);     

        //Generate the passport key
        var generatedKey = await _crypto.CryptoUtility.generateKey(createPassportOptions.passphrase);
    
        this.key = {
            public: generatedKey.public,
            private: generatedKey.private
        };

        this.id = generatedKey.passportId;
        this.version = _currentVersion;
    };

    async open(passportJson, passphrase){

        if(!this._load(passportJson)){
            throw new Error("Could not open Bridge Passport: Invalid or corrupted file");
        }

        let key;
        let wif;

        try{
            key = await _crypto.CryptoUtility.decryptPrivateKey(this.key.private, passphrase);
            wif = await _neo.NEOUtility.getWifFromNep2Key(this.wallets[0].key, passphrase);
        }
        catch(err){
            throw new Error("Invalid passphrase");
        }

        return key && wif;
    };

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
