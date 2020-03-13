//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: passport-load.js
//- Description: 
//  Demonstrate loading an existing passport from disk and unlocking the 
//  wallets for use with blockchain transactions
//- Prerequisites: passport-create.js
//------------------------------------------------------------------------
const _bridge = require("../src/index");
const _password = "12345";

async function Init() {
    const passport = new _bridge.Models.Passport();

    //Load from file
    await passport.openFile('./passport.json',_password);
    console.log("Loaded from File:");
    console.log(JSON.stringify(passport));

    //Unlock the NEO wallet (required for any signing/tx activity)
    let neoWallet = passport.getWalletForNetwork("neo");
    await neoWallet.unlock(_password);
    console.log("Unlocked NEO wallet: " + JSON.stringify(neoWallet.unlocked));

    //Unlock the ETH wallet (required for any signing/tx activity)
    let ethWallet = passport.getWalletForNetwork("eth");
    await ethWallet.unlock(_password);
    console.log("Unlocked ETH wallet: " + JSON.stringify(ethWallet.unlocked));
}

Init();
