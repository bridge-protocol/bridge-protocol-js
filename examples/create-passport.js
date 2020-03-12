const _fs = require('fs');
const _bridge = require("../src/index");

async function Init() {
    const passport = new _bridge.Models.Passport();
    const password = "12345";

    //Create passport
    await passport.create(password);
    console.log(JSON.stringify(passport));

    //Create passport and add a newly generated NEO wallet
    //Optionally provide a WIF as the third parameter to import an existing NEO wallet
    await passport.addWallet("neo", password);
    console.log(JSON.stringify(passport.wallets));

    //Create passport and add a newly generated ETH wallet
    //Optionally provide a PrivateKey as the third parameter to import an existing ETH wallet
    await passport.addWallet("eth", password);
    console.log(JSON.stringify(passport.wallets));

    //Save the passport to a file
    await passport.save('./passport.json');
    console.log("Passport saved");
}

Init();
