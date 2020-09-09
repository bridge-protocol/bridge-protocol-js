//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: uniswap-buy.js
//- Description: 
//  Demonstrates buying BRDG via uniswap using the SDK
//- Prerequisites: passport-create.js 
//                 Ethereum wallet with ETH 
//------------------------------------------------------------------------
const _bridge = require("../src/index");
const _password = "12345";

async function Init() {
    //Load existing wallet
    let passport = await loadPassport('./passport.json', _password);
    //Unlock the wallet
    let wallet = await getUnlockedWallet(passport, "eth", _password);

    const info = await _bridge.Services.Blockchain.getUniswapInfo();
    console.log(info.route.midPrice.toSignificant(6));
    console.log(info.route.midPrice.invert().toSignificant(6));

    const trade = await _bridge.Services.Blockchain.getUniswapTrade(wallet.address, 1, info.route, 20);
    console.log(JSON.stringify(trade));
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