const UNISWAP = require('@uniswap/sdk');
const _tokenAddress = "0xb736bA66aAd83ADb2322D1f199Bfa32B3962f13C";
const _tokenDecimals = 18;
const _tokenTicker = "BRDG";
const _tokenName = "Bridge Protocol";

class Uniswap{
    async createTrade(address, amountIn, route, slippagePercent){
        if(!address)
            throw new Error("Address not provided");
        if(!amountIn)
            throw new Error("Amount in not provided.");
        if(!route)
            throw new Error("Route not provided");
        if(!slippagePercent)
            slippagePercent = '50';
    
        //Allow decimal amount and convert
        amountIn = amountIn * 100000000000000000;
    
        try{
            let token = route.pairs[0].token0;
            const trade = new UNISWAP.Trade(route, new UNISWAP.TokenAmount(UNISWAP.WETH[token.chainId], amountIn), UNISWAP.TradeType.EXACT_INPUT)
            console.log(trade.executionPrice.toSignificant(6));
            console.log(trade.nextMidPrice.toSignificant(6));
    
            const slippageTolerance = new UNISWAP.Percent(slippagePercent.toString(), '10000') // 50 bips, or 0.50%
            const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
            const path = [UNISWAP.WETH[token.chainId].address, token.address]
            const to = address; // should be a checksummed recipient address
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
            const value = trade.inputAmount.raw // // needs to be converted to e.g. hex
            const exchange = route.pairs[0].liquidityToken;

            return {
                amountIn,
                token,
                route,
                slippageTolerance,
                amountOutMin,
                path,
                to,
                deadline,
                value,
                exchange
            }
        }
        catch(err){
            console.log(err);
        }
    
        return null;
    }
    
    async getRouteInfo(pair){
        return new UNISWAP.Route([pair], UNISWAP.WETH[pair.token0.chainId]);
    }
    
    async getPairInfo(tokenAddress, tokenDecimals, tokenTicker, tokenName){
        let token = new UNISWAP.Token(
            UNISWAP.ChainId.MAINNET,
            tokenAddress,
            tokenDecimals,
            tokenTicker,
            tokenName
        );
    
        return await UNISWAP.Fetcher.fetchPairData(token, UNISWAP.WETH[token.chainId]);
    }

    async tradeTokens(trade)
    {
        //require(DAI.transferFrom(msg.sender, address(this), amountIn), 'transferFrom failed.');
        //require(DAI.approve(address(UniswapV2Router02), amountIn), 'approve failed.');
        //address[] memory path = new address[](2);
        //path[0] = address(DAI);
        //path[1] = UniswapV2Router02.WETH();
        //UniswapV2Router02.swapExactTokensForETH(amountIn, amountOutMin, path, msg.sender, block.timestamp);
    }
}

exports.Uniswap = new Uniswap();