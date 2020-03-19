const _claim = require('../models/claim').Claim;
const _claimPackage = require('../models/claimPackage').ClaimPackage;

class Claim{
    async createClaimPackagesFromClaims(claims, targetPublicKey, passportPublicKey, passportPrivateKey, password){
        if(!claims || claims.length == 0)
            throw new Error("No claims provided for packaging");

        let claimPackages = [];
        for(let i=0; i<claims.length; i++){
            let claim = new _claim(claims[i]);
            //Sign the claim as the verifier and package it for the target context passport
            let verifiedClaimPackage = new _claimPackage();
            await verifiedClaimPackage.fromClaim(claim, targetPublicKey, passportPublicKey, passportPrivateKey, password);
            //Add the claim package to the collection
            claimPackages.push(verifiedClaimPackage);
        }
        return claimPackages;
    }

    async verifyClaimPackagesForImport(passport, password, claimPackages){
        let verifiedClaimPackages = [];

        for(let i=0; i<claimPackages.length; i++){
            try{
                //Use a claim package model
                let claimPackage = new _claimPackage(claimPackages[i].typeId, claimPackages[i].signedBy, claimPackages[i].claim);

                //Unpackage the claim package and verify it
                let claim = await claimPackage.decrypt(passport.privateKey, password);
                claim = new _claim(claim);
                if(claim.isValid && claim.verifySignature(passport.id) != null){
                    console.log(`Claim package type ${claimPackage.typeId} decrypted and valid`);
                    verifiedClaimPackages.push(claimPackage);
                }
                    
            }
            catch(err){
                console.log(`Unable to decrypt claim package: ${err.message}, skipping.`);
            }
        }

        return verifiedClaimPackages;
    }
}

exports.Claim = new Claim();