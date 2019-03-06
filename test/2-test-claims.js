const _bridge = require('../src/index');
const chai = require('chai');
const _fs = require('fs');
const expect = chai.expect;    // Using Expect style

const _userPassportFile = "./test/data/user-passport.json";
const _verificationPassportFile = "./test/data/verification-passport.json";
const _passphrase = "0123456789";
const _apiBaseUrl = "https://api.bridgeprotocol.io/";

let _passportHelper = new _bridge.Passport();
let _userPassport;
let _verificationPassport;
let _verifiedClaims = [];
let _verifiedClaimPackages = [];

describe("Should load the user and verification passports from file", function() {
    before(async () => {
        _userPassport = await _passportHelper.loadPassportFromFile(_userPassportFile, _passphrase);
        _verificationPassport = await _passportHelper.loadPassportFromFile(_verificationPassportFile, _passphrase);
    });

    it("should load the user passport successfully", function() {
        expect(_userPassport).to.have.property('id');
    });

    it("should load the verification passport successfully", function() {
        expect(_verificationPassport).to.have.property('id');
    });
});

describe("Create valid claims", function() {
    it("should create a verified email claim", function() {
        _verifiedClaims.push({
            claimTypeId: 3,
            claimValue: "someuser@bridgeprotocol.io",
            createdOn: 1551180491,
            expiresOn: 1553580491
        });

        expect(_verifiedClaims).to.have.length > 0;
        expect(_verifiedClaims[0]).to.have.property("claimTypeId", 3);
        expect(_verifiedClaims[0]).to.have.property("claimValue","someuser@bridgeprotocol.io");
    });
});

describe("Create valid signed and encrypted claim packages for user passport", function() {
    before(async () => {
        let verificationClaimHelper = new _bridge.Claim(_apiBaseUrl, _verificationPassport, _passphrase);
        _verifiedClaimPackages = await verificationClaimHelper.createClaimPackages(_userPassport.publicKey, _verifiedClaims);
    });

    it("should create valid encrypted signed claim packages", function() {
        expect(_verifiedClaimPackages).to.have.length > 0;
        expect(_verifiedClaimPackages[0]).to.have.property("claim").not.null;
        expect(_verifiedClaimPackages[0]).to.have.property("typeId", 3);
        expect(_verifiedClaimPackages[0]).to.have.property("signedBy", _verificationPassport.publicKey);
    });
});

describe("Claim packages are only able to be read by the user passport", function() {
    let verificationClaims = [];
    let userClaims = [];

    before(async () => {
        let verificationClaimHelper = new _bridge.Claim(_apiBaseUrl, _verificationPassport, _passphrase);
        let userClaimHelper = new _bridge.Claim(_apiBaseUrl, _userPassport, _passphrase);

        userClaims = await userClaimHelper.decryptClaimPackages(_verifiedClaimPackages);
        verificationClaims = await verificationClaimHelper.decryptClaimPackages(_verifiedClaimPackages);
    });

    it("claims should not be readable by the verification passport", function() {
        expect(verificationClaims).to.have.length == 0;
    });

    it("claims should be readable by the user passport", function(){
        expect(userClaims).to.have.length > 0;
        expect(userClaims[0]).to.have.property("claimTypeId",3);
        expect(userClaims[0]).to.have.property("claimValue","someuser@bridgeprotocol.io");
        expect(userClaims[0]).to.have.property("createdOn",1551180491);
        expect(userClaims[0]).to.have.property("expiresOn",1553580491);
    });

    after(function() {
        _userPassport.claims = _verifiedClaimPackages;
        _fs.writeFileSync(_userPassportFile, JSON.stringify(_userPassport));
    });
});
