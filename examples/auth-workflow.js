const _fs = require('fs');
const _bridge = require("../src/index");
const _passphrase = "0123456789";
const _apiBaseUrl = "https://api.bridgeprotocol.io/";

var _userPassport;
var _networkPartnerPassport;
var _verificationPartnerPassport;

var _randomAuthToken;
var _requiredClaimTypes;

async function Init() {
    //Simulate 3 passport types (these would generally be loaded from disk, but for the example we can create on the fly)
    var passportHelper = new _bridge.Passport();
    _userPassport = await passportHelper.createPassport(_passphrase);
    _networkPartnerPassport = await passportHelper.createPassport(_passphrase);
    _verificationPartnerPassport = await passportHelper.createPassport(_passphrase);

    //Verified claims get added to the user passport from a verification partner
    _userPassport.claims = await GetClaimPackagesForPassport(_userPassport);

    //Network partner wants to authenticate and authorize user with their passport
    let authRequest = await GetAuthRequest(_networkPartnerPassport);

    //The user verifies the payload and the auth request and gets details about the request
    let authMessage = await VerifyAuthRequest(_userPassport, authRequest);

    //Optional - if the user wants to know more about the identity of the passport requesting
    //their data, they can ask the Bridge Protocol Network about this passport
    var networkPartnerPassportDetails = await GetPassportDetails(_userPassport, authMessage.passportId);

    //The user generates their response to the auth request
    var response = await GetAuthResponse(_userPassport, authMessage);

    //Validate the response the user sent us
    var authValidationInfo = await VerifyAuthResponse(_networkPartnerPassport, response);
    var tokenVerified = authValidationInfo.tokenVerified; //Whether or not we got back the token we sent 
    var claims = authValidationInfo.claims //The user claims they provided us with the values
    var missingClaimTypes = authValidationInfo.missingClaimTypes //The claims we asked for but the user did not provide
    
    //Optional - once again, if they want to check to see if the user that provided the claims to them
    //Is blacklisted, etc they can call the Bridge Protocol Network for info
    var userPassportDetails = await GetPassportDetails(_networkPartnerPassport, authValidationInfo.passportId);
}

async function VerifyAuthResponse(contextPassport, response)
{
    //Allocate an auth helper to the context passport scope
    let authHelper = new _bridge.Auth(_apiBaseUrl, contextPassport, _passphrase);
    
    //Pass in the auth token we sent and the claim types we asked for along with the response to verify and get detail
    //On what the user provided us and whether or not its valid
    return await authHelper.verifyPassportLoginChallengeResponse(response, _randomAuthToken, _requiredClaimTypes);
}

async function GetAuthResponse(contextPassport, message){
    //Allocate our auth and claim helpers with the context passport scope
    let authHelper = new _bridge.Auth(_apiBaseUrl, contextPassport, _passphrase);
    let claimHelper = new _bridge.Claim(_apiBaseUrl, contextPassport, _passphrase);
    var claims = await claimHelper.decryptClaimPackages(contextPassport.claims);

    //You can use the requestedClaimTypeIds to know what is being requested
    //The user can have options on what they do / do not want to send or notified of what they are missing
    let requestedClaimTypeIds = message.payload.claimTypes;

    //We will just send all of our claims, sign and pass back the token they gave us
    return await authHelper.createPassportLoginChallengeResponse(message.payload.token, claims, message.publicKey);
}

async function GetPassportDetails(contextPassport, passportId){
    //Allocate a passport helper with the passport context
    let passportHelper = new _bridge.Passport(_apiBaseUrl, contextPassport, _passphrase);
    //Get the details from the network about the passport in question
    return await passportHelper.getDetails(passportId);
}

async function VerifyAuthRequest(contextPassport, message){
    //Allocate an auth helper for the context passport scope
    let authHelper = new _bridge.Auth(_apiBaseUrl, contextPassport, _passphrase);
    //Verify and decrypt the auth request and get the details
    return await authHelper.verifyPassportLoginChallengeRequest(message);
}

//Simulate a network partner creating a challenge request to the user for their passport info and optionally claims
async function GetAuthRequest(contextPassport){
    //Allocate an auth helper for our context passport scope
    let authHelper = new _bridge.Auth(_apiBaseUrl, contextPassport, _passphrase);
    //Create a random signing token to send to the user and hang on to it so we can check that they respond with it
    _randomAuthToken = "randomtoken";
    //Request the claim type for verified user e-mail, persist the claims we are asking for so we can verify they sent us the right claims later
    _requiredClaimTypes = [3];

    //Generate and return the resulting request payload
    return await authHelper.createPassportLoginChallengeRequest(_randomAuthToken, _requiredClaimTypes);
}

//Generate claims for the user passport verified by the verification partner passport
async function GetClaimPackagesForPassport(contextPassport) {
    //Allocate our claim helper with the verification partner passport scope
    let claimHelper = new _bridge.Claim(_apiBaseUrl, _verificationPartnerPassport, _passphrase);

    //Verification partner verified the users email
    var claims = [{
        claimTypeId: 3,
        claimValue: "someuser@bridgeprotocol.io",
        createdOn: 1551180491,
        expiresOn: 1553580491
    }];

    //Create signed and encrypted claim packages for the user passport
    return await claimHelper.createClaimPackages(contextPassport.publicKey, claims);
}

Init();