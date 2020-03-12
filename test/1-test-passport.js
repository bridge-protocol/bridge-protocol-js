const _bridge = require('../src/index');
const chai = require('chai');
const _fs = require('fs');
const expect = chai.expect;    // Using Expect style

const _passportFile = "./test/data/user-passport.json";
const _passphrase = "0123456789";
var _passport = new _bridge.Models.Passport();
var _ethPrivateKey;
var _ethAddress;
var _neoPrivateKey;
var _neoAddress;

describe("Create a passport with NEO and Ethereum wallets", function() {
    before(async () => {
        await _passport.create(_passphrase);
        await _passport.addWallet("neo", _passphrase);
        await _passport.addWallet("eth", _passphrase);
    });

    it("should have an id", function() {
    	expect(_passport).to.have.property('id');
    });

    it("should have a public key", function() {
        expect(_passport).to.have.property('publicKey');
    });

    it("should have a private key", function() {
        expect(_passport).to.have.property('privateKey');
    });

    it("should have a wallets collection containing both wallets", function(){
        expect(_passport).to.have.property('wallets');
        expect(_passport.wallets).length == 2;
    });

    it("should have a neo wallet", function() {
        expect(_passport.wallets[0].network).to.equal('NEO');
    });

    it("should have an ethereum wallet", function() {
        expect(_passport.wallets[1].network).to.equal('ETH');
    });

    it("should have a claims collection", function() {
        expect(_passport).to.have.property('claims');
    });
});

describe("Unlock NEO wallet with the passphrase and get the private key", function(){
    let wallet;
    before(async () => {
        wallet = _passport.getWalletForNetwork("neo");
        await wallet.unlock(_passphrase);
        _neoPrivateKey = wallet.privateKey;
        _neoAddress = wallet.address;
    });

    it("should be unlocked", function(){
        expect(wallet.unlocked).to.be.not.null;
    });

    it("should have a private key", function(){
        expect(wallet.privateKey).to.be.not.null;
    });
});

describe("Unlock Ethereum wallet with the passphrase and get the private key", function(){
    let wallet;
    before(async () => {
        wallet = _passport.getWalletForNetwork("eth");
        await wallet.unlock(_passphrase);
        _ethPrivateKey = wallet.privateKey;
        _ethAddress = wallet.address;
    });

    it("should be unlocked", function(){
        expect(wallet.unlocked).to.be.not.null;
    });

    it("should have a private key", function(){
        expect(wallet.privateKey).to.be.not.null;
    });
});

describe("Save the Passport", function() {
    before(async () => {
        _passport.save(_passportFile);
    });
});

describe("Load a Passport from File with Correct Password", function() {
    let loaded;
    let passport = new _bridge.Models.Passport();
    before(async () => {
        loaded = await passport.openFile(_passportFile, _passphrase);
    });

    it("should not load a passport with the incorrect passphrase", async () => {
        expect(loaded).to.equal(true);
        expect(passport.id).to.be.not.null;
    })

    it("should load a passport that has an id", function() {
        expect(passport).to.have.property('id');
    });

    it("should load a passport that has a public key", function() {
        expect(passport).to.have.property('publicKey');
    });

    it("should load a passport that has a private key", function() {
        expect(passport).to.have.property('privateKey');
    });
});

describe("Load a Passport from File with Incorrect Password", function() {
    let loaded;
    let passport = new _bridge.Models.Passport();
    before(async () => {
        loaded = await passport.openFile(_passportFile, "incorrect");
    });

    it("should not load a passport with the incorrect passphrase", async () => {
        expect(loaded).to.equal(false);
        expect(passport.id).to.be.null;
    })
});

describe("Create a Passport with existing NEO and Ethereum wallets", function() {
    let passport = new _bridge.Models.Passport();
    before(async () => {
        await passport.create(_passphrase);
        await passport.addWallet("neo", _passphrase, _neoPrivateKey);
        await passport.addWallet("eth", _passphrase, _ethPrivateKey);
    });

    it("should have an id", function() {
    	expect(passport).to.have.property('id');
    });

    it("should have a public key", function() {
        expect(passport).to.have.property('publicKey');
    });

    it("should have a private key", function() {
        expect(passport).to.have.property('privateKey');
    });

    it("should have a wallets collection containing both wallets", function(){
        expect(passport).to.have.property('wallets');
        expect(passport.wallets).length == 2;
    });

    it("should have a neo wallet", function() {
        expect(passport.wallets[0].network).to.equal('NEO');
        expect(passport.wallets[0].address).to.equal(_neoAddress);
    });

    it("should have an ethereum wallet", function() {
        expect(passport.wallets[1].network).to.equal('ETH');
        expect(passport.wallets[1].address).to.equal(_ethAddress);
    });

    it("should have a claims collection", function() {
        expect(passport).to.have.property('claims');
    });
});