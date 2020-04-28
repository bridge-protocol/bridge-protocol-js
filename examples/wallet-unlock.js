//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: wallet-unlock.js
//- Description: 
//  Create a wallet for a specific blockchain network
//- Prerequisites: none
//------------------------------------------------------------------------
const _bridge = require("../src/index");
const _password = "12345";
const _network = "eth"; //or "neo"

async function Init() {
    const passport = new _bridge.Models.Passport();
    await passport.create(_password);

    await passport.addWallet(_network, _password);
    console.log(JSON.stringify(passport.wallets));

    let wallet = passport.getWalletForNetwork(_network);
    await wallet.unlock(_password);

    console.log("Address: " + wallet.address);
    console.log("Key: " + wallet.privateKey);
}

Init();