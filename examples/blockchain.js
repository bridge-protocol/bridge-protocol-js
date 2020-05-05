//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: blockchain.js
//- Description: 
//  Demonstrate the blockchain passport publishing, claims publishing and 
//  token transfer functionality on NEO (NEP5) and Ethereum (ERC20) 
//  blockchains
//- Prerequisites: claims-import.js 
//                 Verified Claim Type 3 (verified by Bridge)
//                 NEO wallet with GAS + BRDG
//                 Ethereum wallet with ETH + BRDG
//------------------------------------------------------------------------
const _bridge = require("../src/index");

const _password = "123";

async function Init() {
    let blockchain = "eth"; //Switch to "neo" for NEO

    //Load existing wallet
    let passport = await loadPassport('./passport.json', _password);

    //Unlock the wallet
    let wallet = await getUnlockedWallet(passport, "eth", _password);
    
    //Get the balances of the wallet
    let balances = await getBalances(wallet);
    console.log("Balances: " + JSON.stringify(balances));

    //Transfer gas to ourselves
    await transferGas(wallet, .0001);

    // Publish the address
    await publishPassport(passport, wallet);

    //Send a payment back to ourselves
    await sendPayment(wallet, 1.2522, wallet.address);

    // See the transactions
    await getTransactions(wallet);

    // Publish the claim
    await publishClaim(passport, _password, wallet, "3", false);

    // Unpublish the claim
    await unpublishClaim(wallet, "3");

    // Unpublish the passport
    await unpublishPassport(passport, wallet);

    //Send a token swap request to NEO
    //let neoWallet = await getUnlockedWallet(passport, "neo", _password);
    //let ethWallet = await getUnlockedWallet(passport, "eth", _password);
    //await sendSwapRequest(neoWallet, ethWallet, 1, false);
}

async function sendSwapRequest(walletFrom, walletTo, amount, costOnly){

    let cost = await _bridge.Services.Blockchain.sendSwapRequest(walletFrom, walletTo, amount, true);
    console.log("Cost: " + cost + " GAS/ETH");

    if(costOnly){
        return;
    }

    let balances;
    if(walletFrom.network.toLowerCase() === "neo"){
        balances = await getWalletBalances(walletTo); //We've got to take the GAS from the ETH wallet
    }
    else 
        balances = await getWalletBalances(walletFrom);

    if(balances.gas < cost){
        console.log("Insufficient GAS/ETH: " + balances.gas + " Cost: " + cost);
        return;
    }

    let res = await _bridge.Services.Blockchain.sendSwapRequest(walletFrom, walletTo, amount, false);
    console.log(JSON.stringify(res));
}

async function transferGas(wallet, amount, costOnly)
{
    if(wallet.network.toLowerCase() === "neo")  
        return; //Not implemented, no need without GAS costs in 2.0

    //Get the cost
    let cost = await _bridge.Services.Blockchain.transferGas(wallet, amount, wallet.address, "13a23d41-c89a-40e3-9736-a78d99d005b7", true, true);
    console.log("Cost: " + cost + " GAS/ETH");

    if(costOnly){
        return;
    }

    console.log("Transferring " + amount + " GAS/ETH");
    await _bridge.Services.Blockchain.transferGas(wallet, amount, wallet.address, "13a23d41-c89a-40e3-9736-a78d99d005b7", true);
}

async function publishClaim(passport, password, wallet, claimTypeId, hashOnly, costOnly){
    let claim = await passport.getDecryptedClaim("3", password);
    console.log("Adding claim type " + claimTypeId + " on " + wallet.network + " for " + wallet.address);

    //Get the cost
    let cost = await _bridge.Services.Blockchain.addClaim(passport, password, wallet, claim, hashOnly, true);
    console.log("Cost: " + cost + " GAS/ETH");

    if(costOnly){
        return;
    }
    else{
        let balances = await getWalletBalances(wallet);
        if(balances.gas < cost){
            console.log("Insufficient GAS/ETH: " + balances.gas + " Cost: " + cost);
            return;
        }

        await _bridge.Services.Blockchain.addClaim(passport, password, wallet, claim, hashOnly);
        await getClaim(wallet.network, wallet.address, claimTypeId);
    }
}

async function unpublishClaim(wallet, claimTypeId, costOnly){
    console.log("Removing claim " + claimTypeId + " on " + wallet.network + " for " + wallet.address);

    //Get the cost
    let cost = await _bridge.Services.Blockchain.removeClaim(wallet, claimTypeId, true);
    console.log("Cost: " + cost + " GAS/ETH");

    if(costOnly){
        return;
    }
    else{
        let balances = await getWalletBalances(wallet);
        if(balances.gas < cost){
            console.log("Insufficient GAS/ETH: " + balances.gas + " Cost: " + cost);
            return;
        }

        await _bridge.Services.Blockchain.removeClaim(wallet, claimTypeId);
        await getClaim(wallet.network, wallet.address, claimTypeId);
    }
}

async function getClaim(network, address, claimTypeId){
    console.log("Getting claim " + claimTypeId + " on " + network + " for " + address);
    let claim = await _bridge.Services.Blockchain.getClaim(network, claimTypeId, address);
    console.log("Claim: " + JSON.stringify(claim));
}

async function sendPayment(wallet, amount, address, costOnly){
    console.log("Sending " + amount + " BRDG to " + address + " on " + wallet.network);
    
    let cost = await _bridge.Services.Blockchain.sendPayment(wallet, amount, address, '13a23d41-c89a-40e3-9736-a78d99d005b7', true, true);
    console.log("Cost: " + cost + " GAS/ETH");

    if(costOnly){
        return;
    }
    else{
        let balances = await getWalletBalances(wallet);
        if(balances.gas < cost){
            console.log("Insufficient GAS/ETH: " + balances.gas + " Cost: " + cost);
            return;
        }

        console.log("Sending payment");
        let res = await _bridge.Services.Blockchain.sendPayment(wallet, amount, address, '13a23d41-c89a-40e3-9736-a78d99d005b7', true);
        await getBalances(wallet);
    }
}

async function getBalances(wallet){
    let balances = await _bridge.Services.Blockchain.getBalances(wallet.network, wallet.address);
    console.log("Balances for " + wallet.network);
    console.log(JSON.stringify(balances));
    return balances;
}

async function getTransactions(wallet){
    let transactions = await _bridge.Services.Blockchain.getRecentTransactions(wallet.network, wallet.address);
    console.log("Transactions for " + wallet.network);
    console.log(JSON.stringify(transactions));
}

async function publishPassport(passport, wallet, costOnly){
    console.log("Publishing Passport on " + wallet.network + "...");

    let cost = await _bridge.Services.Blockchain.publishPassport(wallet, passport, true);
    console.log("Cost: " + cost + " GAS/ETH");

    if(costOnly){
        return;
    }
    else{
        let balances = await getWalletBalances(wallet);
        if(balances.gas < cost){
            console.log("Insufficient GAS/ETH: " + balances.gas + " Cost: " + cost);
            return;
        }

        await _bridge.Services.Blockchain.publishPassport(wallet, passport);
        let passportPublish = await _bridge.Services.Blockchain.getPassportForAddress(wallet.network, wallet.address);
        let addressPublish = await _bridge.Services.Blockchain.getAddressForPassport(wallet.network, passport.id);
        console.log("Published " + wallet.network + "... Passport:" + passportPublish + " Address:" + addressPublish);
    }
}

async function unpublishPassport(passport, wallet, costOnly){
    console.log("Unpublishing Passport on " + wallet.network + "...");

    let cost = await _bridge.Services.Blockchain.unpublishPassport(passport, wallet, true);
    console.log("Cost: " + cost + " GAS/ETH");

    if(costOnly){
        return;
    }
    else{
        let balances = await getWalletBalances(wallet);
        if(balances.gas < cost){
            console.log("Insufficient GAS: " + balances.gas + " Cost: " + cost);
            return;
        }

        await _bridge.Services.Blockchain.unpublishPassport(passport, wallet);
        let passportPublish = await _bridge.Services.Blockchain.getPassportForAddress(wallet.network, wallet.address);
        let addressPublish = await _bridge.Services.Blockchain.getAddressForPassport(wallet.network, passport.id);
        console.log("Unpublished " + wallet.network + "... Passport:" + passportPublish + " Address:" + addressPublish);
    }
}

async function getUnlockedWallet(passport, network, password){
    let wallet = passport.getWalletForNetwork(network);
    await wallet.unlock(password);
    console.log("Address for " + wallet.network + ": " + wallet.address);
    return wallet;
}

async function loadPassport(file, password){
    //Load a passport from disk
    let passport = new _bridge.Models.Passport();
    await passport.openFile(file, password);
    return passport;
}

async function getWalletBalances(wallet){
    let res = { brdg: 0, gas: 0 };
    let balances = await getBalances(wallet);
    for(let i=0; i<balances.length; i++){
        if(balances[i].asset == "BRDG")
            res.brdg = balances[i].balance;
        if(balances[i].asset == "ETH" || balances[i].asset == "GAS")
            res.gas = balances[i].balance;
    }
    return res;
}   

Init();