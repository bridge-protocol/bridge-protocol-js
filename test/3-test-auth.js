const _bridge = require('../src/index');
const _crypto = require('../src/utils/crypto').Crypto;
const chai = require('chai');
const _fs = require('fs');
const expect = chai.expect;    // Using Expect style

const _userPassportFile = "./test/data/user-passport.json";
const _partnerPassportFile = "./test/data/partner-passport.json";
const _passphrase = "0123456789";

let _userPassport = new _bridge.Models.Passport();
let _partnerPassport = new _bridge.Models.Passport();
let _randomAuthToken;
let _requiredClaimTypes = [];
let _requiredBlockchainAddresses = [];

let _authRequest;
let _authRequestMessage;
let _authResponse;

describe("Loads the user and partner passports from file", function() {
    before(async () => {
        await _userPassport.openFile(_userPassportFile, _passphrase);
        await _partnerPassport.openFile(_partnerPassportFile, _passphrase);
    });

    it("should load the user passport successfully", function() {
        expect(_userPassport).to.have.property('id');
        expect(_userPassport).to.have.property('publicKey');
        expect(_userPassport).to.have.property('privateKey');
    });

    it("should load the partner passport successfully", function() {
        expect(_partnerPassport).to.have.property('id');
        expect(_partnerPassport).to.have.property('publicKey');
        expect(_partnerPassport).to.have.property('privateKey');
    });
});

describe("Partner creates a passport auth request", function() {
    before(async () => {
        _randomAuthToken = "randomtoken";
        _requiredClaimTypes = [3]; //User email
        _requiredBlockchainAddresses = ["neo"];
        _authRequest = await _bridge.Messaging.Auth.createPassportChallengeRequest(_partnerPassport, _passphrase, _randomAuthToken, _requiredClaimTypes, _requiredBlockchainAddresses);
    });

    it("should create a valid encoded auth request", function() {
        expect(_authRequest).to.be.not.null;
        let decodedAuthRequest = JSON.parse(_crypto.hexDecode(_authRequest, true));
        expect(decodedAuthRequest).to.be.not.null;  
        expect(decodedAuthRequest).to.have.property("publicKey", _partnerPassport.publicKey);     
        expect(decodedAuthRequest).to.have.property("payload").not.null;
    });
});

describe("User validates the passport auth request", function(){
    before(async () => {
        _authRequestMessage = await _bridge.Messaging.Auth.verifyPassportChallengeRequest(_authRequest);
    });

    it("should validate the auth request", function(){
        expect(_authRequestMessage).to.be.not.null;
        expect(_authRequestMessage).to.have.property("publicKey",_partnerPassport.publicKey);
        expect(_authRequestMessage).to.have.property("passportId", _partnerPassport.id);
        expect(_authRequestMessage).to.have.property("payload").not.null;
        expect(_authRequestMessage.payload).to.have.property("claimTypes").not.null;
        expect(_authRequestMessage.payload).to.have.property("networks").not.null;
        expect(_authRequestMessage.payload.claimTypes).length > 0;
        expect(_authRequestMessage.payload.claimTypes[0]).to.equal(3);
    });
});

describe("User creates a valid auth response to the parther auth request", function(){
    let claims;
    let blockchainAddresses;

    it("should properly decrypt the claims packages", async function(){
        //Retrieve the requested claims
        claims = await _userPassport.getDecryptedClaims(_authRequestMessage.payload.claimTypes, _passphrase);
        expect(claims).to.be.not.null;
        expect(claims).length == 1;
        expect(claims[0]).to.have.property("claimTypeId",3);
        expect(claims[0]).to.have.property("claimValue","someuser@bridgeprotocol.io");
        expect(claims[0]).to.have.property("createdOn").not.null;
        expect(claims[0]).to.have.property("expiresOn").not.null;
        expect(claims[0]).to.have.property("signature").not.null;
        expect(claims[0]).to.have.property("signedByKey").not.null;
    });

    it("should find the requested blockchain address", async function(){
        blockchainAddresses = _userPassport.getWalletAddresses(_authRequestMessage.payload.networks);
        expect(blockchainAddresses).to.be.not.null;
        expect(blockchainAddresses).length == 1;
        expect(blockchainAddresses[0].network.toLowerCase() === "neo");
    });

    it("should properly create a valid auth response including the token and claims", async function(){
        _authResponse = await _bridge.Messaging.Auth.createPassportChallengeResponse(_userPassport, _passphrase, _authRequestMessage.publicKey, _authRequestMessage.payload.token, claims, blockchainAddresses); 
        decodedAuthResponse = JSON.parse(_crypto.hexDecode(_authResponse, true));
        expect(decodedAuthResponse).to.have.property("publicKey").not.null;
        expect(decodedAuthResponse).to.have.property("payload").not.null;
    });

    it("should only allow the auth response to be viewed by the partner passport", async function(){
        let partnerDecryptedAuthResponse = await _crypto.decryptMessage(decodedAuthResponse.payload, decodedAuthResponse.publicKey, _partnerPassport.privateKey, _passphrase);
        let userDecryptedAuthResponse = await _crypto.decryptMessage(decodedAuthResponse.payload, decodedAuthResponse.publicKey, _userPassport.privateKey, _passphrase);
        expect(partnerDecryptedAuthResponse).to.be.not.null;
        expect(userDecryptedAuthResponse).to.be.null;
    });
});

describe("Partner verifies the auth response and gets the passport and claim data", function(){
    let res;

    it("should not let the user pass back the request as the response", async function(){
        let error = null;
        try{
            res = await _bridge.Messaging.Auth.verifyPassportChallengeResponse(_userPassport, _passphrase, _authResponse, _randomAuthToken, _requiredClaimTypes, _requiredBlockchainAddresses);
        }
        catch(err){
            error = err.message;
        }

        expect(error).to.equal("Invalid response.  Request and response passports cannot be the same.");
    });

    it("should verify the auth response", async function(){
        res = await _bridge.Messaging.Auth.verifyPassportChallengeResponse(_partnerPassport, _passphrase, _authResponse, _randomAuthToken, _requiredClaimTypes, _requiredBlockchainAddresses);
     });

    it("should verify the token matches what was sent", function(){
        expect(res.tokenVerified).equals(true);
    });

    it("should be able to read the claims. blockchain address and passport data", async function(){
        expect(res).to.have.property("passportId",_userPassport.id);
        expect(res.claims).length == 1;
        expect(res.claims[0]).to.have.property("claimTypeId",3);
        expect(res.claims[0]).to.have.property("claimValue","someuser@bridgeprotocol.io");
        expect(res.claims[0]).to.have.property("createdOn").not.null;
        expect(res.claims[0]).to.have.property("expiresOn").not.null;
        expect(res.claims[0]).to.have.property("isValid").not.null;
        expect(res.claims[0]).to.have.property("isExpired").not.null;
        expect(res.claims[0]).to.have.property("signature").not.null;
        expect(res.claims[0]).to.have.property("signedByKey").not.null;
        expect(res.claims[0]).to.have.property("signedById").not.null;
        expect(res.claims[0]).to.have.property("signatureValid").not.null;
        expect(res.blockchainAddresses).length == 1;
        expect(res.blockchainAddresses[0].network.toLowerCase()).equals("neo");
        expect(res.blockchainAddresses[0]).to.have.property("address").not.null;
    });
});


