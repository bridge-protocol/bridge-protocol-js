//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: services.js
//- Description: 
//  Demonstrate the use of Bridge Network API's to interact with
//  Verification Requests, Claims, and Token Swaps 
//- Prerequisites: claims-import.js 
//                 Verified Claim Type 3 (verified by Bridge)
//                 NEO wallet with GAS + BRDG
//                 Ethereum wallet with ETH + BRDG
//------------------------------------------------------------------------
const _bridge = require("../src/index");

const _password = "123";

async function Init() {
    //Load existing wallet
    let passport = await loadPassport('./test-passport.json', _password);

    //Unlock the wallet
    let wallet = await getUnlockedWallet(passport, "neo", _password);
    let wallet2 = passport.getWalletForNetwork("eth");

    await applicationServices(passport, wallet);
    //await claimPublishServices(passport, wallet);
    //await tokenSwapServices(passport, wallet, wallet2.address, 1);
}

async function tokenSwapServices(passport, wallet, receivingAddress, amount){
    let swapList = await _bridge.Services.TokenSwap.getTokenSwapList(passport, _password);
    let pendingSwaps = await _bridge.Services.TokenSwap.getPendingTokenSwapList(passport, _password);

    let tokenSwap = await _bridge.Services.TokenSwap.createTokenSwap(passport, _password, wallet.network, wallet.address, receivingAddress, amount);

    let transactionId = "BRDG12345";

    //Send the gas transaction to prepay the transfer fee (neo -> eth only)
    let gasTransactionId = null;
    if(wallet.network.toLowerCase() === "neo")
        gasTransactionId = "GAS12345";

    tokenSwap = await _bridge.Services.TokenSwap.updatePaymentTransaction(passport, _password, tokenSwap.id, transactionId, gasTransactionId);

    //Get the details
    tokenSwap = await _bridge.Services.TokenSwap.getTokenSwap(passport, _password, tokenSwap.id);

    //Retry if pending retry for token stats
    await _bridge.Services.TokenSwap.retry(passport, _password, tokenSwap.id);
}

async function claimPublishServices(passport, wallet){
    //Get existing and pending claim publishes
    let allClaimPublish = await _bridge.Services.Claim.getClaimPublishList(passport, _password);
    let pendingClaimPublish = await _bridge.Services.Claim.getPendingClaimPublishList(passport, _password);

    //Create
    let claim = await passport.getDecryptedClaim("3", _password);

    let claimPublish;
    try{
        claimPublish = await _bridge.Services.Claim.createClaimPublish(passport, _password, wallet.network, wallet.address, claim);
    }
    catch(err){
        console.log(err)
    }
 
    //Send the network fee BRDG transaction using blockchain
    let transactionId = "BRDG12345";

    //Send the GAS publish fee transaction using blockchain (ethereum only)
    let gasTransactionId = null;
    if(wallet.network.toLowerCase() === "eth")
        gasTransactionId = "GAS12345";

    //Update the transaction info
    claimPublish = await _bridge.Services.Claim.updateClaimPaymentTransaction(passport, _password, claimPublish.id, transactionId, gasTransactionId);

    //Get the processing status and details
    claimPublish = await _bridge.Services.Claim.getClaimPublish(passport, _password, claimPublish.id);

    //Retry if in pending processing state
    await _bridge.Services.Claim.retry(passport, _password, claimPublish.id);

    //NEO only
    let transaction = await _bridge.Services.Claim.getClaimPublishTransaction(passport, _password, claimPublish.id);
}

async function applicationServices(passport, wallet){
    //Get all applications for the passport
    let applications = await _bridge.Services.Application.getApplicationList(passport, _password);

    //Create an application
    let application = await _bridge.Services.Application.createApplication(passport, _password, "d7bc3488073454a6ce32b13a1e8cda6a8bddf16d", wallet.network, wallet.address);

    //Send the network fee BRDG transaction using blockchain
    let transactionId = "BRDG12345";

    //Update the application payment
    application = await _bridge.Services.Application.updatePaymentTransaction(passport, _password, application.id, transactionId);

    //Check the status of processing
    application = await _bridge.Services.Application.getApplication(passport, _password, application.id);

    //Retry processing if it's waiting for a retry
    await _bridge.Services.Application.retry(passport, _password, application.id);
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