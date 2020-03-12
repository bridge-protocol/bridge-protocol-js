const _bridge = require('../src/index');
const chai = require('chai');
const _fs = require('fs');
const expect = chai.expect;    // Using Expect style

const _userPassportFile = "./test/data/user-passport.json";
const _verificationPassportFile = "./test/data/verification-passport.json";
const _passphrase = "0123456789";
const _apiBaseUrl = "https://api.bridgeprotocol.io/";

let _userPassport = new _bridge.Models.Passport();
let _verificationPassport = new _bridge.Models.Passport();
let _verifiedClaims = [];
let _verifiedClaimPackages = [];

describe("Should load the user and verification passports from file", function() {
    before(async () => {
        await _userPassport.openFile(_userPassportFile, _passphrase);
        await _verificationPassport.openFile(_verificationPassportFile, _passphrase);
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
        let claim = new _bridge.Models.Claim({
            claimTypeId: 3,
            claimValue: "someuser@bridgeprotocol.io",
            createdOn: 1551180491,
            expiresOn: 0,
            signedByKey: _verificationPassport.publicKey
        });
        _verifiedClaims.push(claim);
    });
});

describe("Create valid signed and encrypted claim packages for user passport", function() {
    before(async () => {
        _verifiedClaimPackages = await _bridge.Utils.Claim.createClaimPackagesFromClaims(_verifiedClaims, _userPassport.publicKey, _verificationPassport.publicKey, _verificationPassport.privateKey, _passphrase);
    });

    it("should create valid encrypted signed claim packages", function() {
        expect(_verifiedClaimPackages).to.have.length > 0;
        expect(_verifiedClaimPackages[0]).to.have.property("claim").not.null;
        expect(_verifiedClaimPackages[0]).to.have.property("typeId", 3);
        expect(_verifiedClaimPackages[0]).to.have.property("signedBy", _verificationPassport.publicKey);
    });
});

describe("Claim packages are only able to be read by the user passport", function() {
    let verificationClaim;
    let userClaim;

    before(async () => {
        userClaim = await _verifiedClaimPackages[0].decrypt(_userPassport.privateKey, _passphrase);
        verificationClaim = await _verifiedClaimPackages[0].decrypt(_verificationPassport.privateKey, _passphrase);
    });

    it("claims should not be readable by the verification passport", function() {
        expect(verificationClaim).to.be.null;
    });

    it("claims should be readable by the user passport", function(){
        expect(userClaim).to.have.property("claimTypeId",3);
        expect(userClaim).to.have.property("claimValue","someuser@bridgeprotocol.io");
        expect(userClaim).to.have.property("createdOn",1551180491);
        expect(userClaim).to.have.property("expiresOn",0);
        expect(userClaim).to.have.property("signedByKey",_verificationPassport.publicKey);
        expect(userClaim).to.have.property("signature");
    });

    after(function() {
        _userPassport.claims = _verifiedClaimPackages;
        _fs.writeFileSync(_userPassportFile, JSON.stringify(_userPassport));
    });
});
