const _claim = require('../models/claim').Claim;
const _claimPackage = require('../models/claimPackage').ClaimPackage;

class Claim{
    async createClaimPackagesFromClaims(claims, targetPublicKey, passportPublicKey, passportPrivateKey, password){
        if(!claims || claims.length == 0)
            throw new Error("No claims provided for packaging");

        let claimPackages = [];
        for(let i=0; i<claims.length; i++){
            //Sign the claim as the verifier and package it for the target context passport
            let verifiedClaimPackage = new _claimPackage();
            await verifiedClaimPackage.fromClaim(claims[i], targetPublicKey, passportPublicKey, passportPrivateKey, password);
            //Add the claim package to the collection
            claimPackages.push(verifiedClaimPackage);
        }
        return claimPackages;
    }
}

exports.Claim = new Claim();