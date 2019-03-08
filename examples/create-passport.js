const _fs = require('fs');
const _bridge = require("../src/index");

async function Init() {
    let passportHelper = new _bridge.Passport();

    //Create passport and generate NEO wallet
    let passport = await passportHelper.createPassport("12345");
    console.log(JSON.stringify(passport));

    //Create passport and use existing NEO wallet (WIF)
    passport = await passportHelper.createPassport("12345","KyHPUiRAs9UnTUQMSiLRhLCAT31dDNyd4y9FchWJZK7w7gDL1iRf");
    console.log(JSON.stringify(passport));

    passportHelper.savePassportToFile(passport, './passport.json');
    console.log("Passport saved");
}

Init();
