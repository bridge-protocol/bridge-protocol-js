//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: claims-import.js
//- Description: 
//  Demonstrate the workflow between a Bridge Marketplace verification 
//  provider issuing and Bridge Passport user to importing secure claim 
//  packages for transmission via the Bridge Protocol on and off chain.
//- Prerequisites: passport-create.js
//------------------------------------------------------------------------
const _bridge = require("../src/index");
const _password = "12345";

async function Init() {
    const userPassport = new _bridge.Models.Passport();
    const verificationPartnerPassport = new _bridge.Models.Passport();

    //Simulate a user passport so we have a public key
    await userPassport.openFile('./passport.json', _password);
    //Our passport we are using to verify and package the claim
    await verificationPartnerPassport.create(_password);

    //Show the initial claims collection of the user passport
    console.log("Passport Claim Packages:");
    console.log(JSON.stringify(userPassport.claims));

    //Create verified email address claim
    let claim = new _bridge.Models.Claim({
        claimTypeId: 3,
        claimValue: "someuser@bridgeprotocol.io",
        createdOn: 1551180491,
        expiresOn: 0, //Never expires
        signedByKey: verificationPartnerPassport.publicKey
    });
    console.log("Claim Created:");
    console.log(JSON.stringify(claim));

    //Sign the claim as the verifier and package it for the target user passport
    let claimPackage = new _bridge.Models.ClaimPackage();
    await claimPackage.fromClaim(claim, userPassport.publicKey, verificationPartnerPassport.publicKey, verificationPartnerPassport.privateKey, _password);
    console.log("Claim Package Created:");
    console.log(JSON.stringify(claimPackage));

    //Add to our collection of claim packages to be requested for import
    let claimPackages = [];
    claimPackages.push(claimPackage);

    //Create the import request
    let claimsImportRequest = await _bridge.Messaging.Claim.createClaimsImportRequest(verificationPartnerPassport, _password, claimPackages);
    console.log("Claim Import Request:");
    console.log(claimsImportRequest);

    //User receives the import request and verifies it
    let verifiedImportRequest = await _bridge.Messaging.Claim.verifyClaimsImportRequest(claimsImportRequest);
    console.log("Verified Import Request:");
    console.log(JSON.stringify(verifiedImportRequest));

    let verifiedClaimPackages = await _bridge.Utils.Claim.verifyClaimPackagesForImport(userPassport, _password, verifiedImportRequest.payload.claimsImportRequest.claimPackages);
    console.log("Verified Claim Packages");
    console.log(JSON.stringify(verifiedClaimPackages));

    //Add the claims to the passport, usually the user would approve these for import, etc.
    userPassport.claims = userPassport.claims.concat(verifiedClaimPackages);
    console.log("Passport Claim Packages:");
    console.log(JSON.stringify(userPassport.claims));

    //Save the passport with the added claims to disk
    await userPassport.save('./passport.json');
}

Init();