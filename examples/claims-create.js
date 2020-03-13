//---------------------Bridge Protocol SDK Example------------------------
// Author: Bridge Protocol Corporation
// File: claims-create.js
// Description: Demonstrate the creation of secure claim packages for 
// transmission via the Bridge Protocol on and off chain.
// Prerequisites: none
//------------------------------------------------------------------------
const _fs = require('fs');
const _bridge = require("../src/index");

async function Init() {
    const userPassport = new _bridge.Models.Passport();
    const verificationPartnerPassport = new _bridge.Models.Passport();
    const password = "12345";

    //Simulate a user passport so we have a public key
    await userPassport.create(password);
    //Our passport we are using to verify and package the claim
    await verificationPartnerPassport.create(password);

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
    let verifiedClaimPackage = new _bridge.Models.ClaimPackage();
    await verifiedClaimPackage.fromClaim(claim, userPassport.publicKey, verificationPartnerPassport.publicKey, verificationPartnerPassport.privateKey, password);

    console.log("Claim Package Created:");
    console.log(JSON.stringify(verifiedClaimPackage));

    //Unpackage the claim package as the user passport
    let decryptedClaim = await verifiedClaimPackage.decrypt(userPassport.privateKey, password);
    console.log("Claim Package Decrypted:");
    console.log(JSON.stringify(decryptedClaim));
}

Init();