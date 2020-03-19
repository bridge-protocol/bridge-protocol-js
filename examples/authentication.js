//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: authentication.js
//- Description: 
//  Demonstrate the authentication challenge and response 
//  workflow between a Bridge Network Partner and a Bridge Passport user
//- Prerequisites: claims-import.js
//------------------------------------------------------------------------
const _bridge = require("../src/index");

const _password = "12345";
const _userPassport = new _bridge.Models.Passport();
const _networkPartnerPassport = new _bridge.Models.Passport();

var _randomAuthToken;
async function Init() {
    //Open the user passport
    await _userPassport.openFile('./passport.json',_password);
    //Create a network partner passport
    await _networkPartnerPassport.create(_password);

    //Network partner wants to authenticate and authorize user with their passport
    let authRequest = await GetAuthRequest(_networkPartnerPassport);
    console.log("Network Partner Auth Request:");
    console.log(authRequest);

    //The user verifies the payload and the auth request and gets details about the request
    let authMessage = await _bridge.Messaging.Auth.verifyPassportChallengeRequest(authRequest);
    console.log("Decrypted and Verified Auth Request:");
    console.log(JSON.stringify(authMessage));

    //Optional - if the user wants to know more about the identity of the passport requesting
    //their data, they can ask the Bridge Protocol Network about this passport
    var networkPartnerPassportDetails = await _bridge.Services.Passport.getDetails(_userPassport, _password, authMessage.passportId);
    console.log("Network Partner Passport Info:");
    console.log(JSON.stringify(networkPartnerPassportDetails));

    //The user generates their response to the auth request
    var authResponse = await GetAuthResponse(_userPassport, authMessage);
    console.log("User Passport Auth Response:");
    console.log(authResponse);

    //The network partner decrypts and validates the response the user sent
    var authValidationInfo =  await _bridge.Messaging.Auth.verifyPassportChallengeResponse(_networkPartnerPassport, _password, authResponse, _randomAuthToken);
    console.log("Auth Response Validation Info:");
    console.log(JSON.stringify(authValidationInfo));

    //Optional - once again, if they want to check to see if the user that provided the claims to them
    //Is blacklisted, etc they can call the Bridge Protocol Network for info
    var userPassportDetails = await _bridge.Services.Passport.getDetails(_networkPartnerPassport, _password, authValidationInfo.authResponse.passportId);
    console.log("User Passport Info:");
    console.log(JSON.stringify(userPassportDetails));
}

async function GetAuthResponse(contextPassport, message){
    //Retrieve the requested claims
    let claims = await contextPassport.getDecryptedClaims(message.payload.claimTypes, _password);

    //Get the requested blockchain addresses
    let addresses = contextPassport.getWalletAddresses(message.payload.networks);

    //Find the claims they asked for and sign and send the response
    //Optionally add networks (neo, eth) to provide blockcahin addresses in the response
    return await _bridge.Messaging.Auth.createPassportChallengeResponse(contextPassport, _password, message.publicKey, message.payload.token, claims, addresses); 
}

//Simulate a network partner creating a challenge request to the user for their passport info and optionally claims
async function GetAuthRequest(contextPassport){
    //Create a random signing token to send to the user and hang on to it so we can check that they respond with it
    _randomAuthToken = "randomtoken";
    //Request the claim type for verified user e-mail, persist the claims we are asking for so we can verify they sent us the right claims later
    let requiredClaimTypes = [3];
    //Request blockchain addresses be provided
    let requiredBlockchainAddresses = ["neo","eth"];
    
    //Generate and return the resulting request payload
    return await _bridge.Messaging.Auth.createPassportChallengeRequest(contextPassport, _password, _randomAuthToken, requiredClaimTypes, requiredBlockchainAddresses);
}

Init();