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

const _password = "123";
const _neoPrivateKey = ""; //Need to have a NEO wallet Private Key with some BRDG + GAS
const _ethPrivateKey = ""; //Need to have an ETH wallet Private Key with some BRDG + GAS

async function Init() {
    //Create a user passport with wallets for both chains, we will use this passport for both the request and response
    //So we can just test transactions and move the tokens back to ourselves
    const passport = new _bridge.Models.Passport();
    await passport.create(_password);

    //Import the wallets from existing wallets so we have BRDG and GAS
    await passport.addWallet("neo",_password, _neoPrivateKey);
    await passport.addWallet("eth",_password, _ethPrivateKey);

    let network = "ETH";  //Change to use NEO or ETH
    let paymentRequest = await getPaymentRequest(passport, network, 1);
    console.log(`Payment Request on ${network}:`)
    console.log(JSON.stringify(paymentRequest));

    //User receives payment request
    let verifiedPaymentRequest = await _bridge.Messaging.Payment.verifyPaymentRequest(paymentRequest);
    console.log("Verified Payment Request:")
    console.log(JSON.stringify(paymentRequest));
    
    //Optional - if the user wants to know more about the identity of the passport requesting
    //their data, they can ask the Bridge Protocol Network about this passport
    var requestingPassportDetails = await _bridge.Services.Passport.getDetails(passport, _password, verifiedPaymentRequest.passportId);
    console.log("Requesting Passport Info:");
    console.log(JSON.stringify(requestingPassportDetails));
    
    //Send the payment and get the response to send back to the requester
    let paymentResponse = await getPaymentResponse(passport, verifiedPaymentRequest.payload, verifiedPaymentRequest.publicKey);
    console.log("Payment Response:")
    console.log(JSON.stringify(paymentResponse));

    //Verify the response from the user
    let verifiedPaymentResponse = await _bridge.Messaging.Payment.verifyPaymentResponse(passport, _password, paymentResponse);
    console.log(`Verified ${network} Payment Response:`);
    console.log(JSON.stringify(verifiedPaymentResponse));

    //Poll and wait to see if the transaction is complete / valid
    pollVerifyPayment(verifiedPaymentResponse.paymentResponse, function(success){
        console.log(`Transaction ${verifiedPaymentResponse.paymentResponse.transactionId} complete.  Success: ${success}`);
    });
}

async function pollVerifyPayment(verifiedPaymentResponse){
    return new Promise(function (resolve, reject) {
        (async function waitForComplete(){
            let res = await _bridge.Services.Blockchain.verifyPayment(verifiedPaymentResponse.network, verifiedPaymentResponse.transactionId, verifiedPaymentResponse.from, verifiedPaymentResponse.address, verifiedPaymentResponse.amount, verifiedPaymentResponse.identifier);
            if(res.complete){
                console.log("Transaction found and complete");
                return resolve(res.success);
            }
            
            console.log("Transaction not complete. Waiting and retrying.");
            setTimeout(waitForComplete, 5000);
        })();
    });
}

async function getPaymentRequest(passport, network, amount){
    //Get the wallets
    let wallet = passport.getWalletForNetwork(network);
    if(!wallet)
        throw new Error(`"Could not get wallet for ${network}`);

    //Network partner sends a payment request of 1 BRDG on NEO, we are using the same wallet to just circulate the tokens to the same address
    //Payment identifier is used to verify the payment asynchronously with the real-world requesting system
    return await _bridge.Messaging.Payment.createPaymentRequest(passport, _password, wallet.network, amount, wallet.address, "RealWorldTransactionId12345");
}

async function getPaymentResponse(passport, paymentRequest, targetPublicKey){
    //Get the wallet to be used
    let wallet = passport.getWalletForNetwork(paymentRequest.network);

    //Unlock the wallet
    await wallet.unlock(_password);

    //User creates a NEO payment and sends it
    let transactionId = await _bridge.Services.Blockchain.sendPayment(wallet, paymentRequest.amount, paymentRequest.address, paymentRequest.identifier, false);
    if(!transactionId)
        throw new Error("Transaction failed.");

    //User responds to the payment request
    return await _bridge.Messaging.Payment.createPaymentResponse(passport, _password, paymentRequest.network, wallet.address, paymentRequest.amount, paymentRequest.address, paymentRequest.identifier, transactionId, targetPublicKey);
}

Init();