const _fs = require('fs');
const _cryptoUtility = require('../utils/crypto');
const _claimUtility = require('../utils/claim');
const _neoUtility = require('../utils/neo');
const _passportApi = require('../api/passport');
const _passport = require('../models/passport');

var passportUtility = class PassportUtility {
    constructor(apiBaseUrl, passport, passphrase, scripthash) {
        if (!passport)
            return;

        this._passport = passport;
        this._passphrase = passphrase;
        this._scripthash = scripthash;
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

    async createPassport(passphrase, neoKey) {
        if(!passphrase){
            throw new Error("passphrase not provided.");
        }

        let passport = null;
        let options = {
            passphrase,
            neoKey
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
        let decryptedClaims = new Array();
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

    async addBlockchainAddress(network) {
        if(!network){
            throw new Error("network not provided.");
        }

        if(network.toLowerCase() === "neo"){
            let transaction = this._neoHelper.getPublishAddressTransaction(this._passport, this._passphrase, this._scripthash);
            let success = await this._passportService.addBlockchainAddress(network, transaction);
            if(success){
                return transaction.hash;
            }
        }

        return null;
    }

    async removeBlockchainAddress(network) {
        if(!network){
            throw new Error("network not provided.");
        }

        if(network.toLowerCase() === "neo"){
            let transaction = this._neoHelper.getRevokeAddressTransaction(this._passport, this._passphrase, this._scripthash);
            let success = await this._passportService.removeBlockchainAddress(network, transaction);
            if(success){
                return transaction.hash;
            }
        }
        return null;
    }

    async sendPayment(network, amount, recipient) {
        if(!network){
            throw new Error("network not provided.");
        }
        if(!amount){
            throw new Error("amount not provided.");
        }
        if(!recipient){
            throw new Error("recipient not provided.");
        }

        if(network.toLowerCase() === "neo"){
            let transaction = this._neoHelper.getSpendTokensTransaction(recipient, amount, this._passport, this._passphrase, this._scripthash);
            let success = await this._passportService.sendPayment(network, recipient, amount, transaction);
            if(success){
                return transaction.hash;
            }
        }
        return null;
    }
};

exports.PassportUtility = passportUtility;

