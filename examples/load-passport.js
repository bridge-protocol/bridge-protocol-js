const _fs = require('fs');
const _bridge = require("../src/index");

async function Init() {
    let passportHelper = new _bridge.Passport();

    //Load from file
    let passportFromFile = await passportHelper.loadPassportFromFile('./passport.json',"12345");
    console.log("Loaded from File:");
    console.log(JSON.stringify(passportFromFile));

    //Load from string
    let buffer = _fs.readFileSync('./passport.json');
    let content = buffer.toString();
    let passportFromContent = await passportHelper.loadPassportFromContent(content, "12345");
    console.log("Loaded from Content:");
    console.log(JSON.stringify(passportFromContent));
}

Init();
