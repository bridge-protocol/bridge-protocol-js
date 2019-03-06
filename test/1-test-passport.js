const _bridge = require('../src/index');
const chai = require('chai');
const _fs = require('fs');
const expect = chai.expect;    // Using Expect style

const _passportFile = "./test/data/user-passport.json";
const _passphrase = "0123456789";

let _passportHelper = new _bridge.Passport();
describe("Create a Passport", function() {
    let _passport;

    before(async () => {
        _passport = await _passportHelper.createPassport(_passphrase);
    });

    it("should have an id", function() {
    	expect(_passport).to.have.property('id');
    });

    it("should have a public key", function() {
        expect(_passport.key).to.have.property('public');
    });

    it("should have a private key", function() {
        expect(_passport.key).to.have.property('private');
    });

    it("should have a neo wallet", function() {
        expect(_passport.wallets[0].network).to.equal('NEO');
    });

    it("should have claims", function() {
        expect(_passport).to.have.property('claims')
    });
});

describe("Save a Passport", function() {
    let passport;

    before(async () => {
        passport = await _passportHelper.createPassport(_passphrase);
        _fs.writeFileSync(_passportFile, JSON.stringify(passport));
    });

    it("should save a json file", function() {
        _fs.readFile(_passportFile, function(err, contents) {
            expect(JSON.parse(contents)).to.have.property('id');
        });
    });
});

describe("Load a Passport from File", function() {
    let loadedPassport;
    before(async () => {
        loadedPassport = await _passportHelper.loadPassportFromFile(_passportFile, _passphrase);
    });

    it("should load a passport that has an id", function() {
        expect(loadedPassport).to.have.property('id');
    });

    it("should load a passport that has a public key", function() {
        expect(loadedPassport).to.have.property('publicKey');
    });

    it("should load a passport that has a private key", function() {
        expect(loadedPassport).to.have.property('privateKey');
    });

    it("should not load a passport (from file) with the incorrect passphrase", async () => {
        loadedPassport = await _passportHelper.loadPassportFromFile(_passportFile, "incorrect");
        expect(loadedPassport).to.equal(null);
    })
});

describe("Load a Passport from Content", function() {
    let loadedPassport;

    before(async () => {
        const buffer = _fs.readFileSync(_passportFile);
        const content = buffer.toString();
        loadedPassport = await _passportHelper.loadPassportFromContent(content, _passphrase);
    });

    it("should load a passport that has an id", function() {
        expect(loadedPassport).to.have.property('id');
    });

    it("should load a passport that has a public key", function() {
        expect(loadedPassport).to.have.property('publicKey');
    });

    it("should load a passport that has a private key", function() {
        expect(loadedPassport).to.have.property('privateKey');
    });

    it("should not load a passport (from content) with the incorrect passphrase", async () => {
        const buffer = _fs.readFileSync(_passportFile);
        const content = buffer.toString();
        loadedPassport = await _passportHelper.loadPassportFromContent(content, "incorrect");
        expect(loadedPassport).to.equal(null);
    });
});
