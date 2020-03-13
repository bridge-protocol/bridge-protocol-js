//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: payment.js
//- Description: 
//  Demonstrate the payment request and response workflow between a 
//  Bridge Network Partner and a Bridge Passport user
//- Prerequisites: claims-import.js
//------------------------------------------------------------------------
const _fs = require('fs');
const _bridge = require("../src/index");

const _passphrase = "0123456789";
const _neoPrivateKey = ""; //Need to have a NEO wallet Private Key with some BRDG + GAS
const _ethPrivateKey = ""; //Need to have an ETH wallet Private Key with some BRDG + GAS

async function Init() {
    //Create a user passport with wallets for both chains, we will use this passport for both the request and response
    //So we can just test transactions and move the tokens back to ourselves
    const passport = new _bridge.Models.Passport();
    await passport.create(_passphrase);
    await passport.addWallet("neo",_passphrase, _neoPrivateKey);
    await passport.addWallet("eth",_passphrase, _ethPrivateKey);

    //Do a NEO NEP5 BRDG payment request / response
    await neoPayment(passport);

    //Do an ETH ERC20 BRDG payment request / response
    await ethPayment(passport);
}

async function neoPayment(passport){
    let paymentRequest = await getPaymentRequest(passport, "neo", 1);
    console.log("NEO Payment Request:")
    console.log(JSON.stringify(paymentRequest));

    let paymentResponse = verifyRequestAndGetResponse(passport, paymentRequest);

    let verifiedPaymentResponse = await _bridge.Messaging.Payment.verifyPaymentResponse(paymentResponse);
    console.log("Verified NEO Payment Response:")
    console.log(JSON.stringify(verifiedPaymentResponse));
}

async function ethPayment(passport){
    let paymentRequest = await getPaymentRequest(passport, "eth", 1);
    console.log("ETH Payment Request:")
    console.log(JSON.stringify(paymentRequest));

    let paymentResponse = verifyRequestAndGetResponse(passport, paymentRequest);

    let verifiedPaymentResponse = await _bridge.Messaging.Payment.verifyPaymentResponse(paymentResponse);
    console.log("Verified MEO Payment Response:")
    console.log(JSON.stringify(verifiedPaymentResponse));
}

async function verifyRequestAndGetResponse(passport, paymentRequest){
    //User receives payment request
    let verifiedPaymentRequest = _bridge.Messaging.Payment.verifyPaymentRequest(paymentRequest);
    console.log("Verified Payment Request:")
    console.log(JSON.stringify(paymentRequest));
    
    //Optional - if the user wants to know more about the identity of the passport requesting
    //their data, they can ask the Bridge Protocol Network about this passport
    var requestingPassportDetails = await _bridge.Services.Passport.getDetails(passport, _passphrase, verifiedPaymentRequest.passportId);
    console.log("Requesting Passport Info:");
    console.log(JSON.stringify(requestingPassportDetails));
    
    //Send the payment and get the response to send back to the requester
    let paymentResponse = await getPaymentResponse(verifiedPaymentRequest, paymentRequest.publicKey);
    console.log("Payment Response:")
    console.log(JSON.stringify(paymentResponse));

    return paymentResponse;
}

async function getPaymentRequest(passport, network, amount){
    //Get the wallets
    let wallet = passport.getWalletForNetwork(network);
    if(!wallet)
        throw new Error(`"Could not get wallet for ${network}`);

    //Network partner sends a payment request of 1 BRDG on NEO, we are using the same wallet to just circulate the tokens to the same address
    //Payment identifier is used to verify the payment asynchronously with the real-world requesting system
    return await _bridge.Messaging.Payment.createPaymentRequest(wallet.network, amount, wallet.address, "RealWorldTransactionId12345");
}

async function getPaymentResponse(passport, paymentRequest, targetPublicKey){
    //Get the wallet to be used
    let wallet = passport.getWalletForNetwork(paymentRequest.network);

    //User creates a NEO payment and sends it
    let transactionId = await _bridge.Services.Blockchain.sendBrdg(wallet, paymentRequest.address, paymentRequest.amount, paymentRequest.identifier);
    if(!transactionId)
        throw new Error("Transaction failed.");

    //User responds to the payment request
    return await _bridge.Messaging.Payment.createPaymentResponse(passport, _passphrase, paymentRequest.network, paymentRequest.amount, paymentRequest.address, paymentRequest.identifier, transactionId, targetPublicKey);
}

Init();