//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: claims-publish.js
//- Description: 
//  Demonstrate publishing a Bridge Network verified claim on the blockchain
//- Prerequisites: claims-import.js 
//                 Verified Claim Type 3 (verified by Bridge)
//                 NEO wallet with GAS + BRDG
//                 Ethereum wallet with ETH + BRDG
//------------------------------------------------------------------------
const _bridge = require("../src/index");

const _password = "12345";

async function Init() {
    //Load existing wallet
    let passport = await loadPassport('./examples/passport.json', _password);

    //Unlock the wallet
    let wallet = await getUnlockedWallet(passport, "bsc", _password);

    //Check and see if the passport is published, this is required to publish claims on the blockchain
    let published = await _bridge.Services.Blockchain.getPassportForAddress(wallet.network, wallet.address);
    let pendingList = await _bridge.Services.Passport.getPendingPassportPublishList(passport, _password);
    let pending = false;
    for(let i=0; i<pendingList.length; i++){
        if(pendingList[i].network.toLowerCase() === wallet.network.toLowerCase())
            pending = true;
    }
    
    if(!published && published.length == 0 && !pending){
        let passportCost = await sendPassportPublishRequest(passport, wallet, true);
        await sendPassportPublishRequest(passport, wallet);
    }

    //Find the cost of the claim publish
    let claimCost = await sendClaimPublishRequest(passport, wallet, false, true);
    await sendClaimPublishRequest(passport, wallet, false, false);
}

async function sendPassportPublishRequest(passport, wallet, costOnly){
    //Publish to the blockchain
    let res = await _bridge.Services.Blockchain.publishPassport(wallet, passport, false, costOnly);

    if(costOnly)
        return res;

    //Let the bridge network know about the publish
    await _bridge.Services.Passport.createPassportPublish(passport, _password, wallet.network, wallet.address);
}

async function sendClaimPublishRequest(passport, wallet, hashOnly, costOnly){
    let claim = await passport.getDecryptedClaim("3", _password);

    try{
        return await _bridge.Services.Blockchain.sendClaimPublishRequest(passport, _password, wallet, claim, hashOnly, costOnly);
    }
    catch(err){
        console.log(err);
    }
    
    return null;
}

async function loadPassport(file, password){
    //Load a passport from disk
    let passport = new _bridge.Models.Passport();
    await passport.openFile(file, password);
    return passport;
}

async function getUnlockedWallet(passport, network, password){
    let wallet = passport.getWalletForNetwork(network);
    await wallet.unlock(password);
    console.log("Address for " + wallet.network + ": " + wallet.address);
    return wallet;
}

Init();