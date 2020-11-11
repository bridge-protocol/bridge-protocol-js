
const _switcheo = require("switcheo-js");
const _config = {
    url: 'https://api.switcheo.network/v2',
    contract: 'a195c1549e7da61b8da315765a790ac7e7633b82'
}

class Switcheo{
    async getPair(){
        let tickers = await _switcheo.default.get(_config.url + "/exchange/pairs?show_details=0");

        for (const ticker of tickers) {
            if(ticker.name == "BRDG_NEO")
                return ticker;
        }

        return null;
    }

    async getPrice(){
        let tokens = await _switcheo.api.tokens.get(_config, { showUsdValue:true });
        let tickers = await _switcheo.default.get(_config.url + "/tickers/last_price?symbols=BRDG");
        return {
            neo: tickers.BRDG.NEO,
            usd: tokens.BRDG.usdValue,
        }
    }

    async getTimestamp(){
        return await _switcheo.default.get(_config.url + "/v2/exchange/timestamp");
    }

    async deposit(address, privateKey){
        let blockchain = 'neo';
        let assetID = 'NEO';
        let amount = _switcheo.default.toAsstoAssetAmount(1, 'NEO');
        let timestamp = this.getTimestamp();

        const signableParams = { blockchain, assetID, amount, timestamp, contractHash: _config.contract }
        const signature = signParams(signableParams, privateKey)
        const apiParams = { signableParams, address, signature }

        return switcheo.api.post(_config.url + '/deposits', apiParams)
    }
}

exports.Switcheo = new Switcheo();