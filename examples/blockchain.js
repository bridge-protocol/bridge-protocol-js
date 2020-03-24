//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: blockchain.js
//- Description: 
//  Demonstrate the blockchain passport publishing, claims publishing and 
//  token transfer functionality on NEO (NEP5) and Ethereum (ERC20) 
//  blockchains
//- Prerequisites: claims-import.js 
//                 Verified Claim Type 3 (verified by Bridge)
//                 NEO wallet with GAS + BRDG
//                 Ethereum wallet with ETH + BRDG
//------------------------------------------------------------------------
const _bridge = require("../src/index");

const _password = "123";

async function Init() {
    let blockchain = "neo"; //Switch to "eth" for Ethereum

    //Load existing wallet
    let passport = await loadPassport('./passport.json', _password);

    //Unlock the wallet
    let wallet = await getUnlockedWallet(passport, blockchain, _password);

    // //Get the balances of the wallet
    let balances = await getBalances(wallet);
    console.log("Balances: " + JSON.stringify(balances));

    // //Publish the address
    await publishPassport(passport, wallet);

    // //Send a payment back to ourselves
    await sendPayment(wallet, 1, wallet.address);

    // //See the transactions
    await getTransactions(wallet);

    // //Publish the claim
    await publishClaim(passport, _password, wallet, "3", false);

    //Unpublish the claim
    await unpublishClaim(wallet, "3");

    // Unpublish the passport
    await unpublishPassport(passport, wallet);
}

async function publishClaim(passport, password, wallet, claimTypeId, hashOnly){
    let claim = await passport.getDecryptedClaim("3", password);
    console.log("Adding claim " + JSON.stringify(claim) + " on " + wallet.network + " for " + wallet.address);

    await _bridge.Services.Blockchain.addClaim(passport, password, wallet, claim, hashOnly);

    await getClaim(wallet.network, wallet.address, claimTypeId);
}

async function unpublishClaim(wallet, claimTypeId){
    console.log("Removing claim " + claimTypeId + " on " + wallet.network + " for " + wallet.address);
    await _bridge.Services.Blockchain.removeClaim(wallet, claimTypeId);
    await getClaim(wallet.network, wallet.address, claimTypeId);
}

async function getClaim(network, address, claimTypeId){
    console.log("Getting claim " + claimTypeId + " on " + network + " for " + address);
    let claim = await _bridge.Services.Blockchain.getClaim(network, claimTypeId, address);
    console.log("Claim: " + JSON.stringify(claim));
}

async function sendPayment(wallet, amount, address){
    let balances = await getBalances(wallet);
    for(let i=0; i<balances.length; i++){
        if(balances[i].asset == "BRDG" && balances[i].balance < amount)
            throw new Error("Insufficient BRDG balance: " + balances[i].balance);
        else if(balances[i].asset == "GAS" && balances[i].balance == 0)
            throw new Error("Insufficient GAS balance: " + balances[i].balance);
    }

    console.log("Sending " + amount + " BRDG to " + address + " on " + wallet.network);
    await _bridge.Services.Blockchain.sendPayment(wallet, amount, address, '12345', true);
    await getBalances(wallet);
}

async function getBalances(wallet){
    let balances = await _bridge.Services.Blockchain.getBalances(wallet.network, wallet.address);
    console.log("Balances for " + wallet.network);
    console.log(JSON.stringify(balances));
    return balances;
}

async function getTransactions(wallet){
    let transactions = await _bridge.Services.Blockchain.getRecentTransactions(wallet.network, wallet.address);
    console.log("Transactions for " + wallet.network);
    console.log(JSON.stringify(transactions));
}

async function publishPassport(passport, wallet){
    console.log("Publishing " + wallet.network + "...");
    await _bridge.Services.Blockchain.publishPassport(wallet, passport);
    let passportPublish = await _bridge.Services.Blockchain.getPassportForAddress(wallet.network, wallet.address);
    let addressPublish = await _bridge.Services.Blockchain.getAddressForPassport(wallet.network, passport.id);
    console.log("Published " + wallet.network + "... Passport:" + passportPublish + " Address:" + addressPublish);
}

async function unpublishPassport(passport, wallet){
    console.log("Unpublishing " + wallet.network + "...");
    await _bridge.Services.Blockchain.unpublishPassport(passport, wallet);
    let passportPublish = await _bridge.Services.Blockchain.getPassportForAddress(wallet.network, wallet.address);
    let addressPublish = await _bridge.Services.Blockchain.getAddressForPassport(wallet.network, passport.id);
    console.log("Unpublished " + wallet.network + "... Passport:" + passportPublish + " Address:" + addressPublish);
}

async function getUnlockedWallet(passport, network, password){
    let wallet = passport.getWalletForNetwork(network);
    await wallet.unlock(password);
    console.log("Address for " + wallet.network + ": " + wallet.address);
    return wallet;
}

async function loadPassport(file, password){
    //Load a passport from disk
    let passport = new _bridge.Models.Passport();
    await passport.openFile(file, password);
    return passport;
}

Init();