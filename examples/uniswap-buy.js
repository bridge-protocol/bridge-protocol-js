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
const _eth = require("../src/utils/ethereum").Ethereum;
const UNISWAP = require('@uniswap/sdk');

async function Init() {
    //Load existing wallet
    let passport = await loadPassport('./passport.json', _password);
    //Unlock the wallet
    let wallet = await getUnlockedWallet(passport, "eth", _password);

    //Construct the trade
    const swap = await _bridge.Services.Blockchain.createUniswapSwap(wallet.address, 103.01512435);
    console.log("Swap info: " + JSON.stringify(swap));

    //Get the estimated cost
    let costs = await _bridge.Services.Blockchain.getUniswapEstimatedCost(wallet, swap);
    console.log("Estimated cost: " + JSON.stringify(costs));

    //Relay the transaction
    let tx = await _bridge.Services.Blockchain.sendUniswapTradeTransaction(wallet, swap, false);
    console.log("Transaction: " + JSON.stringify(tx));
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