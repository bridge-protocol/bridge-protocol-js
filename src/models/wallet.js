const _neo = require('../utils/neo').NEO;
const _eth = require('../utils/ethereum').Ethereum;
const _bsc = require('../utils/bsc').Bsc;

var wallet = class Wallet
{
    constructor(network, address, key)
    {
        if(!network)
            throw new Error("network is required");

        this.network = network;
        this.key = key;
        this.address = address;
        this.unlocked = null;
    }

    get privateKey(){
        if(!this.unlocked)
            throw new Error("wallet not unlocked");

        if(this.network.toLowerCase() === "neo"){
            return this.unlocked.WIF;
        }
        else if(this.network.toLowerCase() === "eth" || this.network.toLowerCase() === "bsc"){
            return this.unlocked.getPrivateKeyString();
        }
    }

    async create(password, privateKey){
        console.log(`creating wallet for ${this.network.toUpperCase()}`);
        let wallet;
        if(this.network.toLowerCase() === "neo"){
            wallet = await _neo.createWallet(password, privateKey);
        }
        else if(this.network.toLowerCase() === "eth"){
            wallet = _eth.createWallet(password, privateKey);
        }
        else if(this.network.toLowerCase() === "bsc"){
            wallet = _bsc.createWallet(password, privateKey);
        }

        this.network = wallet.network;
        this.address = wallet.address;
        this.key = wallet.key;
    }

    export(){
        return {
            network: this.network,
            address: this.address,
            key: this.key
        };
    }

    async unlock(password){
        if(this.unlocked) //If we're unlocked, don't need to unlock
            return true;

        console.log(`unlocking wallet for ${this.network}`);
        if(this.network.toLowerCase() === "neo"){
            this.unlocked = await _neo.unlockWallet(this, password);
        }
        else if(this.network.toLowerCase() === "eth"){
            this.unlocked = await _eth.unlockWallet(this, password);
        }
        else if(this.network.toLowerCase() === "bsc"){
            this.unlocked = await _bsc.unlockWallet(this,password);
        }
        return this.unlocked != null;
    }
}

exports.Wallet = wallet;