const _fs = require('fs');
const _bridge = require("../src/index");
const _passphrase = "0123456789";
const _apiBaseUrl = "https://api.bridgeprotocol.io";

async function Init() {
    var passportHelper = new _bridge.Passport();

    //Simulate a user passport so we have a public key
    let userPassport = await passportHelper.createPassport(_passphrase);

    //Our passport we are using to verify and package the claim
    let verificationPartnerPassport = await passportHelper.createPassport(_passphrase);
    let verificationClaimHelper = new _bridge.Claim(_apiBaseUrl, verificationPartnerPassport, _passphrase);

    //Verified email address claim
    var claims = [];
    claims.push({
        claimTypeId: 3,
        claimValue: "someuser@bridgeprotocol.io",
        createdOn: 1551180491,
        expiresOn: 1553580491
    });

    let verifiedClaimPackages = await verificationClaimHelper.createClaimPackages(userPassport.publicKey, claims);
    console.log("Claim Package(s) Created:");
    console.log(JSON.stringify(verifiedClaimPackages));
}

Init();