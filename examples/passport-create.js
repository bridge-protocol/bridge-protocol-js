//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: passport-create.js
//- Description: 
//  Demonstrate the creation of a new passport with generated NEO and ETH 
//  wallet addresses
//- Prerequisites: none
//------------------------------------------------------------------------
const _bridge = require("../src/index");
const _password = "12345";

async function Init() {
    const passport = new _bridge.Models.Passport();

    //Create passport
    await passport.create(_password);
    console.log(JSON.stringify(passport));

    //Create passport and add a newly generated NEO wallet
    //Optionally provide a WIF as the third parameter to import an existing NEO wallet
    await passport.addWallet("neo", _password);
    console.log(JSON.stringify(passport.wallets));

    //Create passport and add a newly generated ETH wallet
    //Optionally provide a PrivateKey as the third parameter to import an existing ETH wallet
    await passport.addWallet("eth", _password);
    console.log(JSON.stringify(passport.wallets));

    //Save the passport to a file
    await passport.save('./passport.json');
    console.log("Passport saved");
}

Init();
