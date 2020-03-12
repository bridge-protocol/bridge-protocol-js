const _fs = require('fs');
const _bridge = require("../src/index");

async function Init() {
    const passport = new _bridge.Models.Passport();
    const password = "12345";

    //Load from file
    await passport.openFile('./passport.json',password);
    console.log("Loaded from File:");
    console.log(JSON.stringify(passport));

    //Unlock the NEO wallet (required for any signing/tx activity)
    let neoWallet = passport.getWalletForNetwork("neo");
    await neoWallet.unlock(password);
    console.log("Unlocked NEO wallet: " + JSON.stringify(neoWallet));

    //Unlock the ETH wallet (required for any signing/tx activity)
    let ethWallet = passport.getWalletForNetwork("eth");
    await ethWallet.unlock(password);
    console.log("Unlocked ETH wallet: " + JSON.stringify(ethWallet));
}

Init();
