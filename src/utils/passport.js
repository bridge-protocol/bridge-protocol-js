const _fs = require('fs');
const _constants = require('../utils/constants').Constants;
const _claim = require('../utils/claim');
const _neo = require('../utils/neo').NEO;
const _ethereum = require('../utils/ethereum').Ethereum;
const _crypto = require('../utils/crypto').Crypto;
const _passport = require('../models/passport');

var passport = class Passport {
    constructor() {

    }

    async unlockWallet(network, passport, password){
        if(!network)
            throw new Error("network not specified");
        if(!passport)
            throw new Error("passport not provided");
        if(!password)
            throw new Error("password not provided");

        let walletInfo = passport.getWalletForNetwork(network);
        if(!walletInfo)
            throw new Error("Wallet not found for " + network);

        //Already unlocked
        let unlocked = walletInfo.wallet;
        if(unlocked)
            return;

        if(network.toLowerCase() === "neo"){
            unlocked = await _neo.unlockWallet(walletInfo, password);
        }
        else if(network.toLowerCase() === "eth"){
            unlocked = await _ethereum.unlockWallet(walletInfo, password);
        }

        return unlocked;
    }

    async addBlockchainWallet(network, passport, password, privateKey)
    {
        if(!passport)
            throw new Error("passport not provided");
        if(!network)
            throw new Error("network not provided");
        if(!password)
            throw new Error("password not provided");

        let wallet;
        if(network.toLowerCase() == "neo"){
            wallet = await _neo.createWallet(password, privateKey);
        }
        else if(network.toLowerCase() === "eth"){
            wallet = _ethereum.createWallet(password, privateKey);
        }  

        if(!wallet)
            return false;

        passport.wallets.push(wallet);
        return true;
    }

    async getPassportIdForPublicKey(publicKey) {
        if(!publicKey){
            throw new Error("publicKey not provided.");
        }

        return await _crypto.getPassportIdForPublicKey(publicKey);
    }

    async createPassport(password) {
        if(!password){
            throw new Error("passphrase not provided.");
        }

        let passport = null;
        try {
            passport = new _passport.Passport();
            await passport.create(password);
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

    async getDecryptedClaims(passport, password, claimTypeIds){
        let claimPackages;   

        if(!claimTypeIds){
            claimPackages = passport.claims;
        }
        else{
            claimPackages = passport.getClaimsPackagesByType(claimTypeIds);
        }

        var claim = new _claim.Claim(passport, password);
        if(claimPackages && claimPackages.length > 0){
            return claim.decryptClaimPackages(claimPackages);
        }
        
        return null;
    }
};

exports.Passport = passport;

