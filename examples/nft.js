//---------------------Bridge Protocol SDK Example------------------------
//- Author: Bridge Protocol Corporation
//- File: nft.js
//- Description: 
//  Demonstrate storing, viewing the details of, and transferring a NFT 
//  on Ethereum from a Bridge Passport.
//- Prerequisites: passport-create.js
//------------------------------------------------------------------------
const _bridge = require("../src/index");
const _password = "12345";

async function Init() {
    let blockchain = "eth"; //Switch to "neo" for NEO

    //Load existing wallet
    let passport = await loadPassport('./examples/passport.json', _password);

    //Unlock the wallet
    let wallet = await getUnlockedWallet(passport, blockchain, _password);

    let nftContract = "0x7d256d82b32d8003d1ca1a1526ed211e6e0da9e2";
    let nftTokenId = 5800;

    //Add a NFT to the passport
    passport.addNft(wallet.network, nftContract, nftTokenId);

    //Retrieve the NFT from the passport
    let nft = passport.getNft(wallet.network, nftContract, nftTokenId);

    //Remove NFT from the passport
    //passport.removeNft(wallet.network, nftContract, nftTokenId);

    //Get the NFT details
    let details = await _bridge.Services.Blockchain.getNft(wallet.network, nft.contract, nft.tokenId);
    console.log(JSON.stringify(details));

    //Transfer the NFT
    if(details.isOwner){
        let tx = await _bridge.Services.Blockchain.sendNft(wallet, "0xbcEb0032CbFc5C7e697dFb74b56D05dfB13b93F0", nft.contract, nft.tokenId);
        console.log("NFT transferred - tx:" + JSON.stringify(tx));
    }
    else{
        console.log("Address does not own NFT");
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

Init();