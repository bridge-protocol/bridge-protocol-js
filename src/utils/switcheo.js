const stringify = require('json-stable-stringify')
const { u, wallet, tx } = require('@cityofzion/neon-js')
const { mapKeys, snakeCase } = require('lodash')
const _switcheo = require("switcheo-js")
const _config = {
    url: 'https://api.switcheo.network/v2',
    contract: 'a32bcf5d7082f740a4007b16e812cf66a457c3d4'
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

    async deposit(wif, amount){
        const params = {
            amount: amount * 100000000,
            asset_id: "NEO",
            blockchain: 'neo',
            contract_hash: _config.contract,
            timestamp: new Date().getTime()
        };

        let account = new wallet.Account(wif);
        let privateKey = account.privateKey;
        let address = account.scriptHash;

        const signature = this.signParams(params, privateKey);
        const deposit = await _switcheo.default.post(_config.url + '/deposits', { ...params, address, signature });
        const txSignature = this.signTransaction(deposit.transaction, privateKey);
        return await _switcheo.default.post(_config.url + '/deposits/' + deposit.id + '/broadcast', { signature: txSignature });
    }

    signParams(params, privateKey) {
        const payload = JSON.stringify(params);
        const encodedPayload = this.encodeMessage(payload)
        return this.signMessage(encodedPayload, privateKey);
    }

    encodeMessage(message) {
        const messageHex = u.str2hexstring(message)
        const messageLengthHex = u.num2VarInt(messageHex.length / 2)
        const encodedMessage = `010001f0${messageLengthHex}${messageHex}0000`
        return encodedMessage
    }

    signMessage(message, privateKey) {
        return wallet.generateSignature(message, privateKey)
    }

    signTransaction(tx, privateKey) {
        let transaction = new tx.InvocationTransaction(tx);
        const serializedTxn = transaction.serialize();
        return signMessage(serializedTxn, privateKey);
    }

    stringifyParams(params) {
        const snakeCaseParams = this.convertKeysToSnakeCase(params)
        // use stringify from json-stable-stringify to ensure that
        // params are sorted in alphabetical order
        return stringify(snakeCaseParams);
    }

    convertKeysToSnakeCase(obj) {
        return mapKeys(obj, (_, k) => snakeCase(k))
    }
}

exports.Switcheo = new Switcheo();