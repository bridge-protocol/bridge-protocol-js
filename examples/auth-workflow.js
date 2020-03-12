const _fs = require('fs');
const _bridge = require("../src/index");

const _apiBaseUrl = "https://api.bridgeprotocol.io/";
const _passphrase = "0123456789";
const _userPassport = new _bridge.Models.Passport();
const _networkPartnerPassport = new _bridge.Models.Passport();
const _verificationPartnerPassport = new _bridge.Models.Passport();

var _randomAuthToken;
var _requiredClaimTypes;
var _requiredBlockchainAddresses;

async function Init() {
    //Simulate 3 passport types (these would generally be loaded from disk, but for the example we can create on the fly)
    //Create a user passport with wallets for both chains
    await _userPassport.create(_passphrase);
    await _userPassport.addWallet("neo", _passphrase);
    await _userPassport.addWallet("eth",_passphrase);

    await _networkPartnerPassport.create(_passphrase);
    await _verificationPartnerPassport.create(_passphrase);

    //Verified claims get added to the user passport from a verification partner
    _userPassport.claims = await CreateClaimPackagesForPassport(_userPassport);
    console.log("Passport Claims:");
    console.log(JSON.stringify(_userPassport.claims));

    //Network partner wants to authenticate and authorize user with their passport
    let authRequest = await GetAuthRequest(_networkPartnerPassport);
    console.log("Network Partner Auth Request:");
    console.log(authRequest);

    //The user verifies the payload and the auth request and gets details about the request
    let authMessage = await _bridge.Messaging.Auth.verifyPassportLoginChallengeRequest(authRequest);
    console.log("Decrypted and Verified Auth Request:");
    console.log(JSON.stringify(authMessage));

    //Optional - if the user wants to know more about the identity of the passport requesting
    //their data, they can ask the Bridge Protocol Network about this passport
    var networkPartnerPassportDetails = await _bridge.Services.Passport.getDetails(_userPassport, _passphrase, authMessage.passportId);
    console.log("Network Partner Passport Info:");
    console.log(JSON.stringify(networkPartnerPassportDetails));

    //The user generates their response to the auth request
    var authResponse = await GetAuthResponse(_userPassport, authMessage);
    console.log("User Passport Auth Response:");
    console.log(authResponse);

    //The network partner decrypts and validates the response the user sent
    var authValidationInfo =  await _bridge.Messaging.Auth.verifyPassportLoginChallengeResponse(_networkPartnerPassport, _passphrase, authResponse, _randomAuthToken, _requiredClaimTypes, _requiredBlockchainAddresses);
    console.log("Auth Response Validation Info:");
    console.log(JSON.stringify(authValidationInfo));

    //Optional - once again, if they want to check to see if the user that provided the claims to them
    //Is blacklisted, etc they can call the Bridge Protocol Network for info
    var userPassportDetails = await _bridge.Services.Passport.getDetails(_networkPartnerPassport, _passphrase, authValidationInfo.passportId);
    console.log("User Passport Info:");
    console.log(JSON.stringify(userPassportDetails));
}

async function GetAuthResponse(contextPassport, message){
    //Retrieve the requested claims
    let claims = await contextPassport.getDecryptedClaims(message.payload.claimTypes, _passphrase);

    //Get the requested blockchain addresses
    let addresses = contextPassport.getWalletAddresses(message.payload.networks);

    //Find the claims they asked for and sign and send the response
    //Optionally add networks (neo, eth) to provide blockcahin addresses in the response
    return await _bridge.Messaging.Auth.createPassportLoginChallengeResponse(contextPassport, _passphrase, message.publicKey, message.payload.token, claims, addresses); 
}

//Simulate a network partner creating a challenge request to the user for their passport info and optionally claims
async function GetAuthRequest(contextPassport){
    //Create a random signing token to send to the user and hang on to it so we can check that they respond with it
    _randomAuthToken = "randomtoken";
    //Request the claim type for verified user e-mail, persist the claims we are asking for so we can verify they sent us the right claims later
    _requiredClaimTypes = [3];
    //Request blockchain addresses be provided
    _requiredBlockchainAddresses = ["neo","eth"];
    
    //Generate and return the resulting request payload
    return await _bridge.Messaging.Auth.createPassportLoginChallengeRequest(contextPassport, _passphrase, _randomAuthToken, _requiredClaimTypes, _requiredBlockchainAddresses);
}

//Generate claims for the user passport verified by the verification partner passport
async function CreateClaimPackagesForPassport(contextPassport) {    
    let claims = [];

    //Create a claim 
    let claim = new _bridge.Models.Claim({
        claimTypeId: 3,
        claimValue: "someuser@bridgeprotocol.io",
        createdOn: 1551180491,
        expiresOn: 0, //Never expires
        signedByKey: _verificationPartnerPassport.publicKey
    });
    claims.push(claim);

    //Package the claims to signed claim packages
    return await _bridge.Utils.Claim.createClaimPackagesFromClaims(claims, _userPassport.publicKey, _verificationPartnerPassport.publicKey, _verificationPartnerPassport.privateKey, _passphrase);
}

Init();