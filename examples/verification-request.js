//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: verification-request.js
//- Description: 
//  Demonstrate the creation of a new verification request on the Bridge
//  Markeplace with a partner
//  Verification Requests, Claims, and Token Swaps 
//- Prerequisites: verification-request.js 
//                 NEO wallet with GAS + BRDG
//                 Ethereum wallet with ETH + BRDG
//------------------------------------------------------------------------
const _bridge = require("../src/index");

const _password = "123";

async function Init() {
    //Load existing wallet
    let passport = await loadPassport('./passport.json', _password);

    //Unlock the wallet
    let wallet = await getUnlockedWallet(passport, "eth", _password);
    let wallet2 = passport.getWalletForNetwork("eth");

    let cost = await _bridge.Services.Blockchain.sendApplicationRequest(passport, _password, wallet, "d7bc3488073454a6ce32b13a1e8cda6a8bddf16d", true);
    let application = await _bridge.Services.Blockchain.sendApplicationRequest(passport, _password, wallet, "d7bc3488073454a6ce32b13a1e8cda6a8bddf16d");
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