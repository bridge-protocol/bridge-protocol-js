const _fs = require('fs');
const _cryptoUtility = require('../utils/crypto');
const _claimUtility = require('../utils/claim');
const _neoUtility = require('../utils/neo');
const _passportApi = require('../api/passport');
const _passport = require('../models/passport');

var passportUtility = class PassportUtility {
    constructor(apiBaseUrl, passport, passphrase) {
        if (!passport)
            return;

        this._passport = passport;
        this._passphrase = passphrase;
        this._cryptoHelper = _cryptoUtility.CryptoUtility;
        this._claimHelper = new _claimUtility.ClaimUtility(apiBaseUrl, passport, passphrase);
        this._neoHelper = _neoUtility.NEOUtility;
        this._passportService = new _passportApi.PassportApi(apiBaseUrl, passport, passphrase);
    }

    async getDetails(passportId) {
        if(!passportId){
            throw new Error("passportId not provided.");
        }

        return await this._passportService.getDetails(passportId);
    }

    async getPassportIdForPublicKey(publicKey) {
        if(!publicKey){
            throw new Error("publicKey not provided.");
        }

        return await this._cryptoHelper.getPassportIdForPublicKey(publicKey);
    }

    async createPassport(passphrase, neoWif, createNeoAddress) {
        if(!passphrase){
            throw new Error("passphrase not provided.");
        }

        let passport = null;
        let options = {
            passphrase,
            neoWif,
            createNeoAddress
        };

        try {
            passport = new _passport.Passport();
            await passport.create(options);
        }
        catch (err) {
            console.log(err.message);
        }

        return passport;
    }

    async savePassportToFile(passport, filePath) {
        if(!passport){
            throw new Error("passport not provided.");
        }
        if(!filePath){
            throw new Error("filePath not provided.");
        }

        try {
            _fs.writeFileSync(filePath, JSON.stringify(passport));
            return true;
        }
        catch (err) {
            console.log("Could not save passport to file " + filePath + ": " + err.message);
        }

        return false;
    }

    async loadPassportFromContent(content, passphrase){
        if(!content){
            throw new Error("content not provided.");
        }
        if(!passphrase){
            throw new Error("passphrase not provided.");
        }

        let passport = null;
        let loaded = null;

        try {
            passport = new _passport.Passport();
            loaded = await passport.open(content, passphrase);
        }
        catch (err) {
            console.log(err.message);
        }

        if(!loaded){
            passport = null;
        }
        
        return passport;
    }

    async loadPassportFromFile(filePath, passphrase) {
        if(!filePath){
            throw new Error("filePath not provided.");
        }
        if(!passphrase){
            throw new Error("passphrase not provided.");
        }

        var buffer = _fs.readFileSync(filePath);
        var content = buffer.toString();
        return await this.loadPassportFromContent(content, passphrase);
    }

    async getDecryptedClaims(claimTypeIds){
        let claimPackages;   

        if(!claimTypeIds){
            claimPackages = this._passport.claims;
        }
        else{
            claimPackages = this._passport.getClaimsPackagesByType(claimTypeIds);
        }

        if(claimPackages && claimPackages.length > 0){
            return this._claimHelper.decryptClaimPackages(claimPackages);
        }
        
        return null;
    }
};

exports.PassportUtility = passportUtility;

