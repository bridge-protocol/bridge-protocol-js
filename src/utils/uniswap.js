const _constants = require('../constants').Constants;
const _rpcUrl = _constants.ethereumJsonRpcUrl;
const Web3 = require("web3");
const _web3 = new Web3(new Web3.providers.HttpProvider(_rpcUrl));
const UNISWAP = require('@uniswap/sdk');
const _tokenAddress = "0xb736bA66aAd83ADb2322D1f199Bfa32B3962f13C";
const _tokenDecimals = 18;
const _tokenTicker = "BRDG";
const _tokenName = "Bridge Protocol";

class Uniswap{
    async getPairInfo(){
        const BRDG = new UNISWAP.Token(UNISWAP.ChainId.MAINNET, _tokenAddress, _tokenDecimals)
        return await UNISWAP.Fetcher.fetchPairData(BRDG, UNISWAP.WETH[BRDG.chainId]);
    }

    async createSwap(address, amount, slippagePercent){
        if(!address)
            throw new Error("Address not provided");
        if(!amount)
            throw new Error("Amount out not provided.");
        if(!slippagePercent)
            slippagePercent = 50;
    
        try{
            const BRDG = new UNISWAP.Token(UNISWAP.ChainId.MAINNET, _tokenAddress, _tokenDecimals)
            const pair = await UNISWAP.Fetcher.fetchPairData(BRDG, UNISWAP.WETH[BRDG.chainId])
            const route = new UNISWAP.Route([pair], UNISWAP.WETH[BRDG.chainId])

            amount = _web3.utils.toWei(amount.toString());
            const trade = new UNISWAP.Trade(route, new UNISWAP.TokenAmount(pair.token0, amount), UNISWAP.TradeType.EXACT_OUTPUT);
            const slippageTolerance = new UNISWAP.Percent(slippagePercent.toString(), '10000');
            const amountOut = Math.floor(trade.minimumAmountOut(slippageTolerance).toExact());
            const path = [UNISWAP.WETH[BRDG.chainId].address, BRDG.address]
            const to = address
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
            const value = trade.inputAmount.toExact()
            const brdgPerEth = trade.nextMidPrice.toSignificant(6);

            return {
                amountOut,
                path,
                to,
                deadline,
                value,
                brdgPerEth
            }
        }
        catch(err){
            console.log(err);
        }
    
        return null;
    }
}

exports.Uniswap = new Uniswap();