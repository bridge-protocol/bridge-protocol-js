const Web3 = require("web3");
const _constants = require('../constants').Constants;
const _fetch = require('node-fetch');
const _tx = require("ethereumjs-tx");
const _wallet = require('ethereumjs-wallet');
const _util = require("ethereumjs-util");
const _abi = [{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"claimType","type":"string"},{"internalType":"uint256","name":"claimDate","type":"uint256"},{"internalType":"string","name":"claimValue","type":"string"}],"name":"publishClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"passport","type":"string"}],"name":"publishPassport","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"claimType","type":"string"}],"name":"removeClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"unpublishPassport","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"passport","type":"string"}],"name":"getAddressForPassport","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"claimType","type":"string"}],"name":"getClaim","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getPassportForAddress","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];
const _tokenAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"memo","type":"string"}],"name":"Memo","type":"event"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"memo","type":"string"}],"name":"transferWithMemo","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
const _nftAbi = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"string","name":"baseTokenURI","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const _uniswapExchangeAbi = [{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"}];
const _rpcUrl = _constants.ethereumJsonRpcUrl;
const _etherscanApiUrl = _constants.etherscanApiUrl;
const _etherscanUrl = _constants.etherscanUrl;
const _chain = _constants.bridgeEthereumChain;
const _gasLimit = _constants.defaultEthereumGasLimit;
const _bridgeContractAddress = _constants.bridgeEthereumContractAddress;
const _bridgeTokenContractAddress = _constants.bridgeEthereumERC20Address;
const _web3 = new Web3(new Web3.providers.HttpProvider(_rpcUrl));
const _contract = new _web3.eth.Contract(_abi, _bridgeContractAddress);
const _token = new _web3.eth.Contract(_tokenAbi, _bridgeTokenContractAddress);
const UNISWAP = require('@uniswap/sdk');
const _openSea = require('opensea-js');

class Ethereum { 
    constructor(){
        this.seaport = new _openSea.OpenSeaPort(new Web3.providers.HttpProvider(_rpcUrl), {
            networkName: _openSea.Network.Main
        })
    }

    //Wallet Management Functions
    createWallet(password, privateKeyString){ 
        let wallet;

        if(!privateKeyString){
            console.log("creating new ETH wallet");
            wallet = _wallet.generate();
        }
        else{
            console.log("importing ETH wallet from private key");
            const privateKeyBuffer = _util.toBuffer(privateKeyString);
            wallet = _wallet.fromPrivateKey(privateKeyBuffer);
        }

        return this._getwallet(wallet, password);
    }

    getWalletFromKeystore(keystore, password){
        let wallet = _wallet.fromV3(keystore, password);
        return this._getwallet(wallet, password);
    }

    async unlockWallet(wallet, password){
        if(!wallet || !wallet.key)
            throw new Error("No key provided to unlock");
        if(!password)
            throw new Error("No password provided");

        return this._decryptWallet(wallet.key, password);
    }
    
    _getwallet(wallet, password){
        if(!wallet)
            throw new Error("no wallet specified");
        if(!password)
            throw new Error("no password specified");

        let encryptedKey = wallet.toV3(password);
        return {
            network: "ETH",
            address: wallet.getAddressString(),
            key: encryptedKey
        };
    }

    _decryptWallet(key, password){
        return _wallet.fromV3(key, password);
    }
    //End wallet management functions

    //Asset and transaction management functions
    async getOracleGasPrice(){
        try{
            let res = await this._callEtherscan("&module=gastracker&action=gasoracle");
            if(res && res.status == "1" && res.result && res.result.ProposeGasPrice){
                var price = parseInt(res.result.ProposeGasPrice);
                if(price < _constants.defaultEthereumGwei)
                    price = _constants.defaultEthereumGwei;
    
                return price;
            }
        }
        catch(err){

        }

        return _constants.defaultEthereumGwei;
    }

    async getTransactionCost(gas){
        return await this._getTransactionCost(gas);
    }

    async getAddressBalances(address){
        let eth = await this.getEthBalance(address);
        let brdg = await this.getBrdgBalance(address);
        return [{asset:"ETH", balance: eth}, {asset: "BRDG", balance: brdg}];
    }

    async getNftsForAddress(owner){
        let res = await this.seaport.api.getAssets({ owner });
        if(res && res.assets)
            return res.assets;

        return null;
    }

    async getNft(nftContract, tokenId) {
        let res = await this.seaport.api.getAssets({ asset_contract_address: nftContract, token_ids: [tokenId] });
        if(res && res.assets && res.assets[0])
            return res.assets[0];
    };

    async sendNft(wallet, to, nftContract, tokenId, wait, nonce, costOnly){
        let contract = new _web3.eth.Contract(_nftAbi, nftContract);
        let tx = contract.methods.safeTransferFrom(wallet.address, to, tokenId);

        if(costOnly){
            return await this._getTransactionCost(50000);
        }
        else{
            let data = tx.encodeABI();
            return await this._broadcastTransaction(wallet, nftContract, data, wait, nonce);
        }
    }

    async getEthBalance(address) {
        let res = await this._callEtherscan("&module=account&action=balance&address=" + address + "&tag=latest");
        if(!res || res.status != "1"){
            console.log("Error getting balance.");
            return 0;
        }

        return _web3.utils.fromWei(res.result);
    };

    async getBrdgBalance(address){
        let res = await this._callEtherscan("&module=account&action=tokenbalance&contractaddress=" + _bridgeTokenContractAddress + "&address=" + address + "&tag=latest");
        if(!res || res.status != "1"){
            console.log("Error getting balance.");
            return 0;
        }

        return _web3.utils.fromWei(res.result);
    }

    async getBrdgTransactions(address){
        let res = await this._callEtherscan("&module=account&action=tokentx&contractaddress=" + _bridgeTokenContractAddress + "&address=" + address + "&startblock=0&endblock=999999999&sort=desc");
        if(!res || res.status != "1"){
            console.log("Error getting transactions.");
            return null;
        }

        let txs = [];
        for(let i=0; i<res.result.length; i++){
            let tx = res.result[i];
            txs.push({
                hash: tx.hash,
                timeStamp: tx.timeStamp,
                amount: _web3.utils.fromWei(tx.value),
                from: tx.from,
                to: tx.to,
                url: _etherscanUrl + "/tx/" + tx.hash
            });
        }
            
        return txs;
    }

    async sendEth(wallet, recipient, amount, identifier, wait, nonce, costOnly)
    {
        if(costOnly){
            return await this._getTransactionCost(22000);
        }

        return await this._broadcastTransaction(wallet, recipient, identifier, wait, nonce, amount);
    }

    async sendBrdg(wallet, recipient, amount, memo, wait, nonce, costOnly){
        //Amount is 18 decimals
        amount = _web3.utils.toWei(amount.toString(), "ether");

        let tx = _token.methods.transferWithMemo(recipient, amount, memo);
        if(costOnly){
            return await this._getTransactionCost(52000);
        }
        else{
            let data = tx.encodeABI();
            return await this._broadcastTransaction(wallet, _bridgeTokenContractAddress, data, wait, nonce);
        }
    }

    async getTransactionStatus(hash){
        let complete = false;
        let success = false;

        console.log("Getting status for ETH " + hash);

        let completeRes = await this._callEtherscan("&module=transaction&action=gettxreceiptstatus&txhash=" + hash);
        if(completeRes && completeRes.status === "1" && completeRes.result && completeRes.result.status === "1")
            complete = true;
        else{
            console.log("Could not get the receipt status.");
            return { complete: false, success: false };
        }
            

        let successRes = await this._callEtherscan("&module=transaction&action=getstatus&txhash=" + hash);
        if(successRes && successRes.status === "1" && successRes.result && successRes.result.isError === "0")
            success = true;
        else
            console.log("Could not get the success status, possibly not verified on the blockchain yet.");

        return { complete, success };
    }

    async verifyTokenPaymentFromHash(hash, from, to, amount, memo){
        let info = await this._getTransactionInfo(hash);
        if(!info){
            console.log("Unable to retrieve transaction info for " + hash);
            return { complete: false, success: false };
        }

        return this.verifyTokenPayment(info, from, to, amount, memo);
    }

    async verifyTokenPayment(info, from, to, amount, memo){
        let senderValid = false;
        let recipientValid = false;
        let amountValid = false;
        let memoValid = false;

        if(!info.logs || info.logs.length == 0)
            return { complete: false, success: false };

        for(let i=0; i<info.logs.length; i++){
            let log = info.logs[i];
            if(log.topics != null && log.topics[0] == "0xb0734c6ca9ae9b7406dd80224cb0488aed0928eef358da7449505fa59b8d7a2a"){
                memoValid = _web3.utils.hexToUtf8(log.data).includes(memo);
            }
            else if(log.topics != null && log.topics.length == 3){
                let amountTopic = BigInt(log.data);
                let amountString = amountTopic.toString();
                amountTopic = _web3.utils.fromWei(amountString);

                let senderTopic = this._removeHexBytes(log.topics[1],12);
                let recipientTopic = this._removeHexBytes(log.topics[2],12);

                //Set the flags
                senderValid = from.toLowerCase() == senderTopic; 
                recipientValid = to.toLowerCase() == recipientTopic;
                amountValid = amount == amountTopic;
            }
        }

        let success = senderValid && recipientValid && amountValid && memoValid;
        return { complete: true, success };
    };

    async verifyEthPaymentFromHash(hash, from, to, amount, memo){
        let info = await _web3.eth.getTransaction(hash);
        if(!info){
            console.log("Unable to retrieve transaction info for " + hash);
            return { complete: false, success: false };
        }

        return this.verifyEthPayment(info, from, to, amount, memo);
    }

    async verifyEthPayment(info, from, to, amount, memo){
        let senderValid = false;
        let recipientValid = false;
        let amountValid = false;
        let memoValid = false;

        //Check the sender
        if(info.from.toUpperCase() == from.toUpperCase())
            senderValid = true;

        //Check the recipient
        if(info.to.toUpperCase() == to.toUpperCase())
            recipientValid = true;

        //Get the value in gwei
        let value = _web3.utils.fromWei(info.value, "ether");
        if(parseFloat(value) == parseFloat(amount))
            amountValid = true;
        
        //Check the input data for our identifier
        let input = _web3.utils.hexToUtf8(info.input);
        if(input.includes(memo))
            memoValid = true;

        let success = senderValid && recipientValid && amountValid && memoValid;
        return { complete: true, success };
    };

    async sendUniswapTransaction(wallet, swap, costOnly){
        if(costOnly){
            return await this._getTransactionCost(150000); //Max gas cost
        }

        const routerv2 = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
        const _uniswapExchange = new _web3.eth.Contract(_uniswapExchangeAbi, routerv2);    
        let tx = _uniswapExchange.methods.swapETHForExactTokens(_web3.utils.toWei(swap.amountOut.toString()), swap.path, swap.to, swap.deadline);
        
        try{
            let data = tx.encodeABI();
            return await this._broadcastTransaction(wallet, routerv2, data, false, null, swap.value);
        }
        catch(err){
            console.log(err.message);
        }

        return null;
    }
    //End asset and transaction management functions

    //This can only be called by Bridge
    async publishClaim(wallet, claim, wait, nonce, costOnly){
        if(!wallet)
            throw new Error("Wallet is required");
        if(!claim)
            throw new Error("Claim is required");

        //If we're marked to publish hash only, use the hash for the value
        var claimValue = claim.claimValue;
        if (claim.hashOnly)
            claimValue = claim.claimValueHash;

        if(costOnly)
        {
            let len = Buffer.byteLength(claimValue, 'utf8');
            return await this._getTransactionCost((len * 2100)); //Use character length of the value, storage cost will be variable
        }
        else{
            let tx = _contract.methods.publishClaim(wallet.address, claim.claimTypeId, claim.createdOn, claimValue);
            let data = tx.encodeABI();
            return await this._broadcastTransaction(wallet, _bridgeContractAddress, data, wait, nonce);
        }
    }

    async removeClaim(wallet, claimType, wait, nonce, costOnly){
        if(!claimType)
            throw new Error("Claim type is required.");

        let tx = _contract.methods.removeClaim(claimType);
        if(costOnly){
            return await this._getTransactionCost(30000);
        }
        else{
            let data = tx.encodeABI();
            return await this._broadcastTransaction(wallet, _bridgeContractAddress, data, wait, nonce);
        }
    }

    async publishPassport(wallet, passport, wait, nonce, costOnly){
        let tx = _contract.methods.publishPassport(passport);
        if(costOnly){
            return await this._getTransactionCost(120000);
        }
        else{
            let data = tx.encodeABI();
            return await this._broadcastTransaction(wallet, _bridgeContractAddress, data, wait, nonce);
        }
    }

    async getPassportForAddress(address){
        let account = address;
        return await _contract.methods.getPassportForAddress(account).call();
    }

    async getAddressForPassport(passportId){
        return await _contract.methods.getAddressForPassport(passportId).call();
    }
    
    async unpublishPassport(wallet, wait, nonce, costOnly){
        let tx = _contract.methods.unpublishPassport();
        if(costOnly){
            return await this._getTransactionCost(24000);
        }
        else{
            const data = tx.encodeABI();
            return await this._broadcastTransaction(wallet, _bridgeContractAddress, data, wait, nonce);
        }
    }

    async getClaimForAddress(address, claimType){
        let account = address;
        let res = await _contract.methods.getClaim(account, claimType.toString()).call();
        if(res.length == 0 || res == " 0 ")
            return null;

        res = res.replace(/\0/g,"").trim();
        let idx1 = res.indexOf(" ");
        let idx2 = res.indexOf(" ", idx1+1);
        let claim = {
            type: res.substring(0, idx1),
            date: res.substring(idx1+1,idx2),
            value: res.substring(idx2+1, res.length)
        };

        return claim;
    };
    //End smart contract for passport and claims management

    async checkConnected(){
        return new Promise(async (resolve, reject) => {
            _web3.eth.net.isListening()
            .then(() => resolve(true))
            .catch(e => reject(e));
        });
    };

    async _getTransactionCost(gas){
        let gasPrice = await this._getGasPrice();
        gasPrice = _web3.utils.fromWei(gasPrice, "gwei");
        let cost = gas * gasPrice;
        cost = cost.toFixed(9);

        console.log("Estimated cost: " + cost);
            return cost;
    }

    async _getGasPrice(){
        //Just fix gas price at 12 for now
        let gasPriceGwei = await this.getOracleGasPrice();
        console.log("Proposed gas price: " + gasPriceGwei + " gwei");
        return gasPriceGwei.toString();
    }

    async _broadcastTransaction(wallet, address, data, wait, nonce, ether){
        if(!wallet.unlocked)
            throw new Error("Wallet is not unlocked.");
        if(!address)
            throw new Error("Address or contract is not specified.");
        
        let walletAddress = wallet.unlocked.getAddressString();
        let privateKey = wallet.unlocked.getPrivateKey();
        let gasPrice = await this._getGasPrice();
        
        return new Promise((resolve,reject) => {
            _web3.eth.getTransactionCount(walletAddress, "pending", (err, txCount) => {
                if(!nonce || txCount > nonce)
                    nonce = txCount;

                if(!ether)
                    ether = 0;
                
                // Build the transaction
                const txObject = {
                    nonce:    _web3.utils.toHex(nonce), 
                    to:       address,
                    value:    _web3.utils.toHex(_web3.utils.toWei(ether.toString(), "ether")),
                    gasLimit: _web3.utils.toHex(_gasLimit),
                    gasPrice: _web3.utils.toHex(_web3.utils.toWei(gasPrice, "gwei")),
                    data: data  
                };

                // Sign the transaction
                const tx = new _tx(txObject, {"chain":_chain});
                tx.sign(privateKey);
                
                const serializedTx = tx.serialize();
                const raw = "0x" + serializedTx.toString("hex");

                if(wait)
                {
                    _web3.eth.sendSignedTransaction(raw)
                    .on('receipt', (info) => {
                        console.log("transaction confirmed");
                        resolve(info);
                    })
                    .catch((err) => { 
                        console.log("transaction could not be confirmed: " + err); 
                        reject(err);
                    });
                }
                else
                {
                    _web3.eth.sendSignedTransaction(raw)
                    .on('transactionHash',(hash) => {
                        console.log("transaction confirmed");
                        resolve(hash);
                    })
                    .catch((err) => { 
                        reject(err);
                    });
                }
            });
        });
    }

    async _getTransactionInfo(hash){
        return await _web3.eth.getTransactionReceipt(hash);
    }

    async _callEtherscan(params) {
        let options = {
            method: 'GET'
        };

        let url = _etherscanApiUrl + params;
        const response = await _fetch(url, options);

        if (response.ok) {
            let text = await response.text();
            if (text.length > 0)
                return JSON.parse(text);
            else
                return true;
        }
        else {
            var error = response.statusText;
            let text = await response.text();
            if (text) {
                var res = JSON.parse(text);
                if (res && res.message)
                    error = res.message;
            }
            else
                text = response.statusText;

            console.log(error);
            return {};
        }
    }

    _removeHexBytes(hex, startIdx){
        if(!startIdx)
            startIdx = 0;

        let bytes = _web3.utils.hexToBytes(hex);
        return _web3.utils.bytesToHex(bytes.slice(startIdx,bytes.length));
    }
};

exports.Ethereum = new Ethereum();