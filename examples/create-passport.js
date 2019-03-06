const _fs = require('fs');
const _bridge = require("../src/index");

async function Init() {
    let passportHelper = new _bridge.Passport();
    let passport = await passportHelper.createPassport("12345");
    console.log(JSON.stringify(passport));

    passportHelper.savePassportToFile(passport, './passport.json');
    console.log("Passport saved");
}

Init();
