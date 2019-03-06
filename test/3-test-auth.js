const _bridge = require('../src/index');
const chai = require('chai');
const _fs = require('fs');
const expect = chai.expect;    // Using Expect style

const _userPassportFile = "./test/data/user-passport.json";
const _partnerPassportFile = "./test/data/partner-passport.json";
const _passphrase = "0123456789";
const _apiBaseUrl = "https://api.bridgeprotocol.io/";

let _passportHelper = new _bridge.Passport();
let _userPassport;
let _partnerPassport;
let _randomAuthToken;
let _requiredClaimTypes = [];

let _authRequest;
let _authRequestMessage;
let _authResponse;

describe("Loads the user and partner passports from file", function() {
    before(async () => {
        _userPassport = await _passportHelper.loadPassportFromFile(_userPassportFile, _passphrase);
        _partnerPassport = await _passportHelper.loadPassportFromFile(_partnerPassportFile, _passphrase);
    });

    it("should load the user passport successfully", function() {
        expect(_userPassport).to.have.property('id');
    });

    it("should load the partner passport successfully", function() {
        expect(_partnerPassport).to.have.property('id');
    });
});

describe("Partner creates a passport auth request", function() {
    before(async () => {
        let authHelper = new _bridge.Auth(_apiBaseUrl, _partnerPassport, _passphrase);
        _randomAuthToken = "randomtoken";
        _requiredClaimTypes = [3]; //User email
        _authRequest = await authHelper.createPassportLoginChallengeRequest(_randomAuthToken, _requiredClaimTypes);
    });

    it("should create a valid encoded auth request", function() {
        expect(_authRequest).to.be.not.null;

        let decodedAuthRequest = JSON.parse(_bridge.Crypto.hexDecode(_authRequest, true));
        expect(decodedAuthRequest).to.be.not.null;
        expect(decodedAuthRequest).to.have.property("publicKey", _partnerPassport.publicKey);     
        expect(decodedAuthRequest).to.have.property("payload").not.null;
        expect(decodedAuthRequest.payload).to.have.property("token").not.null; 
        expect(decodedAuthRequest.payload).to.have.property("claimTypes").not.null; 
    });
});

describe("User validates the passport auth request", function(){
    before(async () => {
        let authHelper = new _bridge.Auth(_apiBaseUrl, _userPassport, _passphrase);
        _authRequestMessage = await authHelper.verifyPassportLoginChallengeRequest(_authRequest);
    });

    it("should validate the auth request", function(){
        expect(_authRequestMessage).to.be.not.null;
        expect(_authRequestMessage).to.have.property("publicKey",_partnerPassport.publicKey);
        expect(_authRequestMessage).to.have.property("passportId", _partnerPassport.id);
        expect(_authRequestMessage).to.have.property("payload").not.null;
        expect(_authRequestMessage.payload).to.have.property("claimTypes").not.null;
        expect(_authRequestMessage.payload.claimTypes).length > 0;
        expect(_authRequestMessage.payload.claimTypes[0]).to.equal(3);
    });
});

describe("User creates a valid auth response to the parther auth request", function(){
    let claims;
    let decodedAuthResponse;

    it("should properly decrypt the claims packages", async function(){
        let claimHelper = new _bridge.Claim(_apiBaseUrl, _userPassport, _passphrase);
        claims = await claimHelper.decryptClaimPackages(_userPassport.claims);
        expect(claims).to.be.not.null;
        expect(claims).length > 0;
        expect(claims[0]).to.have.property("claimTypeId",3);
        expect(claims[0]).to.have.property("claimValue","someuser@bridgeprotocol.io");
        expect(claims[0]).to.have.property("createdOn").not.null;
        expect(claims[0]).to.have.property("expiresOn").not.null;
        expect(claims[0]).to.have.property("signature").not.null;
        expect(claims[0]).to.have.property("signedByKey").not.null;
    });

    it("should properly create a valid auth response including the token and claims", async function(){
        let authHelper = new _bridge.Auth(_apiBaseUrl, _userPassport, _passphrase);
        _authResponse = await authHelper.createPassportLoginChallengeResponse(_authRequestMessage.payload.token, claims, _authRequestMessage.publicKey);
        
        decodedAuthResponse = JSON.parse(_bridge.Crypto.hexDecode(_authResponse, true));
        expect(decodedAuthResponse).to.have.property("publicKey").not.null;
        expect(decodedAuthResponse).to.have.property("payload").not.null;
    });

    it("should only allow the auth response to be viewed by the partner passport", async function(){
        let partnerDecryptedAuthResponse = await _bridge.Crypto.decryptMessage(decodedAuthResponse.payload, decodedAuthResponse.publicKey, _partnerPassport.privateKey, _passphrase);
        let userDecryptedAuthResponse = await _bridge.Crypto.decryptMessage(decodedAuthResponse.payload, decodedAuthResponse.publicKey, _userPassport.privateKey, _passphrase);
        expect(partnerDecryptedAuthResponse).to.be.not.null;
        expect(userDecryptedAuthResponse).to.be.null;
    });
});

describe("Partner verifies the auth response and gets the passport and claim data", function(){
    let response;

    it("should verify the auth response", async function(){
        let authHelper = new _bridge.Auth(_apiBaseUrl, _partnerPassport, _passphrase);
        response = await authHelper.verifyPassportLoginChallengeResponse(_authResponse, _randomAuthToken, _requiredClaimTypes);
     });

    it("should verify the token matches what was sent", function(){
        expect(response.tokenVerified).equals(true);
    });

    it("should check there are no missing claim types", function(){
        expect(response.missingClaimTypes).length == 0;
    });

    it("should be able to read the claims and passport data", async function(){
        expect(response).to.have.property("passportId",_userPassport.id);
        expect(response.claims).length > 0;
        expect(response.claims[0]).to.have.property("claimTypeId",3);
        expect(response.claims[0]).to.have.property("claimValue","someuser@bridgeprotocol.io");
        expect(response.claims[0]).to.have.property("createdOn").not.null;
        expect(response.claims[0]).to.have.property("expiresOn").not.null;
        expect(response.claims[0]).to.have.property("signedById").not.null;
    });

});


