//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: token-swap.js
//- Description: 
//  Demonstrates creating a tokens swap on the Bridge Network
//- Prerequisites: passport-create.js 
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
    let receivingWallet = await getUnlockedWallet(passport, "eth", _password);

    //let cost = await sendTokenSwapRequest(passport, wallet, receivingWallet, 5, true);
    let swap = await sendTokenSwapRequest(passport, wallet, receivingWallet, 1);
}

async function sendTokenSwapRequest(passport, wallet, receivingWallet, amount, costOnly){
    try{
        return await _bridge.Services.Blockchain.sendTokenSwapRequest(passport, _password, wallet, receivingWallet, amount, costOnly);
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