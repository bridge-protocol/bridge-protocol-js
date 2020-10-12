const _constants = require("../constants").Constants;
const _openApi = require('../utils/openApi').OpenAPIUtility;
const _apiBaseUrl = "http://localhost:60525/api/relay/" //_constants.bridgeApiUrl + "relay/";

class RequestRelayApi
{
    async createRequest(type, request)
    {
        return await _openApi.callApi("POST", _apiBaseUrl + "request", { request, type });
    }

    async getRequest(id){
        return await _openApi.callApi("GET", _apiBaseUrl + "request/" + id);
    }

    async createResponse(id, response){
        return await _openApi.callApi("POST", _apiBaseUrl + "response/" + id, { response });
    }

    async getResponse(id){
        return await _openApi.callApi("GET", _apiBaseUrl + "response/" + id);
    }
};

exports.RequestRelayApi = new RequestRelayApi();